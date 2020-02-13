import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Link } from "@material-ui/core";

import ShareButton from "../components/ShareButton";
import groups from "../services/groups";
import { getLink } from "../services/links";
import { fromMinWidthMediaQuery } from "../services/viewPort";

const styles = () => ({
  root: {
    margin: 8 * 2,
    [fromMinWidthMediaQuery]: {
      width: 450
    }
  }
});

function Concordance(props) {
  const { classes, concordance, party, year, selectedLemma } = props;
  const { concordance: inputSentence, location, original_word } = concordance;
  const sentence = inputSentence.normalize();
  const originalWord = original_word.normalize();
  const iOSAndSafari =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream &&
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") === -1 &&
    navigator.userAgent.indexOf("FxiOS") === -1;

  return (
    <div className={classes.root}>
      <Typography variant="body1">
        {sentence
          .split(
            new RegExp(
              `([\\s.!?()"';:,-]|^)(${originalWord})([\\s.!?()"';:,-]|$)`,
              "gu"
            )
          )
          .reduce(
            (acc, current, idx, src) =>
              current === originalWord
                ? acc.concat([<strong key={idx}>{originalWord}</strong>])
                : acc.concat(current),
            []
          )}
      </Typography>
      <Grid container justify="space-between">
        <Typography variant="caption">
          <Link
            target="_blank"
            color="default"
            href={encodeURI(
              `/programmes/${location.pdf_file}#page${
                !iOSAndSafari ? "=" : ""
              }${location.page}&search="${original_word}"`
            )}
          >
            {`${groups.getPartyName(party)}, programme ${
              location.program_type
            } ${year}, p. ${location.page}`}
          </Link>
        </Typography>
        <ShareButton
          text={`"${sentence}" (${groups.getPartyName(party)}, programme ${
            location.program_type
          } ${year})`}
          link={getLink(selectedLemma)}
        />
      </Grid>
    </div>
  );
}

Concordance.propTypes = {
  concordance: PropTypes.object.isRequired,
  selectedLemma: PropTypes.object.isRequired
};

export default withStyles(styles)(Concordance);
