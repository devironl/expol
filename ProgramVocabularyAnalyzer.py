import re, sys, os, operator, json, math, random
import unicodecsv
import numpy as np
import _pickle
from pprint import pprint
from unidecode import unidecode
from nltk import sent_tokenize
from collections import Counter
from MWUExtractor import MWUExtractor
from parsing_rules import parsing_rules 
from scipy.stats import hypergeom, binom

PARTY_NAME_REGEX = {
    "PTB": re.compile("\\bPTB\\b", re.IGNORECASE),
    "ECOLO": re.compile("\\b(ecolo|écolo)\\b", re.IGNORECASE),
    "PS": re.compile("\\b(Parti Socialiste|PS|parti socialiste|Parti Socialiste|PARTI SOCIALISTE)\\b"),
    "DEFI": re.compile("\\b(FDF|Front des francophones|Front Des Francophones|Front des Francophones|Défi|DéFi|DEFI|DÉFI|DéFI)\\b"),
    "CDH": re.compile("\\b(cdh|centre démocrate humaniste|centre democrate humaniste)\\b", re.IGNORECASE),
    "MR": re.compile("\\b(MR|Mouvement réformateur|Mouvement Réformateur|mouvement réformateur|MOUVEMENT REFORMATEUR|MOUVEMENT RÉFORMATEUR)\\b"),
    "PP": re.compile("\\b(PP|Parti Populaire|Parti populaire|Parti|Populaire|parti populaire|PARTI POPULAIRE|PARTI|POPULAIRE)\\b")
}

URL = re.compile("(https?:\/\/[^\s]+|(\/\/)?www\.[^\s]+|[^\s]{25,})")
MAIL = re.compile("[^\s]+@[^\s]+")
DOC = re.compile("([^\s]+\.(pdf|docx|doc|xls|xlsx|mp3|avi|jpg|png|jpeg))|file:\/\/[^\s]+")
ALLOWED_WORD = re.compile("^([a-z\s\-\.']{3,}|mr|ps|pp)$", re.IGNORECASE)

with open("./data/nlp/acronym_dictionary.json", "r") as json_file:
    acronym_dictionary = json.load(json_file)

mwu_extractor = MWUExtractor()

class Campaign:

    def __init__(self, year, rebuild_voc=False, rebuild_spec=False):
        if rebuild_voc == True:
            rebuild_spec = True
        self.year = year
        self.programs = {}
        for party_name in os.listdir(os.path.join("./data/text", str(year))):
            if party_name in ["ECOLO", "PS", "MR", "DEFI", "CDH", "PP", "PTB"]:
                self.programs[party_name] = Program(party_name, year, rebuild_voc)
        self.corpus = self.get_corpus()
        self.vocabulary = {}
        for n, n_corpus in self.corpus.items():
            self.vocabulary[n] = Counter(n_corpus)
        self.word_specificity_scores, self.party_specificity_scores = self.compute_specificity_scores(rebuild_spec)
    
    def get_corpus(self):
        corpus = {}
        for n in [1, 2, 3, 4]:
            n_corpus = []
            for party, program in self.programs.items():
                for word, count in program.vocabulary[n].items():
                    for i in range(count):
                        n_corpus.append(word)
            random.shuffle(n_corpus)
            corpus[n] = n_corpus
        return corpus

    def compute_specificity_scores(self, rebuild=True):
        if rebuild == True:
            word_specificity_scores = {}
            party_specificity_scores = {}
            for party, program in self.programs.items():
                party_specificity_scores[party] = {}
                word_scores = program.get_word_scores(self.corpus, self.vocabulary)
                for n, words in program.vocabulary.items():
                    for word in words.keys():
                        specificity_score = word_scores[n].get(word, None)
                        if specificity_score is not None:
                            specificity_score = specificity_score / max(word_scores[n].values())
                            # FILL WORD SPECIFICITY SCORES
                            # 1. INIT
                            if word not in word_specificity_scores:
                                word_specificity_scores[word] = {}
                                for party_name in self.programs.keys():
                                    word_specificity_scores[word][party_name] = 0
                            # 2. FILL
                            word_specificity_scores[word][party] = specificity_score
                            # FILL PARTY SPECIFICITY SCORES
                            party_specificity_scores[party][word] = specificity_score
            
            with open("./data/specificities/%s_specificities.pkl" % (self.year), "wb") as pkl_file:
                _pickle.dump({"word_specificity_scores": word_specificity_scores, "party_specificity_scores": party_specificity_scores}, pkl_file)
        else:
            with open("./data/specificities/%s_specificities.pkl" % (self.year), "rb") as pkl_file:
                specificities = _pickle.load(pkl_file)
                word_specificity_scores = specificities["word_specificity_scores"]
                party_specificity_scores = specificities["party_specificity_scores"]
        return word_specificity_scores, party_specificity_scores

