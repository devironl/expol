# -*- coding: utf-8 -*-
import re, sys, os, subprocess, json, shutil
from pprint import pprint
from unidecode import unidecode


class DocumentExtractor:

    def __init__(self):
        self.temp_dir = "_temp2"


    def extract_document(self, pdf_path):
        print(pdf_path)
        base = os.path.basename(pdf_path)
        filename, file_extension = os.path.splitext(base)
        year, party, scope = filename.split("_")
        # Safely create dirs
        year_dir = os.path.join("./data/text", year)
        party_dir = os.path.join(year_dir, party)
        if not os.path.exists(year_dir):
            os.makedirs(year_dir)
        if not os.path.exists(party_dir):
            os.makedirs(party_dir)
        if not os.path.exists(os.path.join(party_dir, "%s.json" % filename)):# or (year == "2010" and party == "PS"):
            # Output Json Path
            content = self.extract_content(pdf_path)
            with open(os.path.join(party_dir, "%s.json" % filename), "w") as json_file:
                json.dump(content, json_file)

#    def clean_ps_content(self, content):
#        content = re.sub("[A-Z\n'ÉÈÀ’\s\.0-9\-]{15,}\\b", " ", content)
#        s = re.search("(\\b|\n)([A-Z]{,2}) ([A-Z]{3,})(\\b|\n)", content)
#        if s is not None and db["dela_fr"].find_one({"unidecode_form":unidecode(s.group(2).lower() + s.group(3).lower())}) != None:
#            content = re.sub("(\\b|\n)([A-Z]{,2}) ([A-Z]{3,})(\\b|\n)", "\\1\\2\\3\\4", content, re.MULTILINE)
#        content = re.sub("w allonie", "Wallonie", content, re.IGNORECASE)
#        return content

    def extract_content(self, pdf_path):
        os.makedirs(self.temp_dir)
        pages = {}
        subprocess.call(["pdfseparate", pdf_path, self.temp_dir + "/doc_%d.pdf"])
        for document in os.listdir(self.temp_dir):
            page = int(re.search("_(.+).pdf", document).group(1))
            res = subprocess.call(["pdftotext", os.path.join(self.temp_dir, document), "temp.txt"])
            with open("temp.txt", "r") as page_text:
                content = page_text.read()
                #content = self.clean_ps_content(content)
                pages[page] = content
            subprocess.call(["rm", "temp.txt"])
        shutil.rmtree(self.temp_dir)
        return pages

if __name__ == "__main__":
    #from pymongo import MongoClient
    #db = MongoClient()["nlp"]
    extractor = DocumentExtractor()
    input_dir = "./data/pdf/"
    for input_file in os.listdir(input_dir):
        if re.search("pdf$", input_file):
            extractor.extract_document(os.path.join(input_dir, input_file))
