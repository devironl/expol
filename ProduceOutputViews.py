from ProgramVocabularyAnalyzer import Campaign
from SearchEngine import load_model
import unicodecsv, json, operator
from MappingBuilder import build_reference_mappings
from math import floor
import re
import itertools
from unidecode import unidecode

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

def write_lemma_search_table():
    lemmaWriter = unicodecsv.DictWriter(
        open(OUTPUT_FOLDER + "lemma.csv", "wb"),
        ["id", "lemma", "display_word", "variants"]
    )
    lemmaWriter.writeheader()
    for id, lemma in mapping_id_lemma.items():
        if lemma in mapping_lemma_display_word:
            words = mapping_lemma_words[lemma]
            unidecode_words = [unidecode(word) for word in words]
            
            lemmaWriter.writerow({
                "id": id,
                "lemma": lemma,
                "display_word": mapping_lemma_display_word[lemma],
                "variants": " ".join(set(unidecode_words + words))
            })

def write_lemma_similarity_table():
    lemmaSimilarityWriter = unicodecsv.DictWriter(
        open(OUTPUT_FOLDER + "lemma_similarity.csv", "wb"),
        ["id", "similar_list"]
    )
    lemmaSimilarityWriter.writeheader()

    for lemma, id in mapping_lemma_id.items():
        if lemma in mapping_lemma_display_word:
            linkedLemmaList = []

            # The model contains lemma from all campaigns
            try:
                similars = model.wv.most_similar(positive=[lemma], topn=10000)
            except KeyError:
                similars = []

            for similar_lemma, similarity_score in similars:
                if (similar_lemma in mapping_lemma_id and lemma not in similar_lemma and similar_lemma not in lemma) and similar_lemma in mapping_lemma_id and similar_lemma in mapping_lemma_display_word:
                    linkedLemmaList.append({
                        "id": mapping_lemma_id[similar_lemma],
                        "display_word": mapping_lemma_display_word[similar_lemma],
                    })
                if (len(linkedLemmaList) >= 10):
                    break

            if len(linkedLemmaList):
                lemmaSimilarityWriter.writerow({
                    "id": id,
                    "similar_list": json.dumps(linkedLemmaList)
                })

def write_lemma_usage_and_concordance_table():
    CONCORDANCE_PAGE_SIZE = 5
    lemmaUsageWriter = unicodecsv.DictWriter(
        open(OUTPUT_FOLDER + "lemma_usage.csv", "wb"),
        ["id", "year", "usage_list"]
    )
    lemmaConcordancePageWriter = unicodecsv.DictWriter(
        open(OUTPUT_FOLDER + "lemma_concordance_page.csv", "wb"),
        ["id", "year", "party", "page", "concordance_list"]
    )
    lemmaUsageWriter.writeheader()
    lemmaConcordancePageWriter.writeheader()

    for year, campaign in campaigns:
        for n, n_vocabulary in campaign.vocabulary.items():
            for lemma, campaign_count in n_vocabulary.items():
                if lemma in mapping_lemma_id and lemma in mapping_lemma_display_word:
                    lemma_usage_object = {
                        "id": mapping_lemma_id[lemma],
                        "year": year
                    }

                    usage_list = []
                    for party, program in campaign.programs.items():
                        party_scores = campaign.party_specificity_scores[party]
                        if (lemma in party_scores):
                            concordance_object = program.get_concordances(lemma)
                            concordance_list = concordance_object["concordances"]
                            concordance_list.sort(key=lambda c: int(c["location"]["page"]))  #file_path"].split("=").pop()))
                            concordance_page_list = []

                            for concordance_page in chunks(concordance_list, CONCORDANCE_PAGE_SIZE):
                                concordance_page_list.append(concordance_page)
                            
                            n_concordances = len(concordance_list)
                            n_pages = len(concordance_page_list)
                            for page, index in zip(concordance_page_list, range(n_pages)):
                                lemmaConcordancePageWriter.writerow({
                                    "id": mapping_lemma_id[lemma],
                                    "year": year,
                                    "party": party,
                                    "page": index,
                                    "concordance_list": json.dumps(page)
                                })

                            usage_list.append(
                                    {
                                        "party": party,
                                        "specificity_score": party_scores[lemma],
                                        "frequency" : float(program.vocabulary[n].get(lemma, 0) / sum(program.vocabulary[1].values())),
                                        "n_concordance": n_concordances,
                                        "n_page":  n_pages,
                                        "concordance_page_list": [{
                                            "id": mapping_lemma_id[lemma],
                                            "year": year,
                                            "party": party,
                                            "page": 0,
                                            "concordance_list": concordance_page_list[0]
                                        }]
                                    }
                                )

                    lemma_usage_object["usage_list"] = json.dumps(usage_list)
                    lemmaUsageWriter.writerow(lemma_usage_object)

