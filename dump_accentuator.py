import re, sys, os
import _pickle
from pymongo import MongoClient
db = MongoClient()["nlp"]

accentuator = {}
for i, entry in enumerate(db["dela_fr"].find({}, {"form":1, "unidecode_form":1}, no_cursor_timeout=True)):
    if i % 1000 == 0:
        print(i)
    unidecode_form = entry["unidecode_form"]
    if unidecode_form != entry["form"] and db["dela_fr"].find_one({"form":unidecode_form}) == None:
        if unidecode_form not in accentuator:
            accentuator[unidecode_form] = set()
        accentuator[unidecode_form].add(entry["form"])

with open("./data/nlp/accentuator.pkl", "wb") as pkl_file:
    _pickle.dump(accentuator, pkl_file)