class Program:

    def __init__(self, name, year, rebuild=False):
        self.name = name
        self.year = year
        self.PARTY_NAME_REGEX = PARTY_NAME_REGEX[name]
        self.vocabulary, self.concordances = self.load_program_voc(rebuild)
        self.types = len(self.vocabulary[1].keys())
        self.tokens = sum(self.vocabulary[1].values())
        self.ttr = self.types / self.tokens

    def get_program_type(self, file_name):
        if "FED" in file_name:
            return "fédéral"
        if "BXL" in file_name:
            return "régional bruxellois"
        if "EUR" in file_name:
            return "européen"
        if "RW" in file_name or "WAL" in file_name:
            return "régional wallon"
        if "REG" in file_name:
            return "régional"
        if "CF" in file_name:
            return "Communauté Française"
        if "ALL" in file_name:
            return "général"
        if "FWB" in file_name:
            return "Fédération Wallonie-Bruxelles"

    def clean_content(self, content, rules):
        content = content.replace("’", "'")
        content = content.replace("ʼ", "'")
        content = content.replace("‟", "'")
        content = content.replace("«", '"')
        content = content.replace("»", '"')
        content = content.replace("“", '"')
        content = content.replace("”", '"')
        content = content.replace("…", "...")
        content = content.replace("œ", "oe")
        content = content.replace("Œ", "Oe")
        content = content.replace('·', ".")
        content = content.replace('\xad', "-")
        content = re.sub("(−|-|-|‐|–|—|―|⁃|−)", "-", content)
        content = URL.sub(" ", content) 
        content = MAIL.sub(" ", content)
        content = DOC.sub(" ", content)
        for rule in rules:
            if rule is not None:
