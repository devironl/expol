import React from "react";
import smoothscroll from "smoothscroll-polyfill";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Typography,
  Divider,
  Avatar,
  Link
} from "@material-ui/core";

import { fromMinWidthMediaQuery } from "../services/viewPort";
import civixLogo from "../assets/civix.png";
import testElectoralLogo from "../assets/test_electoral.png";
import gvk from "../assets/gvk.jpg";
import ldv from "../assets/ldv.jpg";
import linkedInLogo from "../assets/linkedin.png";

smoothscroll.polyfill();

const styles = theme => ({
  messagePaper: {
    padding: 3 * theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  title: {
    marginBottom: theme.spacing.unit
  },
  textContent: {
    paddingTop: theme.spacing.unit
  },
  wilfriedSvgContainer: {
    display: "none",
    [fromMinWidthMediaQuery]: {
      display: "block"
    }
  },
  navigationButton: {
    textTransform: "none",
    borderRadius: 100,
    marginLeft: 4
  },
  avatar: {
    margin: 16,
    width: 80,
    height: 80
  },
  othersAvatar: {
    margin: 16
  }
});

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.locationRefs = {
      project: React.createRef(),
      method: React.createRef(),
      team: React.createRef()
    };
  }

  scrollToLocation = location => {
    const { top } = this.locationRefs[location].current.getBoundingClientRect();

    window.scrollTo({
      top: top - 50,
      behavior: "smooth"
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction="column" justify="center" alignContent="center">
        <Grid item>
          <Grid container justify="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              classes={{ outlined: classes.navigationButton }}
              onClick={() => this.scrollToLocation("project")}
            >
              Le projet
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              classes={{ outlined: classes.navigationButton }}
              onClick={() => this.scrollToLocation("method")}
            >
              La méthode
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              classes={{ outlined: classes.navigationButton }}
              onClick={() => this.scrollToLocation("team")}
            >
              L'équipe
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <div className={classes.messagePaper} ref={this.locationRefs.project}>
            <Grid container alignItems="flex-end">
              <Grid item sm={2} className={classes.wilfriedSvgContainer}>
                <svg width="80" height="352" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g
                      stroke="null"
                      transform="rotate(180 32.882240295410156,175.92721557617188) "
                      id="g10"
                    >
                      <g
                        stroke="null"
                        id="g12"
                        transform="translate(0.75,-0.75) scale(0.10000000149011612) "
                      >
                        <path
                          fill="#231f20"
                          fillRule="nonzero"
                          d="m186.284035,3388.98l-36.855149,-20.33c0,0 -10.051404,-6.05 -10.946708,-16.45c-0.895304,-10.41 1.56909,-20.58 -19.87206,-28.56c-21.44115,-7.99 -52.490667,-22.75 -53.829008,-23.23c-1.347571,-0.49 -18.099912,-8.48 -15.413999,-18.15c2.676683,-9.68 6.11022,-21.72 22.041096,-30.71c-3.950414,-18.17 -14.666374,-27.37 -14.666374,-27.37c0,0 -2.907431,-11.61 3.11972,-16.46c-9.1561,-2.9 -12.728087,-6.05 -10.937479,-15.97c1.781378,-9.91 4.291922,-20.21 2.593613,-20.38c-1.707539,-0.19 -23.665565,-11.48 -22.474903,-27.93c1.190662,-16.46 -4.467291,-24.85 32.757056,-45.82c37.224347,-20.98 66.114058,-50.33 78.915984,-74.86c12.811156,-24.52 48.844841,-90.66 48.844841,-90.66l-20.545846,-14.52c0,0 -4.467291,-2.59 -1.199892,-10c0.904534,-1.62 0.904534,-1.62 0.904534,-1.62l-23.831704,-17.75l-0.378428,-7.15c0,0 -19.576702,-8.98 -18.976756,-29.62c0.590716,-20.66 14.592535,-25.82 14.592535,-25.82c0,0 -4.467291,-0.97 -2.981271,-8.39c1.49525,-7.43 6.257899,-22.26 6.257899,-40.66c0,-18.39 -2.685912,-30.65 -2.685912,-30.65c0,0 -57.179476,-80.99 -77.134606,-131.96c-19.9459,-50.98 -56.874888,-186.67 -55.988814,-239.9c0.904534,-53.24 3.12895,-87.6 8.048507,-112.77c4.910328,-25.17 11.611264,-36.3 -4.467291,-129.22c-16.087785,-92.93 -20.998113,-252.64 -16.973859,-342.18c4.015024,-89.54 6.248669,-137.94 5.353365,-150.04c-0.886074,-12.1 -10.71596,-48.39 -4.467291,-73.56c6.257899,-25.17 18.939836,-33.24 18.939836,-33.24c0,0 5.962541,-26.25 40.925553,-29.68c34.953782,-3.43 34.953782,-3.43 34.953782,-3.43c0,0 9.645287,-22.18 14.823283,-35.51c5.168766,-13.33 12.829616,-40.47 15.25709,-50.13c2.418244,-9.66 44.41447,-201.8 44.41447,-201.8l53.155223,-242.48c0,0 13.84491,-45.98 15.192481,-55.18c1.338341,-9.19 7.143973,-54.68 8.482315,-60.01c1.338341,-5.32 12.958835,-60.98 16.973859,-72.11c4.024254,-11.13 21.893417,-95.35 23.674795,-100.67c1.790608,-5.32 8.039277,-54.69 11.168227,-99.7c3.12895,-45.01 13.106514,-106.31 26.360708,-133.74c4.310382,-9.52 -1.338341,-14.2 -2.833591,-16.45c-1.48602,-2.27 -12.506568,-17.27 -12.506568,-18.72c0,-1.45 -6.11022,-21.46 -8.334636,-26.29c-2.233645,-4.85 -18.616788,-34.53 -23.979383,-60.99c-5.353365,-26.45 -13.244963,-50.5 -13.244963,-50.5c0,0 -5.214916,-4.35 -5.214916,-5.64c0,-1.29 3.184329,-7.29 3.184329,-7.29c0,0 -56.791819,-47.24 -60.816073,-48.69c-4.015024,-1.45 -32.609377,-22.26 -39.75335,-21.78c-7.153203,0.48 -25.723842,-6.66 -25.723842,-6.66c0,0 -56.468771,9.08 -77.023847,4.72c-20.545846,-4.35 -33.73543,-6.71 -38.20272,-24.13c-5.362595,-1.93 -7.365492,-12.17 -3.784275,-15.07c3.571987,-2.91 19.355184,-21.94 71.91969,-32.58c19.807451,6.28 42.291584,11.61 86.069188,6.28c23.379437,1.94 28.289765,4.53 28.289765,4.53c0,0 -8.713063,-7.99 -20.324327,-8.72c-11.620494,-0.73 -34.621504,2.42 -53.164453,-0.73c-18.533719,-3.14 -41.765477,-1.69 -60.299196,-25.89c-6.922455,-8.95 1.116823,-34.36 1.116823,-34.36l-0.895304,-8.47c0,0 -1.790608,-7.5 25.013137,-14.76c26.803745,-7.26 59.413122,-19.6 173.550556,-15.25c114.137434,4.36 115.918812,5.08 126.644002,6.78c10.72519,1.69 55.0289,17.63 66.824763,27.57c2.187496,-17.89 2.187496,-17.89 2.187496,-17.89c0,0 100.292525,9.43 131.56356,29.76c12.506568,10.65 6.691706,15.97 5.805632,45.5c-4.467291,2.9 -5.842552,3.05 -5.842552,3.05c0,0 8.297716,2.75 8.749983,19.94c0.443037,17.18 -1.264502,23.24 -1.264502,23.24c0,0 6.848615,-0.25 6.17483,5.56c-0.673786,5.8 -7.59624,11.85 -6.479418,36.78c1.116823,24.92 2.676683,22.26 -2.002897,38.23c0,0 1.338341,21.3 0.212289,26.86c-1.116823,5.57 -4.236542,13.79 -3.571987,18.88c0.673786,5.08 0.452267,7.74 0.452267,8.47c0,0.72 -8.260796,15.24 -4.467291,36.54c3.793505,21.29 11.611264,23.31 8.039277,87.84c-3.571987,64.53 2.981271,65.82 1.190662,94.86c-1.790608,29.04 -0.590716,128.74 -0.895304,143.91c-0.295358,15.16 -10.72519,86.79 -10.420602,88.73c0.295358,1.93 3.876575,10.32 3.876575,22.26c0,11.94 1.781378,61.95 -3.876575,90.67c-5.657953,28.71 -21.736508,106.15 -27.699049,128.09c-5.953311,21.94 -22.92717,99.38 -27.689819,129.06c-4.771879,29.69 -34.556894,101.32 -36.042914,112.61c-1.48602,11.3 5.067237,50.98 -2.972041,91.64c-8.039277,40.65 -16.383143,70.65 -15.192481,83.24c1.190662,12.59 8.639224,46.14 7.153203,56.14c-1.49525,10 -8.934582,31.3 -2.390554,71.63c15.487839,-1.93 17.278447,-1.93 20.850434,1.61c0.295358,15.17 -1.51371,17.35 -1.51371,17.35l10.152934,3.31c0,0 3.571987,0.32 1.190662,10.32c-2.381324,10 -11.491275,53.31 -9.017651,81.18c8.722293,-0.84 9.756046,-3.66 13.632621,-4.79c3.867345,-1.14 9.008421,-3.55 12.506568,3.87c1.264502,-2.17 -0.221519,-3.79 -0.221519,-3.79c0,0 3.719666,-2.9 4.993397,-4.84c1.255272,-1.93 1.181432,-5.89 9.672977,-7.02c8.482315,-1.12 18.192211,-3 20.038199,-3.03c1.845988,-0.04 6.248669,-0.44 13.171124,2.71c6.922455,3.14 25.225425,10.31 25.225425,10.31c0,0 6.571717,1.6 2.418244,11.7c4.393451,-3.66 2.602843,-9.65 2.602843,-9.65c0,0 8.131577,4.05 11.398976,6.37c1.236812,3.86 7.707,7.84 7.707,7.84c0,0 -1.356801,-1.29 -1.421411,-2.26c7.476251,3.8 16.023175,9.71 12.460419,18.97c-1.652159,4.32 -5.934851,6.56 -5.934851,6.56c0,0 3.784275,-1.39 5.990231,-3.98c2.676683,-3.16 4.218082,-8.74 1.661389,-12.92c-2.252105,-3.69 -11.094387,-8.23 -11.980462,-8.68c-0.895304,-0.45 -5.750252,-3.16 -6.05484,-4.06c-0.295358,-0.9 -0.295358,-0.9 -0.295358,-0.9c0,0 5.574884,3.34 9.903725,5.8c4.338072,2.44 15.017112,3.91 18.275281,8.22c3.267399,4.31 3.682746,7.97 -0.821465,13.82c-4.513441,5.85 -8.491545,4.5 -9.912955,5.2c-1.421411,0.71 -2.667453,0.77 -8.777673,6.5c-6.11022,5.72 -17.629185,8.87 -23.259448,9.13c0,0 -5.611803,10.48 -20.158188,17.55c-0.489187,-2.84 -1.393721,-2.98 -1.393721,-2.98c0,0 -0.516877,8.18 -1.347571,10.5c-0.830695,2.31 -3.147409,3.66 -4.393451,7.26c-1.246042,3.59 -3.498147,5.85 -3.498147,5.85c0,0 10.577511,-2.09 15.727817,0.98c2.067506,-6.64 2.418244,-9.27 3.433538,-10.43c1.006063,-1.16 3.378158,-2.89 4.799569,-6.3c1.430641,-3.41 1.070673,-12.6 15.847806,-21.41c14.767903,-8.81 27.708279,-7.07 30.024994,0.58c2.307485,7.65 -4.513441,15.5 -5.639493,17.42c-1.126053,1.93 -4.328842,11.25 -4.984167,14.59c-0.655326,3.35 -5.048777,12.67 -6.05484,14.28c-1.006063,1.6 -13.955669,31.76 -15.663208,36.92c-1.716769,5.16 -2.612073,6.86 -3.655056,8.22c1.56909,-5.32 6.18406,-19.35 4.171933,-26.94c-2.012127,-7.58 -7.023984,-12.47 -7.023984,-12.47c0,0 10.817489,11.18 4.273462,27.31c-6.553257,16.14 -14.444856,27.84 -14.444856,27.84c0,0 17.121538,-5.09 21.514989,1.93c2.381324,4.68 2.381324,4.68 2.381324,4.68c0,0 0.166139,3.36 -7.467021,12.73c-7.64239,9.37 -15.386309,21.55 -15.986256,23.89c-0.599946,2.34 -3.645826,3.71 -3.876575,3.71c-0.212289,0 0.599946,2.18 -4.984167,5.89c-2.012127,1.13 -1.938287,1.61 -1.938287,1.61c0,0 2.685912,11.78 1.790608,26.62c-0.895304,14.84 -3.05511,31.22 0.821465,57.51c3.867345,26.3 0.886074,36.14 0.738395,40.01c-0.147679,3.88 1.347571,11.3 0.452267,25.5c-0.895304,14.19 -4.024254,40.97 -3.876575,49.04c0.147679,8.07 0.747625,27.27 -1.929057,38.39c-2.685912,11.13 -3.581217,10.49 0.443037,25.82c4.024254,15.32 2.085966,44.37 -0.895304,73.4c-2.972041,29.04 -1.366031,31.43 -13.115744,37.9c-0.433807,11.31 2.695142,20.99 1.061443,32.6c-1.642929,11.62 -9.386849,37.92 -10.282153,59.85c-0.895304,21.94 -5.657953,36.14 -11.011318,52.28c-5.362595,16.13 -4.467291,4.19 2.676683,66.63c7.153203,62.43 -4.024254,47.42 4.467291,102.59c8.482315,55.18 13.84491,120.52 -16.973859,234.74c0,0 -14.897123,56.94 -33.800039,85.66c-18.912146,28.73 -50.293941,60.48 -54.105906,64.53c-3.821195,4.04 -10.845179,8.1 -11.574344,14.94c5.371825,6.04 4.467291,5.52 4.171933,7.08c-0.286128,1.54 -7.891598,10.74 -12.20198,21.54c-4.319612,10.81 -10.429832,24.85 -11.315906,29.21c-0.895304,4.36 -3.01819,6.75 -15.35862,10.39c-4.301152,19.93 -7.125513,28.32 -12.783466,30.1c0.295358,2.74 -1.56909,3.01 -1.56909,3.01c0,0 2.159806,3.12 3.202789,4.09c1.042983,0.96 8.417705,-1.46 12.432729,10.64c4.024254,12.1 2.233645,29.52 2.455164,32.19c0.230748,2.67 13.623391,14.52 16.752341,19.6c3.12895,5.09 9.14687,16.86 9.14687,16.86c0,0 8.057737,-14.19 33.513911,-17.11c25.465404,-2.9 47.801858,-0.23 41.543958,10.17c-6.248669,10.41 -39.670281,42.77 -39.670281,42.77c0,0 20.241258,26.44 32.747826,50.4c12.506568,23.96 25.465404,46.12 29.711176,54.03c4.245772,7.92 2.002897,20.02 -9.829886,41.56c-11.842013,21.53 -45.115945,87.6 -90.462639,136c-45.337464,48.4 -71.698171,60.49 -78.399108,62.67c-6.691706,2.18 -13.84491,2.18 -55.388868,-22.02c-41.543958,-24.2 -82.64488,-70.42 -86.216867,-72.35c-3.571987,-1.93 -3.571987,-1.93 -13.84491,0.24c-10.272923,2.18 -51.816881,15.25 -68.79997,14.28c-16.973859,-0.98 12.28505,-16.94 12.28505,-16.94c0,0 35.959845,-24.2 44.451389,-26.62"
                          id="path32"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </Grid>
              <Grid item sm={10}>
                <Typography
                  variant="title"
                  align="center"
                  className={classes.title}
                >
                  En mai, oubliez Google !
                </Typography>
                <Divider />
                <div className={classes.textContent}>
                  <Typography paragraph>
                    Bienvenue dans l’Explorateur de Programmes Politiques de
                    Wilfried, un moteur de recherche unique permettant
                    d’explorer les programmes complets de tous les partis avant
                    le 26 mai.
                  </Typography>
                  <Typography paragraph>
                    Pour ce faire, rien de plus simple. Saisissez dans le champ
                    de recherche les sujets qui vous parlent : climat,
                    éducation, immigration, fiscalité, mobilité, pensions,
                    petite enfance, loyers… ou laissez-vous guider par nos
                    suggestions. Pour chaque terme introduit dans le moteur de
                    recherche, vous verrez apparaître son importance relative
                    pour chaque parti, l’évolution de cette importance au fil
                    des campagnes et les extraits des programmes concernés. Vous
                    pourrez également explorer des thématiques liées à vos
                    sujets favoris, télécharger les programmes complets et
                    visualiser ce qui forme les thèmes centraux de campagne de
                    chaque parti.
                  </Typography>
                  <Typography paragraph>
                    “Lire avant d’élire” : c’est ce à quoi nous vous invitions
                    déjà dans les pages des derniers numéros de Wilfried, et
                    plus encore aujourd’hui, devant l’écran, avec cet outil
                    citoyen. Pour comprendre, et puis juger. En âme et
                    conscience.
                  </Typography>
                  <Typography paragraph>
                    Bien sûr, pas question ici de raconter des histoires ni
                    d’entrer dans les coulisses du pouvoir. Mais toujours cette
                    envie furieuse de prendre le temps de lire et d’analyser
                    pour mieux comprendre. Afin de poser un acte, le 26 mai
                    prochain, qui soit à la hauteur des enjeux du moment.
                    Réfléchi, documenté, pleinement assumé.
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.messagePaper} ref={this.locationRefs.method}>
            <Typography
              variant="title"
              align="center"
              className={classes.title}
            >
              La méthode
            </Typography>
            <Divider />
            <div className={classes.textContent}>
              <Typography variant="subtitle1">Choix des programmes</Typography>
              <Typography paragraph>
                Pour réaliser cet outil, nous avons pris en compte tous les
                partis politiques belges francophones disposant d’élus dans les
                assemblées régionales, fédérale ou européenne. Nous avons
                contacté leurs services d’archive, qui nous ont fourni les
                programmes électoraux pour les campagnes suivantes :
              </Typography>
              <Typography component="div" paragraph>
                <ul>
                  <li>Elections législatives de 2007</li>
                  <li>Elections régionales et européennes de 2009</li>
                  <li>Elections législatives de 2010</li>
                  <li>
                    Elections législatives régionales et européennes de 2014
                  </li>
                  <li>
                    Elections législatives, régionales et européennes de 2019
                  </li>
                </ul>
              </Typography>
              <Typography variant="subtitle1">
                Extraction du vocabulaire
              </Typography>
              <Typography paragraph>
                Ces programmes (fichiers PDF) ont été nettoyés pour ne prendre
                en compte que le texte brut (suppression des en-têtes, pieds de
                page, tables de matières, intitulés de chapitres,…).
              </Typography>
              <Typography paragraph>
                Nous avons ensuite extrait le vocabulaire des programmes à
                l’aide d’outils linguistiques. Ce vocabulaire comprend toutes
                les suites de 1 à 4 mots qui sont pertinentes linguistiquement
                (exclusion des adverbes, pronoms…). Tous ces termes ont été
                normalisés, afin de regrouper sous une même entrée les variantes
                d’une même forme (exemple: enseignant, enseignante,
                enseignant.e.s sont regroupés sous la même entrée). Pour des
                raisons de pertinence (filtrage des outliers), seuls les termes
                apparaissant au moins 5 fois dans la campagne 2019 (tous
                programmes confondus) ont été pris en compte.
              </Typography>
              <Typography variant="subtitle1">Calculs statistiques</Typography>
              <Typography paragraph>
                Des calculs statistiques ont été effectués afin de comprendre
                l’importance que prennent ces termes au sein de chaque campagne
                / programme. Trois scores ont été calculés :
              </Typography>
              <Typography component="div" paragraph>
                <ul>
                  <li>
                    Pour chaque campagne, on calcule la fréquence d’apparition
                    de chaque terme sur 10.000 mots, tous partis confondus, puis
                    par parti. Cela permet de mesurer l’évolution de
                    l’utilisation du terme au cours du temps.
                  </li>
                  <li>
                    Pour chaque parti, on calcule un indice de spécificité pour
                    chaque terme utilisé, au regard de tous les programmes de la
                    campagne. Pour ce calcul, nous nous référons à la méthode
                    décrite par Ludovic Lebart et André Salem dans leur ouvrage
                    Statistique textuelle, disponible{" "}
                    <a
                      href="http://lexicometrica.univ-paris3.fr/livre/st94/st94-tdm.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ici
                    </a>{" "}
                    (chapitre 6). Cette méthode, basée sur la distribution
                    hypergéométrique, estime la sur-représentation d’un terme
                    dans le programme en calculant sa probabilité d’apparaitre
                    autant de fois sous l’hypothèse d’une distribution aléatoire
                    du vocabulaire au sein de tous les programmes. Avec cette
                    méthode, la taille du programme est donc prise en compte.
                    Cela peut mener à des résultats contre-intuitifs, bien que
                    valides statistiquement. Par exemple, un terme sera
                    considéré plus spécifique à un parti qui le mentionne 5 fois
                    sur programme de 200 pages qu’à un parti qui le mentionne 7
                    fois sur 400 pages.
                  </li>
                  <li>
                    Pour chaque terme, on recherche les termes similaires. Cela
                    permet à l’utilisateur de naviguer à travers un domaine
                    d’intérêt. Ce calcul de similarité sémantique est basé sur
                    l’algorithme Word2Vec, mis à disposition par Google.
                  </li>
                </ul>
              </Typography>
              <Typography variant="subtitle1">Analyse qualitative</Typography>
              <Typography paragraph>
                Pour tous les termes analysés, le contexte d’apparition est
                affiché. Le but est de permettre à l’utilisateur d’avoir un
                aperçu de la manière dont le thème est traité par le parti. S’il
                veut en savoir plus, il peut également ouvrir le programme et
                atteindre directement la page concernée.
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.messagePaper} ref={this.locationRefs.team}>
            <Typography
              variant="title"
              align="center"
              className={classes.title}
            >
              L'équipe
            </Typography>
            <Divider />
            <Grid container justify="space-around">
              <Grid item sm={4}>
                <Grid container direction="column" alignItems="center">
                  <Avatar
                    alt="Louis de Viron"
                    src={ldv}
                    className={classes.avatar}
                  />
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/devironl"
                    rel="noopener noreferrer"
                  >
                    <img src={linkedInLogo} alt="Louis de Viron - LinkedIn" />
                  </a>
                  <Typography variant="subtitle2">Louis de Viron</Typography>
                  <Typography paragraph>
                    Linguiste spécialisé dans le traitement automatique du
                    langage, Louis est un passionné des mots. Après avoir
                    travaillé pour deux start-ups liées au Big data, il a créé
                    la société{" "}
                    <a
                      href="https://www.datatext.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DataText
                    </a>, dont le but est d’aider les entreprises à traiter et
                    valoriser leurs données, principalement textuelles.
                  </Typography>
                  <Typography paragraph>
                    Sensible au discours politique, Il travaille entre autres
                    pour l’émission “A votre Avis” sur la RTBF, dans laquelle il
                    prépare chaque semaine des analyses des réseaux sociaux en
                    lien avec le thème de l’émission. En collaboration avec
                    Wilfried, il réalise un de ses rêves : mettre son expertise
                    linguistique au service d’un projet citoyen.
                  </Typography>
                </Grid>
              </Grid>
              <Grid item sm={4}>
                <Grid container direction="column" alignItems="center">
                  <Avatar
                    alt="Guillaume Vankeerberghen"
                    src={gvk}
                    className={classes.avatar}
                  />
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/guillaume-vankeerberghen-7261a246/"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={linkedInLogo}
                      alt="Guillaume Vankeerberghen - LinkedIn"
                    />
                  </a>
                  <Typography variant="subtitle2">
                    Guillaume Vankeerberghen
                  </Typography>
                  <Typography paragraph>
                    Guillaume s'investit à temps plein dans des projets
                    entrepreunariaux auxquels il apporte ses compétences produit
                    et techniques. Auparavant, il a évolué en tant que Data
                    Scientist, Consultant, Couteau Suisse et Full Stack Software
                    Engineer au sein de Riaktr (ex Real Impact Analytics).
                  </Typography>
                  <Typography paragraph>
                    Ayant lui-même cherché, en dernière minute et en vain, un
                    accès digital et centralisé aux propositions politiques pour
                    les élections communales de 2018, il a tout de suite été
                    séduit par l'idée de construire un Explorateur des
                    Programmes. La collaboration avec Wilfried, dont il dévore
                    chaque numéro, a encore renforcé le sens du projet et son
                    envie de s’y investir.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.messagePaper}>
            <Typography
              variant="subtitle2"
              align="center"
              className={classes.title}
            >
              Autres projets liés aux élections
            </Typography>
            <Divider />
            <Grid container justify="center">
              <Grid item>
                <Link href="http://app.civix.be/" target="_blank" rel="noopener">
                  <Avatar
                    alt="CIVIX"
                    src={civixLogo}
                    className={classes.othersAvatar}
                  />
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="https://www.rtbf.be/info/election/test-electoral"
                  target="_blank"
                  rel="noopener"
                >
                  <Avatar
                    alt="Test electoral RTBF"
                    src={testElectoralLogo}
                    className={classes.othersAvatar}
                  />
                </Link>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

InfoPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InfoPage);
