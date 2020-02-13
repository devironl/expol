import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  LinearProgress,
  Typography,
  Tooltip,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import axios from "axios";
import { get, fromPairs } from "lodash/fp";

import LineChart from "./LineChart";
import groups from "../services/groups";
import { N_PER_COUNT_STRING } from "../services/frequency";

const styles = theme => ({
  container: {
    maxWidth: 245
  },
  messageContainer: {
    height: "100%",
    width: "100%",
    minHeight: 70,
    minWidth: 100
  },
  helpIcon: {
    marginLeft: 20,
    fontSize: 18
  },
  progressContainer: {
    height: 2
  },
  progressRoot: {
    height: 2
  },
  subtitle: {
    paddingBotton: theme.spacing.unit * 2
  },
  formControlLabelRoot: {
    margin: 0
  },
  radioButtonRoot: {
    padding: 6
  },
  radioButtonIconfontSize: {
    fontSize: 12
  }
});

class HistoryView extends React.Component {
  constructor(props) {
    super(props);

    this.seriesList = ["total", ...groups.getPartyList()];
    this.emptyData = this.props.years.map(year => ({
      year,
      values: fromPairs(this.seriesList.map(series => [series, 0]))
    }));

    this.state = {
      timeUsageData: null,
      isLoading: false,
      errorLoading: null,
      selectedSeries: this.seriesList[0]
    };
  }

  componentDidMount() {
    const { lemma } = this.props;

    this.fetchData(lemma);
  }

  handlePartyChange = event => {
    this.setState({ selectedSeries: event.target.value });
  };

  fetchData(lemma) {
    const { id: lemmaId } = lemma;
    this.setState({ isLoading: true });

    axios({
      method: "get",
      url: `/api/lemma_time_usage/${lemmaId}`
    })
      .then(get("data"))
      .then(timeUsageData =>
        this.setState({
          timeUsageData,
          isLoading: false,
          errorLoading: null,
          selectedSeries: this.seriesList[0]
        })
      )
      .catch(error => {
        this.setState({
          timeUsageData: null,
          isLoading: false,
          errorLoading: error,
          selectedSeries: null
        });
        console.log(error);
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lemma.id !== this.props.lemma.id) {
      this.fetchData(this.props.lemma);
    }
  }

  render() {
    const { classes } = this.props;
    const { isLoading, errorLoading, timeUsageData } = this.state;

    return (
      <div className={classes.container}>
        <Grid container alignItems="center">
          <Typography variant="subtitle2">Importance par campagne</Typography>
          <Tooltip
            title="Evolution de la fréquence du terme au fil des campagnes."
            color="action"
            fontSize="small"
            enterTouchDelay={500}
            leaveTouchDelay={3500}
          >
            <HelpOutlineIcon fontSize="small" className={classes.helpIcon}/>
          </Tooltip>
        </Grid>
        <Typography variant="caption" className={classes.subtitle}>
          {`Nb. d'occurrences par ${N_PER_COUNT_STRING} termes`}
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
          <React.Fragment>
            <LineChart
              series={this.state.selectedSeries}
              data={timeUsageData || this.emptyData}
            />
            <RadioGroup
              aria-label="Party"
              value={this.state.selectedSeries}
              onChange={this.handlePartyChange}
              row
            >
              {this.seriesList.map(party => (
                <FormControlLabel
                  classes={{ root: classes.formControlLabelRoot }}
                  key={party}
                  value={party}
                  labelPlacement="end"
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
                          nativeColor={groups.getPartyColor(party).toString()}
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
                      <Typography variant="caption">{groups.getPartyName(party)}</Typography>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </React.Fragment>
        )}
      </div>
    );
  }
}

HistoryView.propTypes = {
  classes: PropTypes.object.isRequired,
  lemma: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired
};

export default withStyles(styles)(HistoryView);
