import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import LemmaExploration from "../components/LemmaExploration";
import SuggestedTerms from "../components/SuggestedTerms";
import Search from "../components/Search";

const styles = theme => ({
  contentPaper: {
    padding: theme.spacing.unit
  },
  title: {
    marginBottom: theme.spacing.unit
  },
  searchContainer: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  expansionPanelRoot: {
    border: "1px solid rgba(0,0,0,.125)",
    borderRadius: 4,
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    }
  }
});

class SearchView extends React.Component {
  render() {
    const {
      classes,
      selectedLemma,
      specificityData,
      newTermsData,
      topSearchData,
      mobileSpecificityData,
      mobileTopSearchData,
      mobileNewTermsData,
      showSuggestions,
      onToggleSuggestions,
      onLemmaSelection,
      onLemmaSelectionWithSearchCount
    } = this.props;

    return (
      <Grid container direction="column" justify="center" alignContent="center">
        <Grid item>
          <Paper elevation={1} className={classes.contentPaper}>
            <Grid
              container
              direction="column"
              justify="center"
              alignContent="center"
            >
              <Typography variant="h6" align="center" className={classes.title}>
                Saisissez un terme et découvrez comment les partis en parlent
              </Typography>
              <Divider />
              <div className={classes.searchContainer}>
                <Search
                  onLemmaSelect={onLemmaSelectionWithSearchCount}
                  selectedLemma={selectedLemma}
                />
              </div>
              {specificityData && (
                <ExpansionPanel
                  expanded={showSuggestions}
                  onChange={onToggleSuggestions}
                  classes={{ root: classes.expansionPanelRoot }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography color="textSecondary">
                      Termes suggérés
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <SuggestedTerms
                      specificityData={specificityData}
                      newTermsData={newTermsData}
                      topSearchData={topSearchData}
                      mobileSpecificityData={mobileSpecificityData}
                      mobileNewTermsData={mobileNewTermsData}
                      mobileTopSearchData={mobileTopSearchData}
                      handleLemmaSelection={onLemmaSelection}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item>
          {selectedLemma && (
            <LemmaExploration
              selectedLemma={selectedLemma}
              handleLemmaSelection={onLemmaSelection}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

SearchView.propTypes = {
  classes: PropTypes.object.isRequired,
  onLemmaSelection: PropTypes.func.isRequired,
  onLemmaSelectionWithSearchCount: PropTypes.func.isRequired,
  mobileNewTermsData: PropTypes.array,
  mobileSpecificityData: PropTypes.array,
  mobileTopSearchData: PropTypes.array,
  newTermsData: PropTypes.array,
  specificityData: PropTypes.array,
  topSearchData: PropTypes.array,
  selectedLemma: PropTypes.object,
  showSuggestions: PropTypes.bool.isRequired,
  onToggleSuggestions: PropTypes.func.isRequired
};

export default withStyles(styles)(SearchView);
