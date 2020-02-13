import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  LinearProgress,
  Link,
  Grid,
  Typography,
  Tabs,
  Tab,
  Avatar,
  TablePagination,
  Divider
} from "@material-ui/core";
import axios from "axios";

import { get } from "lodash/fp";

import logos from "../services/logos";
import civixLogo from "../assets/civix.png";
import groups from "../services/groups";
import {
  N_PER_COUNT_STRING,
  freqToFormattedPerCount
} from "../services/frequency";

import { fromMinWidthMediaQuery } from "../services/viewPort";
import ConcordanceList from "./ConcordanceList";

// Should always match the one
// in produce output views
const N_CONCORDANCE_PER_PAGE = 5;

const styles = theme => ({
  messageContainer: {
    height: "100%",
    width: "100%",
    minHeight: 68,
    minWidth: 300
  },
  progressContainer: {
    height: 2
  },
  progressRoot: {
    height: 2
  },
  tabsRoot: {
    width: 250,
    [fromMinWidthMediaQuery]: {
      width: 600
    }
  },
  tabButtons: {
    maxWidth: 100
  },
  tabsScrollContainer: {
    paddingBottom: 20
  },
  tabsIndicator: {
    marginBottom: 20
  },
  avatarRoot: {
    borderRadius: 0
  },
  avatarImg: {
    objectFit: "scale-down"
  },
  countCaption: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  civixContainer: {
    paddingTop: 4
  },
  civixLogo: {
    height: 16,
    width: 16,
    marginRight: theme.spacing.unit
  }
});

class ConcordanceView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partyIndex: 0,
      pageIndex: 0,
      isPageLoading: false,
      errorLoadingPage: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.usageData !== this.props.usageData) {
      this.setState({
        partyIndex: 0,
        pageIndex: 0
      });
    }
  }

  handlePageChange = (event, pageIndex) => {
    const { usageData } = this.props;
    const { partyIndex } = this.state;

    if (usageData[partyIndex].concordance_page_list[pageIndex]) {
      this.setState({ pageIndex });
    } else {
      this.setState({ isPageLoading: true });
      const { lemmaId, year } = this.props;
      const { party } = usageData[partyIndex];

      axios({
        method: "get",
        url: `/api/lemma_concordance/${lemmaId}/${year}/${party}/${pageIndex}`
      })
        .then(get("data"))
        .then(concordancePage => {
          usageData[partyIndex].concordance_page_list[
            pageIndex
          ] = concordancePage;

          this.setState({
            pageIndex,
            isPageLoading: false,
            errorLoading: null
          });
        })
        .catch(error =>
          this.setState({
            pageIndex: 0,
            isPageLoading: false,
            errorLoading: error
          })
        );
    }
  };

  handleTabChange = (event, partyIndex) => {
    this.setState({ partyIndex, pageIndex: 0 });
  };

  render() {
    const { partyIndex, pageIndex } = this.state;
    const {
      classes,
      usageData,
      year,
      isLoading,
      errorLoading,
      selectedLemma
    } = this.props;
    usageData &&
      usageData.sort((a, b) => b.specificity_score - a.specificity_score);

    return (
      <Grid container direction="column">
        {errorLoading ? (
          <Grid item>
            <Grid
              container
              className={classes.messageContainer}
              justify="center"
              alignContent="center"
            >
              <Typography>
                Oups, je n'ai pas réussi à télécharger mes données :s Déjà
                essayé de rafraichir la page ? Désolé...
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <React.Fragment>
            <Typography variant="subtitle2">Dans les programmes</Typography>
            <Grid container justify="center">
              <Tabs
                value={partyIndex}
                onChange={this.handleTabChange}
                classes={{
                  root: classes.tabsRoot,
                  scrollButtons: classes.tabButtons,
                  scroller: classes.tabsScrollContainer,
                  indicator: classes.tabsIndicator
                }}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {usageData.map(({ party }) => (
                  <Tab
                    label={
                      <Grid container justify="center" alignContent="center">
                        <Avatar
                          alt={party}
                          src={logos[party]}
                          classes={{
                            root: classes.avatarRoot,
                            img: classes.avatarImg
                          }}
                        />
                      </Grid>
                    }
                    key={party}
                  />
                ))}
              </Tabs>
            </Grid>
            <div className={classes.progressContainer}>
              {isLoading && (
                <LinearProgress
                  classes={{ root: classes.progressRoot }}
                  color="secondary"
                />
              )}
            </div>
            {!!usageData[partyIndex] && (
              <Typography variant="caption" className={classes.countCaption}>
                {`${groups.getPartyNameWithPronoun(
                  usageData[partyIndex].party
                )} a mentionné ce terme ${
                  usageData[partyIndex].n_concordance
                } fois dans son programme ${year}`}
                <br />
                {`(${freqToFormattedPerCount(
                  usageData[partyIndex].frequency
                )} fois par ${N_PER_COUNT_STRING} termes)`}
              </Typography>
            )}
            {!!usageData[partyIndex] &&
              !!usageData[partyIndex].concordance_page_list[pageIndex] && (
                <ConcordanceList
                  concordancePage={
                    usageData[partyIndex].concordance_page_list[pageIndex]
                  }
                  selectedLemma={selectedLemma}
                />
              )}
            {usageData[partyIndex] &&
              usageData[partyIndex].n_page > 1 && (
                <TablePagination
                  rowsPerPageOptions={[N_CONCORDANCE_PER_PAGE]}
                  component={"div"}
                  colSpan={3}
                  count={usageData[partyIndex].n_concordance}
                  rowsPerPage={N_CONCORDANCE_PER_PAGE}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from} à ${to} de ${count}`
                  }
                  page={pageIndex}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handlePageChange}
                />
              )}
            {!!!usageData[partyIndex] && (
              <Grid
                container
                justify="center"
                className={classes.messageContainer}
              >
                <Typography>
                  Ce terme n’a pas été assez utilisé en {year}. Il n’est donc
                  pas répertorié par le système.
                </Typography>
              </Grid>
            )}
            <Divider />
            <Typography variant="body1" align="center" component="div">
              <Link
                href="http://app.civix.be/"
                target="_blank"
                rel="noopener"
                color="default"
              >
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  className={classes.civixContainer}
                >
                  <img
                    src={civixLogo}
                    className={classes.civixLogo}
                    alt="CIVIX"
                  />
                  Des questions ? Posez les directement aux partis grâce à CIVIX
                </Grid>
              </Link>
            </Typography>
          </React.Fragment>
        )}
      </Grid>
    );
  }
}

ConcordanceView.propTypes = {
  classes: PropTypes.object.isRequired,
  errorLoading: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  lemmaId: PropTypes.number.isRequired,
  usageData: PropTypes.array,
  year: PropTypes.number.isRequired,
  selectedLemma: PropTypes.object.isRequired
};

export default withStyles(styles)(ConcordanceView);
