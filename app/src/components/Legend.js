import React from "react";

import Grid from "@material-ui/core/Grid";

import groups from "../services/groups";
import { withStyles } from "@material-ui/core/styles";

const style = () => ({
  legendColor: {
    height: 12,
    width: 12,
    borderRadius: 6
  },
  legendLabel: {
    padding: 4,
    marginRight: 4,
    fontSize: 12
  }
});

function Legend(props) {
  const { classes, direction, rootClassName } = props;
  const getColor = groups.getPartyColor;
  const getName = groups.getPartyName;

  return (
    <Grid
      container
      direction={direction}
      justify="center"
      className={rootClassName}
    >
      {groups
        .getGroupList()
        .sort()
        .map(g => (
          <Grid item key={g}>
            <Grid container alignItems="center">
              <div
                className={classes.legendColor}
                style={{ backgroundColor: getColor(g), opacity: 0.8 }}
              />
              <span className={classes.legendLabel}> {getName(g)} </span>
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
}

export default withStyles(style)(Legend);