#                for match in rule.finditer(content):
#                    print(match.group(0))
                content = rule.sub(" ", content)
        return content


    def load_program_voc(self, rebuild):
        if rebuild == True:
            print(self.name)
            concordances = {}
            lemma_vectors = []
            voc = {1:[], 2:[], 3:[], 4:[]}
            for json_file in [json for json in os.listdir(os.path.join("./data/text/%s" % self.year, self.name)) if "json" in json]:
                print("Processing...: %s" % json_file)
                input_file = open(os.path.join("./data/text/%s/%s/%s" % (self.year, self.name, json_file)), "r")
                rules = parsing_rules[json_file.replace(".json", "")]
                for page, content in json.load(input_file).items():
                    if int(page) >= rules["first_page"] and int(page) <= rules["last_page"] and int(page) not in rules.get("excluded_pages", []):
                        content = self.clean_content(content, [rules["header"], rules["footer"], rules["remove"]])
                        for sentence in sent_tokenize(content):
                            lemma_vector = {}
                            for n, word_entries in mwu_extractor.get_n_grams(sentence).items():
                                for word_entry in word_entries:
                                    actual_n = n
                                    word = word_entry["word"]
                                    # Replace acronyms by their complete form
                                    if word in acronym_dictionary:
                                        complete_form = acronym_dictionary[word]
                                        lemma = complete_form[0]
                                        actual_n = complete_form[1]
                                    else:
                                        lemma = unidecode(word_entry["lemma"].lower()).replace("-", "")
                                    word_entry["location"] = {
                                        "pdf_file": json_file.replace("json", "pdf"),
                                        "page": page,
                                        "program_type": self.get_program_type(json_file)
                                    }
                                    if ALLOWED_WORD.search(unidecode(word)) and not self.PARTY_NAME_REGEX.search(word):
                                        # Add to vocabulary
                                        voc[actual_n].append(lemma)
                                        # Add to concordances
                                        if lemma not in concordances:
                                            concordances[lemma] = []
                                        concordances[lemma].append(word_entry)
                                        # Add to semantic vector
                                        if word_entry["overlap"] == False:
                                            lemma_vector[word_entry["start_pos"]] = lemma
                            # Sort semantic vector by apparition order
                            lemma_vector = [lemma[1] for lemma in sorted(lemma_vector.items(), key=operator.itemgetter(0))]
                            lemma_vectors.append(lemma_vector)
            vocabulary = {}
            for n, words in voc.items():
                vocabulary[n] = Counter(words)

            # Look for the word to display
            for lemma, values in concordances.items():
                words = []
                concord = []
                pos = []
                lemmas = []
                for value in values:
                    lemmas.append(value["lemma"])
                    words.append(value["word"])
                    concord.append({
                        "concordance": "...%s..." % value["concordance"],
                        "original_word": value["word"],
                        "pos": value["pos"],
                        "location": value["location"]
                    })
                    pos.append(value["pos"])
                pos = Counter(pos).most_common(1)[0][0]
                # For NOUNS: the display word is the most frequent word
                if pos == "NOUN" or pos == "PROPN" or " " in lemma:
                    display_word = Counter(words).most_common(1)[0][0]
                # For Adj, adv, etc: the display word is the most frequent lemma
                else:
                    display_word = Counter(lemmas).most_common(1)[0][0]
                concordances[lemma] = {
                    "display_word": display_word,
                    "concordances": concord
                }

            with open("./data/vocabulary/%s_%s_voc.pkl" % (self.year, self.name), "wb") as pkl_file:
                _pickle.dump(vocabulary, pkl_file)
            with open("./data/concordances/%s_%s_concordances.pkl" % (self.year, self.name), "wb") as pkl_file:
                _pickle.dump(concordances, pkl_file)
            with open("./data/vectors/%s_%s_vectors.pkl" % (self.year, self.name), "wb") as pkl_file:
                _pickle.dump(lemma_vectors, pkl_file)
        else:
            with open("./data/vocabulary/%s_%s_voc.pkl" % (self.year, self.name), "rb") as pkl_file:
                vocabulary = _pickle.load(pkl_file)
            with open("./data/concordances/%s_%s_concordances.pkl" % (self.year, self.name), "rb") as pkl_file:
                concordances = _pickle.load(pkl_file)
        return vocabulary, concordances

    def get_word_scores(self, full_corpus, full_vocabulary, min_global_count=2):
        scores = {}
        stats = {}
        for n, n_vocabulary in self.vocabulary.items():
            scores[n] = {}

            size_full_corpus = sum(full_vocabulary[n].values())
            size_party_corpus = sum(self.vocabulary[n].values())
            for word, count_party_corpus in n_vocabulary.items():
                count_full_corpus = full_vocabulary[n][word]
                # Check if the word occurs at least N times on the whole corpus
                if count_full_corpus >= min_global_count:
                    # Compute probability of having strictly less than k=<count> occurences
                    # from N=<size> draws without replacement from a bin with M=<size_full_corpus>
                    # elements among which n=<count_full_corpus> are the ones we're interested in
                    # https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.hypergeom.html
                    # random_variable = hypergeom(M, n, N)
                    random_variable = hypergeom(size_full_corpus, count_full_corpus, size_party_corpus)
                    probability = random_variable.cdf(count_party_corpus - 1)
                    # Using the method but the mean is simply nK/N, size of the programme times freq of
                    # the work in the full corpus
                    mean = random_variable.mean()
                    weighted_score = probability * math.log(round(count_party_corpus / mean, 6) + 1, 10)
                    #if word=="test":
                    #    print("party:", self.name)
                    #    print("word:", word)
                    #    print("count_party:", count_party_corpus)
                    #    print("count_total:", count_full_corpus)
                    #    print("mean (expected):", mean)
                    #    print("proba:", probability)
                    #    print("weight:", math.log((round(count_party_corpus/mean, 6)) + 1, 10))
                    #    print("weighted:", weighted_score)
                    #    print("==============================")
                    scores[n][word] = weighted_score

        return scores

    def get_concordances(self, word):
        return self.concordances[word]


if __name__ == "__main__":
    for year in [2019, 2014, 2010, 2009, 2007]:
        print(year)
        campaign = Campaign(year, True, True)
