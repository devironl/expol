import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Link,
  Typography,
  LinearProgress,
  Tooltip
} from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import axios from "axios";
import { get } from "lodash/fp";

const styles = theme => ({
  messageContainer: {
    height: "100%",
    width: "100%",
    minHeight: 100,
    minWidth: 100
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

class SimilarLemmasCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      similarLemmaList: null,
      isLoading: false,
      errorLoading: null
    };
  }

  componentDidMount() {
    this.fetchData(this.props.lemma);
  }

  fetchData(lemma) {
    const { id: lemmaId } = lemma;
    this.setState({ isLoading: true });

    axios({
      method: "get",
      url: `/api/lemma_similarity/${lemmaId}`
    })
      .then(get("data"))
      .then(similarLemmaList =>
        this.setState({
          similarLemmaList,
          isLoading: false,
          errorLoading: null
        })
      )
      .catch(error => {
        this.setState({
          similarLemmaList: null,
          isLoading: false,
          errorLoading: error
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
    const { classes, onSelection } = this.props;
    const { isLoading, errorLoading, similarLemmaList } = this.state;

    return (
      <Grid container direction="column">
        <Grid container alignItems="center">
          <Typography variant="subtitle2">Termes liés</Typography>
          <Tooltip
            title="Ces termes liés se basent sur les co-occurrences de termes au sein des programmes. Ils ont été détectés à l’aide d’un algorithme d’intelligence artificielle."
            color="action"
            fontSize="small"
            enterTouchDelay={500}
            leaveTouchDelay={3500}
          >
            <HelpOutlineIcon fontSize="small" className={classes.helpIcon} />
          </Tooltip>
        </Grid>
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
          <Grid container direction="column">
            {similarLemmaList && similarLemmaList.length ? (
              similarLemmaList.map(lemma => (
                <Typography variant="body1" key={lemma.id}>
                  <Link
                    href={"javascript:;"}
                    color="default"
                    onClick={() => onSelection(lemma)}
                  >
                    {lemma.display_word}
                  </Link>
                </Typography>
              ))
            ) : (
              <Typography variant="caption">Pas de terme lié</Typography>
            )}
          </Grid>
        )}
      </Grid>
    );
  }
}

SimilarLemmasCard.propTypes = {
  classes: PropTypes.object.isRequired,
  lemma: PropTypes.object.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default withStyles(styles)(SimilarLemmasCard);
