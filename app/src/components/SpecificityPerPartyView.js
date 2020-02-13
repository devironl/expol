import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography, Tooltip, Grid } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import { flow, map, pick } from "lodash/fp";

import HorizontalBarChart from "./HorizontalBarChart";

const styles = theme => ({
  messageContainer: {
    height: "100%",
    minHeight: 100,
    width: 230
  },
  progressContainer: {
    height: 2
  },
  progressRoot: {
    height: 2
  },
  helpIcon: {
    marginLeft: 20,
    fontSize: 18
  }
});

const extractAndSortData = flow(
  map(pick(["party", "specificity_score"])),
  array => array.sort((a, b) => b.specificity_score - a.specificity_score)
);

class SpecificityPerPartyView extends React.Component {
  render() {
    const { classes, lemma, year, isLoading, errorLoading } = this.props;

    return (
      <div className={classes.container}>
        <Grid container alignItems="center">
          <Typography variant="subtitle2">
            Importance relative par parti
          </Typography>
          <Tooltip
            title="Ce graphique représente la spécificité du terme au sein de chacun des programmes. Le score prend en compte la fréquence du terme au sein du programme du parti et dans tous les programmes. La formule est disponible sur la page d'Information."
            color="action"
            fontSize="small"
            enterTouchDelay={500}
            leaveTouchDelay={3500}
          >
            <HelpOutlineIcon fontSize="small" className={classes.helpIcon} />
          </Tooltip>
        </Grid>
        <Typography variant="caption">
          Score de spécificité, campagne {year}
        </Typography>
        <div className={classes.progressContainer}>
          {isLoading && (
            <LinearProgress
              classes={{ root: classes.progressRoot }}
              color="secondary"
            />
          )}
        </div>
        {errorLoading ? (
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
          <HorizontalBarChart data={extractAndSortData(lemma)} />
        )}
      </div>
    );
  }
}

SpecificityPerPartyView.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorLoading: PropTypes.object,
  lemma: PropTypes.array.isRequired,
  year: PropTypes.number.isRequired
};

export default withStyles(styles)(SpecificityPerPartyView);
