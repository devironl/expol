import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import groups from "../services/groups";

const styles = theme => {
  const styleRules = {
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
  };

  groups
    .getPartyList()
    .concat([undefined])
    .forEach(party => {
      styleRules[`chipColor-${party}`] = {
        backgroundColor: groups.getPartyColor(party).toString()
      };

      styleRules[`chipClickableColor-${party}`] = {
        opacity: 0.8,
        backgroundColor: groups.getPartyColor(party).toString(),
        '&:hover': {
          backgroundColor: groups.getPartyColor(party).brighter().toString()
        },
        '&:focus': {
          backgroundColor: groups.getPartyColor(party).brighter().toString()
        }
      };
    });

  return styleRules;
};

class LemmaChips extends React.Component {
  render() {
    const { classes, handleLemmaSelection, lemmaList } = this.props;

    return (
      <div className={classes.root}>
        {lemmaList.map(lemma => (
          <Chip
            key={lemma.id}
            label={lemma.display_word}
            className={classes.chip}
            color="primary"
            classes={{
              colorPrimary: classes[`chipColor-${lemma.party}`],
              clickableColorPrimary: classes[`chipClickableColor-${lemma.party}`]
            }}
            onClick={() =>
              handleLemmaSelection({
                id: lemma.lemma_id,
                display_word: lemma.display_word
              })
            }
          />
        ))}
      </div>
    );
  }
}

LemmaChips.propTypes = {
  classes: PropTypes.object.isRequired,
  lemmaList: PropTypes.array.isRequired,
  handleLemmaSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(LemmaChips);
