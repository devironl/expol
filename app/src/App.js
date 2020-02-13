import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { isFinite } from "lodash/fp";
import * as d3 from "d3";
import axios from "axios";
import { get } from "lodash/fp";

import { fromMinWidthMediaQuery } from "./services/viewPort";
import groups from "./services/groups";
import history from "./services/history";
import InfoPage from "./pages/InfoPage";
import LogoButton from "./components/LogoButton";
import SearchView from "./pages/SearchView";

const styles = theme => ({
  root: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  toolbarRoot: {
    justifyContent: "center"
  },
  titleContainer: {
    marginLeft: 12,
    maxWidth: 1400,
    display: "none",
    cursor: "pointer",
    [fromMinWidthMediaQuery]: {
      display: "flex"
    }
  },
  navigationButton: {
    marginRight: 12
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    maxWidth: 1000,
    height: "100%",
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  errorContainer: {
    height: "100%",
    width: "100%",
    minHeight: 300,
    minWidth: 300
  },
  footer: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: 24,
    marginTop: theme.spacing.unit
  },
  footerText: {
    color: "lightgrey",
    fontSize: 10,
    margin: 6
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "search",
      suggestionsShown: true,
      selectedLemma: null,
      isLoading: false,
      errorLoading: null,
      specificityData: null,
      mobileSpecificityData: null,
      newTermsData: null,
      mobileNewTermsData: null
    };

    this.handleLemmaSelection = this.handleLemmaSelection.bind(this);
    this.handleLemmaSelectionWithSearchCount = this.handleLemmaSelectionWithSearchCount.bind(
      this
    );
  }

  handleLemmaSelection(selectedLemma) {
    this.setState({ selectedLemma, suggestionsShown: !!!selectedLemma });
    window.location.hash = selectedLemma ? `#lid=${selectedLemma.id}` : "";
    history.add(selectedLemma);
  }

  handleLemmaSelectionWithSearchCount(selectedLemma) {
    this.handleLemmaSelection(selectedLemma);

    if (selectedLemma) {
      axios({
        method: "post",
        url: `/api/count_search/${selectedLemma.id}`
      }).catch(error => {
        console.log("Error saving search", error);
      });
    }
  }

  toggleSuggestions = () => {
    this.setState({ suggestionsShown: !this.state.suggestionsShown });
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    const searchString = window.location.hash;
    if (searchString) {
      const lemma_id = Number(searchString.split("lid=")[1]);
      if (lemma_id && isFinite(lemma_id)) {
        axios({
          method: "get",
          url: `/api/lemma/${lemma_id}`
        })
          .then(get("data"))
          .then(lemma => this.handleLemmaSelection(lemma))
          .catch(error => {
            console.log("Error fetching lemma from search params.");
          });
      }
    }

    Promise.all([
      d3.json("/data/graph_list.json"),
      d3.json("/data/new_terms_2019.json"),
      axios({
        method: "get",
        url: `/api/top_search`
      }).then(get("data"))
    ])
      .then(([specificityData, newTermsData, topSearchData]) => {
        groups.init(specificityData, "party");
        this.setState({
          isLoading: false,
          errorLoading: null,
          specificityData,
          newTermsData,
          topSearchData,
          mobileSpecificityData: specificityData.filter(
            (_, i) => i % 5 === 0 || (i - 1) % 5 === 0
          ),
          mobileNewTermsData: newTermsData.filter((_, i) => (i + 1) % 2),
          mobileTopSearchData: topSearchData.slice(0, 10)
        });
      })
      .catch(error => this.setState({ isLoading: false, errorLoading: error }));
  }

  setView = view => {
    this.setState({ view });
  };

  render() {
    const { classes } = this.props;
    const {
      isLoading,
      errorLoading,
      selectedLemma,
      specificityData,
      newTermsData,
      topSearchData,
      mobileSpecificityData,
      mobileTopSearchData,
      mobileNewTermsData,
      suggestionsShown,
      view
    } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar
            disableGutters={!this.state.open}
            classes={{ root: classes.toolbarRoot }}
          >
            <LogoButton />
            <Grid
              container
              direction="column"
              className={classes.titleContainer}
              onClick={() => this.setView("search")}
            >
              <Typography variant="h6" color="inherit" noWrap>
                L'Explorateur de Programmes Politiques
              </Typography>
              <Typography variant="caption" color="inherit">
                <em>Lire avant d'élire</em>
              </Typography>
            </Grid>
            {this.state.view === "info" ? (
              <IconButton
                color="inherit"
                aria-label="Information"
                className={classes.navigationButton}
                onClick={() => this.setView("search")}
              >
                <HomeIcon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="Information"
                className={classes.navigationButton}
                onClick={() => this.setView("info")}
              >
                <InfoIcon />
              </IconButton>
            )}
          </Toolbar>
          {isLoading && <LinearProgress color="secondary" />}
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {errorLoading ? (
            <Grid item>
              <Grid
                container
                className={classes.errorContainer}
                justify="center"
                alignContent="center"
              >
                <Typography>
                  Oups, je n'ai pas réussi à télécharger mes données :s Déjà
                  essayé de rafraichir la page ? Désolé...
                </Typography>
              </Grid>
            </Grid>
          ) : view === "info" ? (
            <InfoPage />
          ) : (
            <SearchView
              selectedLemma={selectedLemma}
              specificityData={specificityData}
              newTermsData={newTermsData}
              topSearchData={topSearchData}
              mobileSpecificityData={mobileSpecificityData}
              mobileTopSearchData={mobileTopSearchData}
              mobileNewTermsData={mobileNewTermsData}
              onLemmaSelection={this.handleLemmaSelection}
              onLemmaSelectionWithSearchCount={
                this.handleLemmaSelectionWithSearchCount
              }
              showSuggestions={suggestionsShown}
              onToggleSuggestions={this.toggleSuggestions}
            />
          )}
        </main>
        <footer className={classes.footer}>
          <Grid container justify="center" alignItems="center">
            <p className={classes.footerText}>
              © 2019 Wilfried Magazine, DataText SPRL
            </p>
          </Grid>
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
