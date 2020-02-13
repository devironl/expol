import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const campaigns = {
  2007: "législatives",
  2009: "régionales et européennes",
  2010: "législatives",
  2014: "législatives, régionales et européennes",
  2019: "législatives, régionales et européennes"
};

const styles = theme => ({
  container: {
    maxWidth: 245
  },
  formControlLabelRoot: {
    marginLeft: 0
  },
  radioButtonLabel: {
    padding: 4
  },
  radioButtonRoot: {
    padding: 6
  },
  radioButtonIconfontSize: {
    fontSize: 16
  }
});

class PastCampaignLinks extends React.Component {
  handleChange = event => {
    this.props.onYearChange(Number(event.target.value));
  };

  render() {
    const { classes, years, selectedYear } = this.props;

    return (
      <div className={classes.container}>
        <Grid container direction="column">
          <Typography variant="subtitle2">Campagnes</Typography>
          <RadioGroup
            aria-label="Campagne"
            value={String(selectedYear)}
            onChange={this.handleChange}
          >
            {years.map(year => (
              <FormControlLabel
                key={year}
                value={String(year)}
                classes={{
                  root: classes.formControlLabelRoot,
                  label: classes.radioButtonLabel
                }}
                control={
                  <Radio
                    classes={{ root: classes.radioButtonRoot }}
                    icon={
                      <RadioButtonUncheckedIcon
                        fontSize="small"
                        classes={{
                          fontSizeSmall: classes.radioButtonIconfontSize
                        }}
                      />
                    }
                    checkedIcon={
                      <RadioButtonCheckedIcon
                        fontSize="small"
                        classes={{
                          fontSizeSmall: classes.radioButtonIconfontSize
                        }}
                      />
                    }
                  />
                }
                label={
                  <div>
                    <Typography variant="caption">
                      {`${year} : ${campaigns[year]}`}
                    </Typography>
                  </div>
                }
              />
            ))}
          </RadioGroup>
        </Grid>
      </div>
    );
  }
}

PastCampaignLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired,
  selectedYear: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired
};

export default withStyles(styles)(PastCampaignLinks);
