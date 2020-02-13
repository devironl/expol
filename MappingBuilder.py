from ProgramVocabularyAnalyzer import Campaign
from pprint import pprint
import operator
import json
from collections import Counter
import re
    
def keep_lemma(campaign, lemma, threshold):
    for n, voc in campaign.vocabulary.items():
        if lemma in voc and voc[lemma] >= threshold:
            return True
    return False
       
def build_reference_mappings(year=2019, threshold=5, rebuild=True):
    
    with open("./data/mappings/mapping_lemma_id.json", "r") as json_file:
        mapping_lemma_id = json.load(json_file)
    with open("./data/mappings/mapping_id_lemma.json", "r") as json_file:
        mapping_id_lemma = json.load(json_file)
     
    campaign = Campaign(year, False, False)
    vocabulary = {}
    for n, n_voc in campaign.vocabulary.items():
        for word, count in n_voc.items():
            vocabulary[word] = count
    # Get concordances for display words
    display_words = {}
    # Every lemma shoud map to its display word
    mapping_lemma_display_word = {}
    # Every word should map its lemma
    mapping_word_lemma = {}
    # Every lemma shoud map its list of words
    mapping_lemma_words = {}
    # LOAD DATA
    lemma_id = max(mapping_lemma_id.values())
    for party, program in campaign.programs.items():
        for lemma, concordances in sorted(program.concordances.items(), key=operator.itemgetter(0), reverse=True):
            if lemma in campaign.word_specificity_scores and keep_lemma(campaign, lemma, threshold) == True:
                if lemma not in mapping_lemma_id and lemma:
                    lemma_id += 1
                    mapping_lemma_id[lemma] = lemma_id
                    mapping_id_lemma[lemma_id] = lemma
                if lemma not in mapping_lemma_words:
                    mapping_lemma_words[lemma] = []
                for concordance in concordances["concordances"]:
                    if concordance["original_word"] not in mapping_word_lemma:
                        mapping_word_lemma[concordance["original_word"]] = lemma
                    if concordance["original_word"] not in mapping_lemma_words[lemma]:
                        mapping_lemma_words[lemma].append(concordance["original_word"])
                    if lemma not in mapping_lemma_display_word:
                        mapping_lemma_display_word[lemma] = []
                    mapping_lemma_display_word[lemma].append(concordances["display_word"])

    # Test cleaner
    print("Cleaning: remove short words that are always in the same overlap")
    lemmas_to_remove = set()
    for lemma_test, lemma_test_id in mapping_lemma_id.items():
        lemma_test_regex = re.compile("\\b%s\\b" % lemma_test)
        for lemma in mapping_lemma_id.keys():
            if lemma != lemma_test and lemma in vocabulary and lemma_test in vocabulary:
                if lemma_test_regex.search(lemma) and vocabulary[lemma_test] <= vocabulary[lemma]:
                    lemmas_to_remove.add(lemma_test)
                    for word in mapping_lemma_words.get(lemma_test, []):
                        if word in mapping_word_lemma:
                            del(mapping_word_lemma[word])
    for lemma in lemmas_to_remove:
        lemma_id = mapping_lemma_id[lemma]
        if lemma_id in mapping_id_lemma:
            del(mapping_id_lemma[lemma_id])
            del(mapping_lemma_id[lemma])
            del(mapping_lemma_display_word[lemma])
            del(mapping_lemma_words[lemma])

    # Clean display word
    for lemma, display_words in mapping_lemma_display_word.items():
        display_word = Counter(display_words).most_common(1)[0][0]
        if display_word.isupper():
            for word in display_words:
                if not word.isupper():
                    display_word = word
        mapping_lemma_display_word[lemma] = display_word

    # Push mappings in file
    with open("./data/mappings/mapping_lemma_id.json", "w") as json_file:
        json.dump(mapping_lemma_id, json_file)
    with open("./data/mappings/mapping_id_lemma.json", "w") as json_file:
        json.dump(mapping_id_lemma, json_file)
    return mapping_lemma_display_word, mapping_word_lemma, mapping_lemma_id, mapping_id_lemma, mapping_lemma_words

if __name__ == "__main__":
    mapping_lemma_display_word, mapping_word_lemma, mapping_lemma_id, mapping_id_lemma, mapping_lemma_words = build_reference_mappings(2019)
