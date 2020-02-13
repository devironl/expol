import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import Concordance from "./Concordance";

const styles = () => ({});

class ConcordanceList extends React.Component {
  render() {
    const { concordancePage, selectedLemma } = this.props;
    const { concordance_list, party, year } = concordancePage;
    return (
      <Grid container direction="column" alignContent="center">
        {concordance_list.map((concordance, index) => (
          <Concordance
            concordance={concordance}
            party={party}
            year={year}
            key={index}
            selectedLemma={selectedLemma}
          />
        ))}
      </Grid>
    );
  }
}

ConcordanceList.propTypes = {
  classes: PropTypes.object.isRequired,
  concordancePage: PropTypes.object.isRequired,
  selectedLemma: PropTypes.object.isRequired
};

export default withStyles(styles)(ConcordanceList);
