import requests
import rdflib
from scripts import opaque
from rdflib.namespace import FOAF, SKOS, DCTERMS, RDF
from rdflib.plugins.sparql import prepareQuery
from happygisco import services as gs

NUTS_DATASET = "../datasets/nuts_final.rdf"

SCHEME_2010 = rdflib.URIRef("http://data.europa.eu/nuts/scheme/2010")
SCHEME_2013 = rdflib.URIRef("http://data.europa.eu/nuts/scheme/2013")
SCHEME_2016 = rdflib.URIRef("http://data.europa.eu/nuts/scheme/2016")

ADMS = rdflib.Namespace('http://www.w3.org/ns/adms#')
NUTS_NS = rdflib.Namespace('http://data.europa.eu/nuts/')
ADMS = rdflib.Namespace('http://www.w3.org/2004/02/skos/core#')
SKOSXL = rdflib.Namespace('http://www.w3.org/2008/05/skos-xl#')
LOCN = rdflib.Namespace('https://www.w3.org/ns/locn#')
DCAT = rdflib.Namespace('https://www.w3.org/TR/vocab-dcat/')
MDR_FT = rdflib.Namespace('http://publications.europa.eu/resource/authority/file-type/')

NUTS_DISTR = rdflib.Namespace('http://data.europa.eu/nuts/distribution/')
NUTS_GEO = rdflib.Namespace('http://data.europa.eu/nuts/geometry/')
NUTS_CODE = rdflib.Namespace('http://data.europa.eu/nuts/code/')

GEOJSON_FORMAT = rdflib.URIRef("http://publications.europa.eu/resource/authority/file-type/GEOJSON")


def get_nuts_graph():
    g = rdflib.Graph()
    g.parse(NUTS_DATASET)
    return g


def list_of_codes(nuts_ds=get_nuts_graph(), scheme=SCHEME_2016):
    """

    :param nuts_ds:
    :param scheme:
    :return:

    >>> len(list_of_codes())
    1846
    """
    q = prepareQuery(
        'select distinct ?code ?notation ?level ?scheme'
        'where'
        '{'
        '?code a skos:Concept .'
        '?code skos:notation ?notation .'
        '?code <http://data.europa.eu/nuts/level> ?level .'
        '?code skos:inScheme ?scheme.'  # <http://data.europa.eu/nuts/scheme/2016>
        '}'
        ,
        initNs={"foaf": FOAF, "skos": SKOS})

    return nuts_ds.query(q, initBindings={'scheme': scheme})


def generate_geometry_instances(nuts_ds=get_nuts_graph(), scheme=SCHEME_2016):
    """
     use GISCO API v2 available here:
    http://ec.europa.eu/eurostat/cache/GISCO/distribution/v2/nuts/nuts-2016-units.html

    most likely nuts-2016-units.json contains what is needed gor a good iteration

    entry page overview, in human readable format
    http://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts#nuts16

    use https://github.com/eurostat/happyGISCO project to determine how API calls work
    """
    # creating an instance of GISCO API service that will generate the URL calls to NUTS shape files
    serv = gs.GISCOService()

    # the resulting graph
    gg = rdflib.Graph()
    gg.bind("skos", SKOS)
    gg.bind("skosxl", SKOSXL)
    gg.bind("nuts", NUTS_NS)
    gg.bind("locn", LOCN)
    gg.bind("dcat", DCAT)
    gg.bind("dct", DCTERMS)
    gg.bind("adms", ADMS)
    gg.bind("mdrft", MDR_FT)
    gg.bind("ndist", NUTS_DISTR)
    gg.bind("ngeo", NUTS_GEO)
    gg.bind("ncode", NUTS_CODE)

    # starting the generation for each NUTS code
    for row in list_of_codes(nuts_ds, scheme):
        code_uri, notation, level = row[0], row[1], row[2]

        for scl in ["01m", "03m", "10m", "20m", "60m"]:
            # creating Geometry instance
            geometry = opaque.make_fresh_uri(gg, "".join((str(NUTS_NS), "geometry/")), min_length=5)
            gg.add((code_uri, LOCN.geometry, geometry))

            gg.add((geometry, RDF.type, LOCN.Geometry))
            gg.add((geometry, NUTS_NS.scale, rdflib.Literal(scl)))
            gg.add((geometry, NUTS_NS.projection, rdflib.Literal("wgs84")))

            # creating Distributions for various scales

            distribution = opaque.make_fresh_uri(gg, "".join((str(NUTS_NS), "distribution/")), min_length=5)
            gg.add((geometry, DCAT.distribution, distribution))
            gg.add((distribution, RDF.type, DCAT.Distribution))
            gg.add((distribution, DCAT.downloadURL, rdflib.Literal(serv.url_nuts(unit=notation, year=2016, scale=scl))))
            gg.add((distribution, DCTERMS.term("format"), GEOJSON_FORMAT))
            gg.add((distribution, SKOS.note,
                    rdflib.Literal(
                        "for information regarding commercial licensing please see https://eurogeographics.org/products-and-services/licensing")))
            gg.add((distribution, DCTERMS.license,
                    rdflib.URIRef("http://purl.org/NET/rdflicense/EUPL1.1")))
    return gg


def serialise_results(res_graph):
    """

    :param res_graph:
    :return:
    """
    res_graph.serialize(destination="../datasets/nuts_links.ttl", format='turtle')


def test():
    import doctest
    doctest.testmod()


if __name__ == "__main__":
    gg = generate_geometry_instances()
    serialise_results(gg)
    test()