def write_graph_json_files():
    reader = unicodecsv.DictReader(open("./data/terms_for_tabs/party_specificities_2019.csv", "rb"))
    manually_selected_lemmas = {}
    for row in reader:
        if row["party"] not in manually_selected_lemmas:
            manually_selected_lemmas[row["party"]] = []
        manually_selected_lemmas[row["party"]].append(row["lemma"])
    graph_list = []
    lemma_dict = {}
    lemma_scores = {}
    party_lemma_uid = 0
    N_LEMMA_TO_KEEP = 210
    year, campaign = campaigns[0]
    n_programs = len(campaign.programs)
    n_lemma_per_party = floor(N_LEMMA_TO_KEEP/n_programs)
    selected_lemmas = set()
    for party, program in campaign.programs.items():
        # I can't use the campaign scores here because I need to
        # track the size (n) of the lemmas to get their counts below
        all_lemma_scores = program.get_word_scores(campaign.corpus, campaign.vocabulary, min_global_count=8)
        
        top_lemma_scores_each_size = []
        for n in sorted(all_lemma_scores.keys(), reverse=True):
            for lemma_score in sorted(all_lemma_scores[n].items(), key=operator.itemgetter(1), reverse=True):
                if lemma_score[0] in manually_selected_lemmas[party]:
                    to_keep = True
                    top_lemma_scores_each_size.append((lemma_score[0], lemma_score[1], n))

        top_lemma_scores = sorted(top_lemma_scores_each_size, key=operator.itemgetter(1), reverse=True)[:n_lemma_per_party]

        party_specificity_rank = 0
        for lemma, score, n in top_lemma_scores:
            if lemma in manually_selected_lemmas[party]:
                graph_list.append({
                    "id": party_lemma_uid,
                    "lemma_id": mapping_lemma_id[lemma],
                    "party": party,
                    "display_word": mapping_lemma_display_word[lemma],
                    "party_specificity_rank": party_specificity_rank
                })
                party_lemma_uid += 1
                party_specificity_rank += 1

    with open(APP_DATA_FOLDER + "graph_list.json", "w") as file:
        json.dump(graph_list, file)

def write_new_terms():
    entries = []
    reader = unicodecsv.DictReader(open("./data/terms_for_tabs/new_terms_2019.csv", "rb"))
    for row in reader:
        entries.append({
            "id": mapping_lemma_id[row["lemma"]],
            "display_word": mapping_lemma_display_word[row["lemma"]],
            "count": row["count"],
            "lemma_id": mapping_lemma_id[row["lemma"]]
        })
    with open(APP_DATA_FOLDER + "new_terms_2019.json", "w") as file:
        json.dump(entries, file)

def write_lemma_time_usage():
    writer = unicodecsv.DictWriter(
        open(OUTPUT_FOLDER + "word_time_usage.csv", "wb"),
        ["id", "historical_trend"]
    )
    writer.writeheader()
    for lemma, lemma_id in mapping_lemma_id.items():
        if lemma in mapping_lemma_display_word:
            usages = []
            for year, campaign in campaigns:
                usage = {
                    "year": year,
                    "values": {
                        "total": 0
                    }
                }
                for party in all_parties:
                    usage["values"][party] = 0

                for n, values in campaign.vocabulary.items():
                    if lemma in values:
                        usage["values"]["total"] = float(campaign.vocabulary[n].get(lemma, 0) / sum(campaign.vocabulary[1].values()))
                        for party in all_parties:
                            if party in campaign.programs:
                                program = campaign.programs[party]
                                if lemma in program.vocabulary[n]:
                                    usage["values"][party] = float(program.vocabulary[n].get(lemma, 0) / sum(program.vocabulary[1].values()))

                usages.append(usage)

            writer.writerow({
                "id": lemma_id,
                "historical_trend": json.dumps(usages)
            })


if __name__ == "__main__":
    # Load all data
    YEARS = [2019, 2014, 2010, 2009, 2007]
    # Code is relying on the first index being the latest year
    YEARS = sorted(YEARS, reverse=True)
    OUTPUT_FOLDER = "./local_data/output_views/"
    APP_DATA_FOLDER = "./app/public/data/"
    print("write load mappings")
    mapping_lemma_display_word, mapping_word_lemma, mapping_lemma_id, mapping_id_lemma, mapping_lemma_words = build_reference_mappings(YEARS[0])
    print("build similarity model")
    model = load_model(True)
    campaigns = [ (year, Campaign(year, False, False)) for year in YEARS]
    all_parties = [ party for party in campaigns[0][1].programs.keys()]

    # Write files
    print("write lemma search table")
    write_lemma_search_table()

    print("write lemma similarity table")
    write_lemma_similarity_table()

    print("write concordance table")
    write_lemma_usage_and_concordance_table()
    
    print("write graph json files")
    write_graph_json_files()
    
    print("write lemma time usage")
    write_lemma_time_usage()

    print("write new terms")
    write_new_terms()
