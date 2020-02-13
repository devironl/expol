from unidecode import unidecode
import spacy
from nltk import ngrams, word_tokenize
from nltk.tokenize import WordPunctTokenizer
import re
import _pickle

BAD_START = re.compile("[,;:\/\)\(\[\]0-9\-°]+$")
BAD_END = re.compile("^[,;:\/\)\(\[\]\-]+")
INCLUSIVE_WRITING_PARENTHESIS = re.compile("(\([es]+\)?|\(.*\)s$)", re.IGNORECASE)

class Accentuator:

    def __init__(self):
        with open("./data/nlp/accentuator.pkl", "rb") as pkl_file:
            self.accentuator = _pickle.load(pkl_file)

    def get_shape(self, text):
        shape = []
        for char in text:
            shape.append(char.isupper())
        return shape

    def set_shape(self, text, shape):
        result = []
        for i, char in enumerate(text):
            if shape[i] == True:
                result.append(char.upper())
            else:
                result.append(char.lower())
        return "".join(result)

    def accentuate_text(self, text):
        result = ""
        tokens = list(WordPunctTokenizer().span_tokenize(text)) 
        for i, indices in enumerate(tokens):
            word = text[indices[0]: indices[1]]
            shape = self.get_shape(word)
            if False not in shape and word.lower() in self.accentuator:
                accentuated_word = list(self.accentuator[word.lower()])[0]
                token = self.set_shape(accentuated_word, shape)
            else:
                token = word
            if i > 0:
                for i in range(tokens[i-1][1], indices[0]):
                    result += " "
            result += token
        return result

