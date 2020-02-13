import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Chip, Typography } from "@material-ui/core";

import history from "../services/history";

const styles = theme => ({
  root: {
    height: "100%",
    width: "100%",
    overflowY: "scroll"
  },
  chipsContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: 4
  },
  emptyMessageContainer: {
    height: "100%",
    width: "100%"
  }
});
class SelectionHistory extends React.Component {
  render() {
    const { classes, handleLemmaSelection } = this.props;

    return (
      <div className={classes.root}>
        {history.getHistory().length ? (
          <div className={classes.chipsContainer}>
            {history
              .getHistory()
              .map(lemma => (
                <Chip
                  key={lemma.id}
                  label={lemma.display_word}
                  className={classes.chip}
                  onClick={() => handleLemmaSelection(lemma)}
                />
              ))}
          </div>
        ) : (
          <Grid
            container
            justify="center"
            alignContent="center"
            className={classes.emptyMessageContainer}
          >
            <Typography variant="body1">
              <em>Selectionnez des termes et vous les retrouverez ici</em>
            </Typography>
          </Grid>
        )}
      </div>
    );
  }
}

SelectionHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLemmaSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(SelectionHistory);
