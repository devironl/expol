import re, sys, os
from pprint import pprint
import _pickle
import unicodecsv
import re, sys, os
from gensim.models.word2vec import Word2Vec
import gensim.downloader as gensim_downloader
from MappingBuilder import build_reference_mappings 

def load_model(rebuild=True):
    if rebuild == True:
        # LEMMA
        sentences = []
        model = None
        for pkl_path in os.listdir("./data/vectors"):
            with open(os.path.join("./data/vectors", pkl_path), "rb") as pkl_file:
                for lemma_vector in _pickle.load(pkl_file):
                    if len(lemma_vector) > 0:
                        sentences.append(lemma_vector)
        model = Word2Vec(sentences, window=5, iter=100, min_count=8, size=250, workers=20)
        model.train(sentences, total_examples=model.corpus_count, epochs=model.epochs)
        model.save("./local_data/models/program_word2vec.bin")
    else:
        model = Word2Vec.load("./local_data/models/program_word2vec.bin")
    return model 

if __name__ == "__main__":
     
    mapping_lemma_display_word, mapping_word_lemma, mapping_lemma_id, mapping_id_lemma, mapping_lemma_words = build_reference_mappings(2019)
    model = load_model(True)
    lemma = mapping_word_lemma["Donald Trump"]
    i = a = 0
    try:
        similars = model.wv.most_similar(lemma, topn=10000)
    except:
        similars = []
    results = 0
    for similar in similars:
        if results < 10:
            word = mapping_lemma_display_word.get(similar[0], None)
            if word != None:
                print(word, similar)
                results += 1

    print(i)
    print(a)






