# -*- coding: utf-8 -*-
"""
Checks if a NUTS code changed between years

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
	
query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX code: <http://data.europa.eu/nuts/code/> PREFIX scheme: <http://data.europa.eu/nuts/scheme/> PREFIX nuts: <http://data.europa.eu/nuts/> SELECT ?old ?newuri ?code ?label WHERE { GRAPH <http://52.50.205.146/NUTS-codes> { ?old <http://data.europa.eu/nuts/splitInto> ?newuri; skos:inScheme scheme:" + year + "; nuts:level ?level. ?newuri skos:notation ?code; nuts:level ?level. ?newuri skos:prefLabel ?label. }}"

sparql.setQuery(query)
props = sparql.query().convert()

with open('changes_split_'+year+'.txt', 'w') as outfile:
	outfile.seek(0)
	outfile.truncate()
	json.dump(props, outfile)

	
print "end"