class MWUExtractor:

    def __init__(self):

        self.nlp = spacy.load("fr")
        self.ONLY_ALPHA = re.compile("^[a-z'-éèêëàâäïîôöûü\s]+$", re.IGNORECASE)
        self.accentuator = Accentuator()
        self.allowed_sequences = [["NOUN"], ["VERB"], ["ADJ"], ["NOUN", "NOUN"], ["ADJ", "NOUN"], ["NOUN", "ADJ"], ["NOUN", "ADJ", "ADJ"], ["NOUN", "NOUN", "NOUN"], ["NOUN", "CONJ", "NOUN"], ["NOUN", "NOUN", "ADJ"], ["NOUN", "DET", "NOUN"], ["NOUN", "ADP", "NOUN"], ["NOUN", "ADP", "DET", "NOUN"], ["NOUN", "ADP", "ADJ", "NOUN"], ["NOUN", "DET", "ADJ", "NOUN"], ["NOUN", "DET", "NOUN", "ADJ"], ["NOUN", "ADP", "NOUN", "ADJ"], ["NOUN", "ADJ", "ADP", "DET", "NOUN"], ["NOUN", "ADJ", "DET", "NOUN"], ["NOUN", "ADJ", "ADP", "NOUN"], ["NOUN", "NOUN", "DET", "NOUN"], ["NOUN", "NOUN", "ADP", "NOUN"], ["NOUN", "PUNCT", "NOUN"]]
        self.allowed_prepdet = ["à", "a", "de", "du", "des", "pour", "sans", "d'", "en", "pour", "sur", "au", "avec", "di", "le", "la", "l'", "les", "l", "du", "d'", "des", "de"]
        with open("./data/nlp/lemmatizer.pkl", "rb") as pkl_file:
            self.lemmatizer = _pickle.load(pkl_file)
        self.lazy_lemmatizer = {}
        for entry, lemmas in self.lemmatizer.items():
            self.lazy_lemmatizer[entry.split("_")[0]] = lemmas
        self.blacklist = set(["chapitre", "n°", "n °", "un", "walloniebruxelles", "euses", "sine", "burn", "antonio", "carlo", "michel", "fremault", "hedebouw", "marco van", "marco", "hees", "van hees", "wever", "bart", "rupo", "elio", "elio di", "charles", "céline", "cellesci", "celleeci", "celui", "ceci", "cela", "celà", "être", "aller", "faire", "dire", "proposer", "proposition", "trouver", "chez", "anti", "dans", "pour", "c'est-à-dire", "quoi", "que", "qui", "donc", "dont", "midi", "vingt", "demi", "dix", "dix-huit", "dixième", "deuxième", "troisième", "quatrième", "cinquième", "sixième", "quasi", "septième", "douze", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "claude marcourt", "fondation roi", "land trust", "community land", "raoul", "baudouin", "roi baudouin", "bue", "buer", "valérie", "marie", "housing", "flexi", "cie", "shelter", "shift", "bis", "time", "voilà", "community", "jusque", "ans", "âge", "an", "savoir", "grâce", "voir", "vue", "block", "papers", "beau", "grand", "petit", "vice"])
        self.BLACKLIST_REGEX = [
            re.compile("en (situation|perte)$"),
            re.compile("mêmes?\\b", flags=re.IGNORECASE),
            re.compile("proposition viser", flags=re.IGNORECASE),
            re.compile("(travers)\\b", flags=re.IGNORECASE),
            re.compile("^(grâce|vue)\\b", flags=re.IGNORECASE)
        ]
        self.EN_PFX = re.compile("\\b(%s)\\b" % "|".join(["compte", "terme", "cause", "cas", "considération", "charge", "matière", "effet", "comptes", "termes", "fonction", "matiere", "matières", "cours"]), flags=re.IGNORECASE)

    def is_blacklisted(self, lemma, sentence):
        if lemma.lower() in self.blacklist:
            return True
        for regex in self.BLACKLIST_REGEX:
            if regex.search(lemma):
                return True
        # Test: en cas de
        en_pfx = self.EN_PFX.search(lemma.lower())
        if en_pfx is not None and re.search("\\b(en|au) %s\\b" % en_pfx.group(1), sentence.lower()):
            return True
        return False

    def match_pattern(self, pattern, ngram):
        for i in range(len(pattern)):
            pos = ngram[i].pos_
            if pos in ["PROPN", "X"]:
                pos = "NOUN"
            if pattern[i] == pos:
                if pattern[i] in ["ADP", "DET"] and str(ngram[i]).lower() not in self.allowed_prepdet:
                    return False
                if pattern[i] == "PUNCT" and str(ngram[i]) != "-":
                    return False
            else:
                return False
        return True

    def is_allowed_sequence(self, ngram):
        # First check if only numbers
        for word in ngram:
            if not self.ONLY_ALPHA.search(str(word)):
                return False
        # Hardcoding deg
        if "".join([str(token) for token in ngram]).upper() == "N-VA":
            return True
        for token in [ngram[0], ngram[-1]]:
            if str(token).lower() in ["au", "aux"] or len(str(token)) == 1:
                return False
        if str(ngram[-1]).lower() in self.allowed_prepdet:
            return False
        # Then check if a MWU pattern is found
        for pattern in self.allowed_sequences:
            if len(pattern) == len(ngram):
                if self.match_pattern(pattern, ngram) == True:
                    return True
        return False


    def get_lemma(self, orig_word, pos):
        if pos == "PROPN":
            pos = "NOUN"

        word = str(orig_word)
        # Manage inclusive writing
        if "." in word:
            word = word.split(".")[0]
        word = INCLUSIVE_WRITING_PARENTHESIS.sub("", word)

        # Remove bad start - bad end
        word = BAD_START.sub("", word)
        word = BAD_END.sub("", word)
        if len(word) == 0:
            return orig_word

        # Hardcoding common words
        if word == "convient":
            return "convenir"
        if word == "faut":
            return "falloir"
        if word == "entraine":
            return "entrainer"
        if word in ["universel", "universelle"]:
            return "universel"
        if word == "saurait":
            return "savoir"
        if word.lower() in ["gouvernements", "gouvernement"]:
            return "gouvernement"
        if word == "sommes" and pos == "VERB":
            return "être"
        if word in ["être", "êtres"]:
            return "être"
        if word in ["partie", "parties"] and pos == "NOUN":
            return "partie"
        if word == "arrivée" and pos == "NOUN":
            return "arrivée"
        if word in ["victime", "victimes"]:
            return "victime"
        if word in ["pensionné", "pensionnés"]:
            return "pensionné"
        if word.lower() in ["national", "nationale"]:
            return "national"
        if word.lower() == "elgique":
            return "Belgique"
        if word.lower() == "cuba":
            return "Cuba"
        if word.lower() in ["aille", "aillent"]:
            return "aller"
        if word.lower() in ["évènement", "évènements"]:
            return "événement"
        if word.lower() in ["chapitre", "chapitres"]:
            return "chapitre"
        if word.lower() in ["eau", "eaux"]:
            return "eau"
        if word.lower() in ["imprimant", "imprimante"]:
            return "imprimante"
        # Lemmatize
        for w in set([word, word.lower()]):
            lemmas = self.lemmatizer.get("%s_%s" % (w, pos), [])
            if len(lemmas) > 0:
                return max(set(lemmas), key=lemmas.count)
        for w in set([word, word.lower()]):
            lemmas = self.lazy_lemmatizer.get(w, [])
            if len(lemmas) > 0:
                return max(set(lemmas), key=lemmas.count)
        return orig_word

    def is_overlap(self, start, end, positions, n):
        for position in positions:
            if n < position[2]:
                if start >= position[0] and end <= position[1]:
                    return True
                if start <= position[0] and end >= position[1]:
                    return True
        return False

    def get_ngram_lemma(self, ngram):
        lemma = []
        for entry in ngram:
            if entry.pos_ not in ["PUNCT", "ADP", "DET"] and str(entry).lower() != "di":
                lemma.append(self.get_lemma(str(entry), entry.pos_))
        return " ".join(lemma), len(lemma)


    def get_n_grams(self, text):
        text = re.sub("\s+", " ", text).strip()
        # First try to reaccentuate the basis text
        nlp_text = text
        if re.search("[A-Z]{5,}", text):
            nlp_text = self.accentuator.accentuate_text(nlp_text)
        if not re.search("[a-z]", nlp_text):
            nlp_text = nlp_text.lower()
        # HACK DEGUEULASSE
        nlp_text = re.sub("L'", "l'", nlp_text)
        nlp_text = re.sub("tiers payant", "tiers-payant", nlp_text, flags=re.IGNORECASE)
        nlp_text = re.sub("produit intérieur brut", "Produit Intérieur Brut", nlp_text, flags=re.IGNORECASE)
        nlp_text = re.sub("burn out", "Burn Out", nlp_text, flags=re.IGNORECASE)
        nlp_text = re.sub("wallonie-bruxelles", "Wallonie Bruxelles", nlp_text, flags=re.IGNORECASE)
        nlp_text = re.sub("tax[-\s]shift", "Tax Shift", nlp_text, flags=re.IGNORECASE)
        nlp_text = re.sub("tax[-\s]shelter", "Tax Shelter", nlp_text, flags=re.IGNORECASE)

        doc = self.nlp(nlp_text)
        n_grams = {1:[], 2:[], 3:[], 4:[]}
        positions = []
        for n in reversed(range(1,5)):
            for ngram in ngrams(doc, n):
                if self.is_allowed_sequence(ngram):
                    # Get concordance indices
                    if ngram[0].i >= 21:
                        minimum = ngram[0].i - 20
                    else:
                        minimum = 0
                    if ngram[-1].i + 20 < len(doc):
                        maximum = ngram[-1].i + 20
                    else:
                        maximum = len(doc) - 1
                    # Get n-gram indices
                    start = doc[minimum].idx
                    end = doc[maximum].idx + len(doc[maximum])
                    # Get word in text
                    word = text[ngram[0].idx:ngram[-1].idx + len(ngram[-1])].replace("\n", " ")
                    # Lemmatize n-gram
                    lemma, actual_n = self.get_ngram_lemma(ngram)
                    # Exclude bad-formed lemmas
                    if not re.search("[\.,;:\)\(\[\]\/°]", lemma) and self.is_blacklisted(lemma, text) == False:
                        # Get overlapped sequence (for helping Word2Vec)
                        if self.is_overlap(ngram[0].idx, ngram[-1].idx+len(ngram[-1]), positions, n) == False:
                            overlap = False
                            positions.append((ngram[0].idx, ngram[-1].idx+len(ngram[-1]), n))
                        else:
                            overlap = True
                        n_grams[actual_n].append({
                            "word": word,
                            "concordance" : re.sub("\s+", " ", text[start:end].replace("\n", " ")),
                            "lemma": lemma,
                            "pos": ngram[0].pos_,
                            "overlap": overlap,
                            "start_pos": ngram[0].idx
                        })
        return n_grams



if __name__ == "__main__":
    from pprint import pprint
    extractor = MWUExtractor()
    pprint(extractor.get_n_grams("La loi De Croo"))
    
