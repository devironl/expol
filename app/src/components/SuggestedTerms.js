import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Tabs, Tab } from "@material-ui/core";

import ForceBubbleChartCollide from "./ForceBubbleChartCollide";
import SelectionHistory from "./SelectionHistory";
import LemmaChips from "./LemmaChips";
import Legend from "./Legend";

import {
  minWidthForCharts,
  fromMinWidthMediaQuery
} from "../services/viewPort";

const styles = theme => ({
  messageContainer: {
    height: "100%",
    width: "100%",
    minHeight: 300,
    minWidth: 300
  },
  tabsRoot: {
    width: 244,
    [fromMinWidthMediaQuery]: {
      width: "100%"
    }
  },
  tabLabel: {
    textTransform: "none"
  },
  legend: {
    marginTop: 4
  },
  tab: {
    [fromMinWidthMediaQuery]: {
      height: 404,
      width: 692
    }
  },
  hiddenTab: {
    display: "none"
  }
});

class SuggestedTerms extends React.Component {
  constructor(props) {
    super(props);

    this.tabs = [
      "les plus recherchés",
      "spécifiques à chaque parti",
      "apparus en 2019",
      "déjà explorés"
    ];

    this.state = {
      tabIndex: 0
    };
  }

  handleTabChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  render() {
    const { tabIndex } = this.state;
    const {
      classes,
      specificityData,
      newTermsData,
      topSearchData,
      handleLemmaSelection,
      mobileSpecificityData,
      mobileNewTermsData,
      mobileTopSearchData
    } = this.props;
    const innerWidth = window.innerWidth;

    return (
      <Grid container direction="column" alignContent="center">
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          classes={{ root: classes.tabsRoot }}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {this.tabs.map((tabName, index) => (
            <Tab
              label={
                <Typography className={classes.tabLabel}>{tabName}</Typography>
              }
              key={index}
            />
          ))}
        </Tabs>
        <Grid container justify="center">
          <div className={tabIndex !== 0 ? classes.hiddenTab : classes.tab}>
            {innerWidth > minWidthForCharts ? (
              <ForceBubbleChartCollide
                data={topSearchData}
                handleLemmaSelection={handleLemmaSelection}
                type="centered"
                sizeAttribute="count"
              />
            ) : (
              <LemmaChips
                lemmaList={mobileTopSearchData}
                handleLemmaSelection={handleLemmaSelection}
              />
            )}
          </div>
        </Grid>
        <Grid container justify="center">
          <div className={tabIndex !== 1 ? classes.hiddenTab : classes.tab}>
            {innerWidth > minWidthForCharts ? (
              <Grid
                container
                direction="column"
                justify="center"
                alignContent="center"
              >
                <Legend rootClassName={classes.legend} />
                <ForceBubbleChartCollide
                  data={specificityData}
                  handleLemmaSelection={handleLemmaSelection}
                  type="party"
                  sizeAttribute="party_specificity_rank"
                  sizeOrderReversed
                />
              </Grid>
            ) : (
              <LemmaChips
                lemmaList={mobileSpecificityData}
                handleLemmaSelection={handleLemmaSelection}
              />
            )}
          </div>
        </Grid>
        <Grid container justify="center">
          <div className={tabIndex !== 2 ? classes.hiddenTab : classes.tab}>
            {innerWidth > minWidthForCharts ? (
              <ForceBubbleChartCollide
                data={newTermsData}
                handleLemmaSelection={handleLemmaSelection}
                type="centered"
                sizeAttribute="count"
              />
            ) : (
              <LemmaChips
                lemmaList={mobileNewTermsData}
                handleLemmaSelection={handleLemmaSelection}
              />
            )}
          </div>
        </Grid>
        <Grid container justify="center">
          <div className={tabIndex !== 3 ? classes.hiddenTab : classes.tab}>
            <SelectionHistory handleLemmaSelection={handleLemmaSelection} />
          </div>
        </Grid>
      </Grid>
    );
  }
}

SuggestedTerms.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLemmaSelection: PropTypes.func.isRequired,
  mobileNewTermsData: PropTypes.array.isRequired,
  mobileSpecificityData: PropTypes.array.isRequired,
  mobileTopSearchData: PropTypes.array.isRequired,
  newTermsData: PropTypes.array.isRequired,
  specificityData: PropTypes.array.isRequired,
  topSearchData: PropTypes.array.isRequired
};

export default withStyles(styles)(SuggestedTerms);
