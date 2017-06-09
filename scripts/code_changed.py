# -*- coding: utf-8 -*-
"""
Checks if a NUTS code changed between years (split, merged and replaced). It stores the changes in a JSON file called 'data_year.txt', one per year.

Python ver: 3.5
"""

__author__ = 'PwC EU Services'

import time

import requests
from SPARQLWrapper import SPARQLWrapper, POST, JSON
from rdflib import Graph
from rdflib.plugins.stores.sparqlstore import SPARQLUpdateStore
from termcolor import colored
import sys
import rdfextras
import json
import io

year = sys.argv[1]

rdfextras.registerplugins() # so we can Graph.query()

headers = {'content-type': 'application/json'}  # HTTP header content type

endpoint_uri = "http://52.50.205.146/sparql"
graph_uri = "http://52.50.205.146/NUTS-codes"

# Set up endpoint and access to triple store
sparql = SPARQLWrapper(endpoint_uri)
sparql.setReturnFormat(JSON)
sparql.setMethod(POST)

# Specify the (named) graph we're working with
sparql.addDefaultGraph(graph_uri)

#If year == 2016, we don't have the new codes in the NUTS file, so we have to check the updates in the 2013 codes
if year == "2016":
	query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX code: <http://data.europa.eu/nuts/code/> PREFIX scheme: <http://data.europa.eu/nuts/scheme/> SELECT ?s WHERE { GRAPH <http://52.50.205.146/NUTS-codes> { ?s rdf:type skos:Concept; skos:inScheme scheme:2013; ?p ?o. FILTER (?p = <http://purl.org/dc/terms/isReplacedBy> || ?p = <http://data.europa.eu/nuts/mergedInto> || ?p = <http://data.europa.eu/nuts/splitInto> ) }}"
else: 
	query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX code: <http://data.europa.eu/nuts/code/> PREFIX scheme: <http://data.europa.eu/nuts/scheme/> SELECT ?s WHERE { GRAPH <http://52.50.205.146/NUTS-codes> { ?s rdf:type skos:Concept; skos:inScheme scheme:" + year + "; ?p ?o. FILTER (?p = <http://purl.org/dc/terms/replaces> || ?p = <http://data.europa.eu/nuts/mergedFrom> || ?p = <http://data.europa.eu/nuts/splitFrom> ) }}"

sparql.setQuery(query)
props = sparql.query().convert()

with open('data_'+year+'.txt', 'w') as outfile:
	outfile.seek(0)
	outfile.truncate()
	json.dump(props, outfile)

print "end"

