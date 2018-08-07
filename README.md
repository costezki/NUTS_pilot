# NUTS_pilot extension 
This extension of the NUTS pilor ptoject inclused the generation of the GISCO 
including the geography descriptions pointing towards [GISCO datasets](http://ec.europa.eu/eurostat/cache/GISCO/distribution/v1/)

The generated NUTS extension can be found [here](https://github.com/costezki/NUTS_pilot/blob/master/datasets/nuts_links.ttl).

The source code for generating can be found [here](https://github.com/costezki/NUTS_pilot/blob/master/scripts/geometry_gen.py).

##Install

Use Python 3.6.

Install prerequisites and then the [GISCO webservice util](https://github.com/eurostat/happyGISCO).
```
sudo pip3 install simplejson python-Levenshtein pandas geopy googlemaps CACHECONTROL REQUESTS_CACHE python-google-places
git clone https://github.com/eurostat/happyGISCO
cd happyGISCO
sudo pip3 install .
```

Install prerequisites for this tool.
```
sudo pip3 install rdflib requests
``` 
