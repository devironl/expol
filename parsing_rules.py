import re

parsing_rules = {
#==============================================================================
# 2007
#==============================================================================
    "2007_CDH_FED": {
        "first_page": 4,
        "last_page": 244,
        "header": None,
        "footer": re.compile("\nProgramme cdh[^\n]+\n", re.IGNORECASE),
        "remove": re.compile("(Le cdH propose d.|[0-9]+.{,5}PARTIE|\\b[IV]{,5}\.)", re.IGNORECASE)
    },
    "2007_ECOLO_FED": {
        "first_page": 7,
        "last_page": 509,
        "excluded_pages": [10, 24, 44, 59, 71, 72,73,74,75,76, 80,96,109,120,131,140,150,162,163,164,165,166,168,178,189,199,209,224,225,226,227,232,241,250,261,271,272,273,274,275,278,289,300,311,322,336,337,338,339,340,344,357,369,384,403,404,405,406,408,],
        "header":None,
        "footer": re.compile("(\nProgramme Ecolo[^\n]+\n|Vers une économie de projets|Le programme économique d'ECOLO\n|Page [0-9]{,3})", re.IGNORECASE),
        "remove": re.compile("(\\blivre [IV]{,4}|Chapitre [0-9\.]+|(Priorit[ée]|Proposition) n.[0-9]+|Autres priorit[ée]s)", re.IGNORECASE)
    },
    "2007_MR_FED": {
        "first_page": 8,
        "last_page": 369,
        "header": re.compile("(Mouvement Réformateur[^\n]+2007\n|Thème :[^\n]\n)", re.IGNORECASE),
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("\\b(le constat|le bilan|Nous proposons) :", re.IGNORECASE),
    },
    "2007_PTB_FED": {
        "first_page": 4,
        "last_page": 64,
        "header": None,
        "footer": re.compile("(Programme électoral PTB\+|10 juin 2007)", re.IGNORECASE),
        "remove": re.compile("Propositions d.action PTB+", re.IGNORECASE)
    },
    "2007_PS_FED": {
        "first_page": 5,
        "last_page": 306,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("le ps veut", re.IGNORECASE)
    },
#==============================================================================
# 2009
#==============================================================================
    "2009_PS_RW": {
        "first_page": 8,
        "last_page": 137,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None  
    },
    "2009_PS_EUR": {
        "first_page": 3,
        "last_page": 55,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2009_PS_CF": {
        "first_page": 10,
        "last_page": 130,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2009_PS_BXL": {
        "first_page": 4,
        "last_page": 124,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2009_ECOLO_REG": {
        "first_page": 5, 
        "last_page": 582,
        "header": None,
        "footer": re.compile("Programme Ecolo 2009[^\n]+\n", re.IGNORECASE),
        "remove": re.compile("(livre [IV]{,3}|chapitre [0-9]{,2}|Priorite[^\n]+:|Proposition :|Propositions d'Ecolo)", re.IGNORECASE)
    },
    "2009_MR_WAL": {
        "first_page": 7,
        "last_page": 134,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(\n(BILAN|CONSTAT|PROPOSITIONS|CONTEXTE)\n|Propositions du MR|le MR veut|)", re.IGNORECASE)
    },
    "2009_MR_EUR": {
        "first_page": 4,
        "last_page": 34,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("Le MR propose"),
    },
    "2009_MR_CF": {
        "first_page": 7,
        "last_page": 75,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(\n(BILAN|CONSTAT|PROPOSITIONS|CONTEXTE|Recommandations)\n|le MR propose|)", re.IGNORECASE),
    },
    "2009_MR_BXL": {
        "first_page": 5,
        "last_page": 104,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("((BILAN|CONSTAT|PROPOSITIONS|CONTEXTE|Recommandations)( :)?\n|le MR propose|le MR veut)", re.IGNORECASE),
    },
    "2009_CDH_RW": {
        "first_page": 1,
        "last_page": 351,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(le cdh propose de|Axe.{,5}:)", re.IGNORECASE)
    },
    "2009_CDH_EUR": {
        "first_page": 2,
        "last_page": 41,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(le cdh propose de)", re.IGNORECASE)
    },
    "2009_CDH_BXL": {
        "first_page": 3,
        "last_page": 315,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(le cdh propose de|Axe.{,5}:)", re.IGNORECASE)
    },



#==============================================================================
# 2010
#==============================================================================
    "2010_MR_FED": {
        "first_page":7,
        "last_page":312,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("((constat|bilan|propositions) :)", re.IGNORECASE)
    },
    "2010_DEFI_FED": {
        "first_page":7,
        "last_page":337,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("((constat|bilan|propositions) :)", re.IGNORECASE)
    },

    "2010_ECOLO_FED": {
        "first_page":15,
        "last_page":226,
        "header": re.compile("Axe [^\n]+\n"),
        "footer": re.compile("Plateforme programmatique[^\n]+page [0-9]+", re.IGNORECASE),
        "remove": re.compile("(Plateforme électorale Ecolo\nElections fédérales du 13 juin 2010|Etat des lieux et analyse d'Ecolo|Propositions d'Ecolo)", re.IGNORECASE|re.MULTILINE)
    },
    "2010_PTB_FED": {
        "first_page": 4,
        "last_page": 51,
        "header": None,
        "footer": re.compile("- [0-9]{,2} -"),
        "remove": re.compile("Propositions du PTB\+", re.IGNORECASE)
    },
    "2010_PP_FED": {
        "first_page": 2,
        "last_page": 14,
        "header": re.compile("MANIFESTE DU PARTI POPULAIRE"),
        "footer": re.compile("(\nPARTI POPULAIRE|www.partipopulaire.be|info@partipopulaire.be)", re.IGNORECASE),
        "remove": None
    },
    "2010_PS_FED": {
        "first_page": 10,
        "last_page": 159,
        "header": None,
        "footer": re.compile("\n13\n"),
        "remove": None
    },
    "2010_CDH_FED": {
        "first_page": 2,
        "last_page": 318,
        "header": None,
        "footer": None,
        "remove": re.compile("(le cdh propose de)", re.IGNORECASE),
        "footer": re.compile("\n[0-9]{1,3}\n"),
    },



#=================================================
# 2014
#=================================================

    "2014_CDH_ALL":  {
        "first_page":3,
        "last_page":422,
        "header": re.compile("PROGRAMME CDH[^\n]+\n", re.IGNORECASE),
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("((proposition|action|chapitre)\s?(phare)?\s?[0-9]+)", re.IGNORECASE)
    },
    "2014_DEFI_BXL": {
        "first_page":5,
        "last_page":102,
        "header": re.compile("(Oui, Bruxelles et les Bruxellois ont un avenir|Programme des FDF pour la Région bruxelloise et Fédération Wallonie-Bruxelles)", re.IGNORECASE),
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2014_DEFI_EUR": {
        "first_page":2,
        "last_page":91,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Proposition [0-9]+)", re.IGNORECASE)
    },
    "2014_DEFI_FED": {
        "first_page":15,
        "last_page":151,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Proposition n.\s?[0-9]+)", re.IGNORECASE)
    },
    "2014_DEFI_WAL": {
        "first_page":2,
        "last_page":104,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Proposition n.\s?[0-9]+)", re.IGNORECASE)
    },
    "2014_ECOLO_ALL": {
        "first_page":3,
        "last_page":808,
        "excluded_pages": [19,42,43,70,71,91,92,116,117,136,137,161,162,182,183,204,205,240,241,252,268,269,284,296,307,333,334,364,365,366,392,393,416,445,446,463,464,490,491,520,521,537,565,566,580,598,620,633,641,647,670,671,685,709,710,733,734,758,759,760,780,788],
        "header":None,
        "footer": re.compile("Programme Ecolo[^\n]+\n", re.IGNORECASE),
        "remove": re.compile("(Priorite [0-9]|voir chapitre|Proposition :|Etat des lieux et horizon politique|Etat des lieux|Les priorités et propositions d'Ecolo|chapitre)", re.IGNORECASE)
    },
    "2014_MR_ALL": {
        "first_page":9, 
        "last_page":565,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2014_MR_BXL": {
        "first_page":3,
        "last_page":69,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None,
    },
    "2014_MR_WAL": {
        "first_page":1,
        "last_page":263,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("\\b(constats?)\\b", re.IGNORECASE)
    },
    "2014_PP_ALL":{
        "first_page":10,
        "last_page":91,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\t"),
        "remove": re.compile("(Proposition\t\n\s+n°\s?[0-9]+|propositionn°[0-9]+|propositionn)", re.IGNORECASE)
    },
    "2014_PS_ALL": {
        "first_page":22,
        "last_page":497,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None
    },
    "2014_PTB_ALL": {
        "first_page":3,
        "last_page":104,
        "header":None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(#GOLEFT.{,4}:|Constats\n|La vision du ptb-go!|Les propositions du ptb-go!)", re.IGNORECASE)
    },

#=================================================
# 2019
#=================================================
    "2019_ECOLO_ALL": {
        "first_page": 5,
        "last_page": 109,
        "header": re.compile("SUJET[^\n]+\n"),
        "footer": re.compile("Fiches programme", re.IGNORECASE),
        "remove": re.compile("(CONTEXTE POLITIQUE GÉNÉRAL|INFOS CLÉS À SAVOIR|\nPROPOSITIONS\n|3 CHIFFRES À RETENIR)", re.IGNORECASE)
    },
    "2019_PTB_ALL": {
        "first_page": 5,
        "last_page": 247,
        "header": re.compile("[0-9]+\.[^\n]+\.+[0-9]+", re.IGNORECASE),
        "footer": re.compile("(PROGRAMME PTB.{,5}MAI 2019|\n[0-9]{1,3}\n)", re.IGNORECASE),
        "remove": re.compile("(CONTENU\n|ce que nous voulons|vision\n|\\b(un|deux|trois|quatre|cinq|six|sept|huit|neuf)\.)", re.IGNORECASE)
    },
    "2019_PTB_EUR": {
        "first_page": 5,
        "last_page": 83,
        "header": re.compile("[0-9]+\.[^\n]+\.+[0-9]+", re.IGNORECASE),
        "footer": re.compile("(PTB, PROGRAMME EUROPÉEN 2019|[0-9]{1,3}\n)", re.IGNORECASE),
        "remove": re.compile("(position\n|ce que nous voulons|vision\n|\\b(un|deux|trois|quatre|cinq|six|sept|huit|neuf)\.)", re.IGNORECASE)
    },

    "2019_PS_ALL": {
        "first_page": 7,
        "last_page": 783,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("((une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix) propositions? phares?|chapitre [0-9]+|Propositions phares)", re.IGNORECASE)
    },
    "2019_PS_BXL": {
        "first_page": 13,
        "last_page": 225,
        "header": re.compile("^[^a-z]+\n\n"),
        "footer": re.compile("(Programme du Parti socialiste Bruxellois, Élections régionales mai 2019|\n[0-9]{,3}\n)", re.IGNORECASE),
        "remove": re.compile("PROPOSITIONS PRIORITÉS PHARES")
    },
    "2019_PP_ALL": {
        "first_page": 3,
        "last_page": 23,
        "excluded_pages": [4,5,6],
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": None
    },
    "2019_CDH_EUR": {
        "first_page": 4,
        "last_page": 57,
        "header": None,
        "footer": None,
        "remove": re.compile("((Actions|Diagnostic|Vision)\n|Priorité [0-9]+\s+:|Concrètement, nous proposons de :)", re.IGNORECASE)
    },
    "2019_CDH_ALL": {
        "first_page": 1,
        "last_page": 262,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Notre vision|Nos priorités|Mise en (oe|œ)uvre|(Priorités|Vision|Diagnostic)\n|Concrètement, nous proposons de :|Priorité [0-9]+\s+:|\\bt\\b)", re.IGNORECASE)
    },
    "2019_CDH_WAL": {
        "first_page": 1,
        "last_page": 71,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Notre vision|Nos priorités|Mise en (oe|œ)uvre|(Priorités|Vision|Diagnostic)\n|Concrètement, nous proposons de :|Priorité [0-9]+\s+:|\\bt\\b)", re.IGNORECASE)
    },

    "2019_CDH_BXL": {
        "first_page": 1,
        "last_page": 60,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Notre vision|Nos priorités|Mise en (oe|œ)uvre|(Priorités|Vision|Diagnostic)\n|Concrètement, nous proposons de :|Priorité [0-9]+\s+:|\\bt\\b)", re.IGNORECASE)
    },
    "2019_DEFI_EUR": {
        "first_page": 1,
        "last_page": 19,
        "header": re.compile("PRIVILÉGIER[^\n]+POUR|QU[^\n]+INFLUENTE"),
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("CONSTATS|PROPOSITIONS")
    },
    "2019_DEFI_FED": {
        "first_page": 2,
        "last_page": 262,
        "header": None,
        "footer": re.compile("defi.eu|Programme fédéral|\n[0-9]{1,3}\n"),
        "remove": re.compile("Proposition :|Proposition n°[0-9\s]*:")
    },
    "2019_DEFI_FWB": {
        "first_page": 3,
        "last_page": 53,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("Proposition n°[0-9\s]*:")
    },
    "2019_DEFI_WAL": {
        "first_page": 3,
        "last_page": 90,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("Proposition n°[0-9\s]*:")
    },
    "2019_DEFI_BXL": {
        "first_page": 9,
        "last_page": 148,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n|Version consolidée au 18-4-2019"),
        "remove": re.compile("Les propositions de DéFI")
    },

    "2019_MR_ALL": {
        "first_page": 3,
        "last_page": 244,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("(Chapitre [0-9\.]+|Bilan :|Nos priorités :)")
    },
    "2019_MR_EUR": {
        "first_page": 3,
        "last_page": 40,
        "header": None,
        "footer": re.compile("\n[0-9]{1,3}\n"),
        "remove": re.compile("Nos priorités :")
    }
}

