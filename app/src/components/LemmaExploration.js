import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { get } from "lodash/fp";

import SpecificityPerPartyView from "../components/SpecificityPerPartyView";
import HistoryView from "../components/HistoryView";
import SimilarLemmasCard from "../components/SimilarLemmasCard";
import ConcordanceView from "./ConcordanceView";
import PastCampaginLinks from "./PastCampaignLinks";
import yearsService from "../services/years";
import { fromMinWidthMediaQuery } from "../services/viewPort";
import ShareButton from "../components/ShareButton";
import { getLink } from "../services/links";

const styles = theme => ({
  messageContainer: {
    height: "100%",
    minHeigh: 100,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  itemContainer: {
    display: "flex",
    justifyContent: "center"
  },
  analyticsPaper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit
  },
  sidePaper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    [fromMinWidthMediaQuery]: {
      marginLeft: theme.spacing.unit
    }
  },
  shareIconContainer: {
    height: 12
  }
});

class LemmaExploration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedYear: null,
      years: null,
      usageData: null,
      isLoadingYears: true,
      errorYears: null,
      isLoading: false,
      errorLoading: null
    };

    this.handleYearSelection = this.handleYearSelection.bind(this);
  }

  componentDidMount() {
    yearsService.getYears().then(([years, error]) => {
      if (error) {
        this.setState({
          usageData: null,
          isLoadingYears: false,
          errorYears: error
        });
      } else {
        const selectedYear = years[0];

        this.setState({
          isLoadingYears: false,
          selectedYear,
          years
        });

        if (this.props.selectedLemma) {
          this.fetchData(this.props.selectedLemma, selectedYear);
        }
      }
    });
  }

  fetchData(lemma, year) {
    const { id: lemmaId } = lemma;
    this.setState({ isLoading: true });

    axios({
      method: "get",
      url: `/api/lemma_usage/${lemmaId}/${year}`
    })
      .then(get("data"))
      .then(usageData =>
        this.setState({
          usageData,
          isLoading: false,
          errorLoading: null
        })
      )
      .catch(error => {
        this.setState({
          usageData: null,
          isLoading: false,
          errorLoading: error
        });
        console.log(error);
      });
  }

  handleYearSelection(year) {
    this.setState({ selectedYear: year });
    const { selectedLemma } = this.props;

    this.fetchData(selectedLemma, year);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedLemma.id !== this.props.selectedLemma.id) {
      const selectedYear = this.state.years[0];

      this.setState({ selectedYear });
      this.fetchData(this.props.selectedLemma, selectedYear);
    }
  }

  getSelectedLemmaShareQuote() {
    const { selectedLemma } = this.props;
    const { display_word } = selectedLemma;

    return `Découvrez comment les partis utilisent le terme "${display_word}" dans leurs programmes !`;
  }

  render() {
    const {
      usageData,
      years,
      selectedYear,
      isLoadingYears,
      errorYears,
      isLoading,
      errorLoading
    } = this.state;
    const { classes, selectedLemma, handleLemmaSelection } = this.props;
    const { id: selectedLemmaId } = selectedLemma;

    return (
      <React.Fragment>
        {isLoadingYears ? (
          <Grid
            container
            className={classes.messageContainer}
            justify="center"
            alignContent="center"
          >
            <CircularProgress size={40} />
          </Grid>
        ) : errorYears ? (
          <Grid
            container
            className={classes.messageContainer}
            justify="center"
            alignContent="center"
          >
            <Typography>
              Oups, je n'ai pas réussi à télécharger mes données :s Déjà essayé
              de rafraichir la page ? Désolé...
            </Typography>
          </Grid>
        ) : (
          usageData && (
            <React.Fragment>
              <Paper elevation={1} className={classes.analyticsPaper}>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  className={classes.shareIconContainer}
                >
                  <ShareButton
                    text={this.getSelectedLemmaShareQuote()}
                    link={getLink(selectedLemma)}
                  />
                </Grid>
                <Grid container direction="row" justify="space-around">
                  <Grid item xs={12} sm={8}>
                    <Grid container direction="row" justify="space-around">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={classes.itemContainer}
                      >
                        <SpecificityPerPartyView
                          isLoading={isLoading}
                          errorLoading={errorLoading}
                          lemma={usageData}
                          year={selectedYear}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={classes.itemContainer}
                      >
                        <HistoryView lemma={selectedLemma} years={years} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.itemContainer}>
                    <PastCampaginLinks
                      years={years}
                      selectedYear={selectedYear}
                      lemma={selectedLemma}
                      onYearChange={this.handleYearSelection}
                    />
                  </Grid>
                </Grid>
              </Paper>
              <Grid container direction="row" justify="space-around">
                <Grid item xs={12} sm={8}>
                  <Paper elevation={1} className={classes.analyticsPaper}>
                    <ConcordanceView
                      isLoading={isLoading}
                      errorLoading={errorLoading}
                      lemmaId={selectedLemmaId}
                      year={selectedYear}
                      usageData={usageData}
                      selectedLemma={selectedLemma}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} className={classes.sidePaper}>
                    <Grid container direction="column">
                      <SimilarLemmasCard
                        lemma={selectedLemma}
                        onSelection={handleLemmaSelection}
                      />
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </React.Fragment>
          )
        )}
      </React.Fragment>
    );
  }
}

LemmaExploration.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLemmaSelection: PropTypes.func.isRequired,
  selectedLemma: PropTypes.object.isRequired
};

export default withStyles(styles)(LemmaExploration);
