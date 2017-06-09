# -*- coding: utf-8 -*-
"""
Stores the codes that are discontinued from 2013 to 2016. This script is only needed because we do not have the geometries corresponding to 2016 and thus, the 2013 geometries have to be linked with the 2016 codes. They are stored in 'discontinued_2016.txt' in JSON.

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

query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX scheme: <http://data.europa.eu/nuts/scheme/> PREFIX nuts: <http://data.europa.eu/nuts/> SELECT DISTINCT ?s WHERE { ?s skos:inScheme <http://data.europa.eu/nuts/scheme/2013>. MINUS { ?s skos:inScheme ?sch. FILTER (?sch = scheme:2016) } MINUS { ?s ?prop ?val. FILTER (?prop = nuts:mergedInto || ?prop = nuts:splitInto || ?prop = <http://purl.org/dc/terms/isReplacedBy>) }}"

sparql.setQuery(query)
props = sparql.query().convert()

with open('discontinued_2016.txt', 'w') as outfile:
	outfile.seek(0)
	outfile.truncate()
	json.dump(props, outfile)

	
print "end"