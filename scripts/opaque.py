from random import choice
from rdflib import URIRef

"""
functions for creating new opaque nodes copied from 
https://perso.liris.cnrs.fr/pchampin/rdfrest/_modules/rdfrest/util.html
"""


def make_fresh_uri(graph, prefix, suffix="", min_length=3):
    """Creates a URIRef which is not in graph, with given prefix and suffix.
    """
    length = min_length
    while True:
        node = URIRef("%s%s%s" % (prefix, random_token(length), suffix))
        if check_new(graph, node):
            return node
        length += 1


def random_token(length, characters="0123456789abcdefghijklmnopqrstuvwxyz",
                 firstlimit=10):
    """Create a random opaque string.

    :param length:     the length of the string to generate
    :param characters: the range of characters to use
    :param firstlimit: see below

    The parameter `firstlimit` is use to limit the first character of the token
    to a subrange of `characters`. The default behaviour is to first the first
    character of the token to be a digit, which makes it look more "tokenish".
    """
    if firstlimit is None:
        firstlimit = len(characters)
    lst = [choice(characters[:firstlimit])] \
          + [choice(characters) for _ in range(length - 1)]
    return "".join(lst)


def check_new(graph, node):
    """Check that node is absent from graph.
    """
    if next(graph.predicate_objects(node), None) is not None:
        return False
    if next(graph.subject_predicates(node), None) is not None:
        return False
    return True
