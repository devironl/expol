import re, sys, os
import _pickle
from pymongo import MongoClient
db = MongoClient()["nlp"]

unicode_lemmatizer = {}
unidecode_lemmatizer = {}
for entry in db["dela_fr"].find({}, {"form":1, "ud_pos":1, "unidecode_form":1, "lemma":1}, no_cursor_timeout=True):
    term = "%s_%s" % (entry["form"], entry["ud_pos"])
    if term not in unicode_lemmatizer:
        unicode_lemmatizer[term] = []
    unicode_lemmatizer[term].append(entry["lemma"])

    unidecode_term = "%s_%s" % (entry["unidecode_form"], entry["ud_pos"])
    if unidecode_term not in unidecode_lemmatizer:
        unidecode_lemmatizer[unidecode_term] = []
    unidecode_lemmatizer[unidecode_term].append(entry["lemma"])

#lemmatizer = {"unicode":unicode_lemmatizer, "unidecode": unidecode_lemmatizer}
with open("./data/nlp/lemmatizer.pkl", "wb") as pkl_file:
    _pickle.dump(unicode_lemmatizer, pkl_file)


