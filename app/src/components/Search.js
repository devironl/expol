import React from "react";

import PropTypes from "prop-types";
import Downshift from "downshift";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { Typography } from "@material-ui/core";

import axios from "axios";
import { debounce } from "lodash/fp";

const sortSuggestions = (query, suggesions) =>
  suggesions.sort(
    (a, b) =>
      a.display_word
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(query.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "")
        .length -
      b.display_word
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(query.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "")
        .length
  );
class AsyncSuggestionsWrapper extends React.Component {
  state = {
    data: undefined,
    loading: false,
    error: false
  };

  cancelToken = null;

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate({ children: _, ...prevProps }) {
    const { children, ...props } = this.props;
    if (prevProps.data.query !== props.data.query) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    if (this.cancelToken) {
      this.cancelToken();
    }
  }

  makeNetworkRequest = debounce(200, () => {
    const { url, method = "get", params, data } = this.props;

    axios({
      url,
      method,
      params,
      data,
      cancelToken: new axios.CancelToken(token => {
        this.cancelToken = token;
      })
    })
      .then(res => {
        this.cancelToken = null;

        this.setState({
          data: res.data,
          loading: false,
          error: false
        });
      })
      .catch(e => {
        // Early return if request was cancelled
        if (axios.isCancel(e)) {
          return;
        }
        this.setState({ data: undefined, error: e.message, loading: false });
        console.error(e);
      });
  });

  fetchData = () => {
    if (this.cancelToken) {
      this.cancelToken();
    }

    this.setState({ error: false, loading: true });

    this.makeNetworkRequest();
  };

  render() {
    const { children } = this.props;
    const { data, loading, error } = this.state;

    return children({
      data,
      loading,
      error,
      refetch: this.fetchData
    });
  }
}

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      variant="outlined"
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = suggestion.id === (selectedItem && selectedItem.id);

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.display_word}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  message: {
    padding: theme.spacing.unit
  }
});

function Search(props) {
  const { classes, onLemmaSelect, selectedLemma } = props;

  function onChange(lemma) {
    document.activeElement.blur();
    onLemmaSelect(lemma);
  }

  return (
    <div className={classes.root}>
      <Downshift
        onChange={onChange}
        selectedItem={selectedLemma}
        itemToString={item => (item ? item.display_word : "")}
        defaultHighlightedIndex={0}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: "Cherchez dans les programmes de 2019"
              })
            })}
            <div {...getMenuProps(isOpen)} className={classes.paper}>
              {(() => {
                if (!isOpen || !inputValue) {
                  return null;
                }

                return (
                  <Paper className={classes.paper}>
                    <AsyncSuggestionsWrapper
                      url="/api/search"
                      data={{ query: inputValue }}
                      method="post"
                    >
                      {({ loading, error, data }) => {
                        const items = data || [];
                        if (loading) {
                          return (
                            <Typography
                              color="textSecondary"
                              className={classes.message}
                            >
                              Chargement...
                            </Typography>
                          );
                        }

                        if (error) {
                          return (
                            <Typography
                              color="textSecondary"
                              className={classes.message}
                            >
                              Il y a eu un problème avec la requête
                            </Typography>
                          );
                        }

                        if (!items.length) {
                          return (
                            <Typography
                              color="textSecondary"
                              className={classes.message}
                            >
                              Pas de terme correspondant trouvé
                            </Typography>
                          );
                        }

                        return sortSuggestions(inputValue, items).map(
                          (item, index) =>
                            renderSuggestion({
                              suggestion: item,
                              index,
                              itemProps: getItemProps({ item }),
                              highlightedIndex,
                              selectedItem
                            })
                        );
                      }}
                    </AsyncSuggestionsWrapper>
                  </Paper>
                );
              })()}
            </div>
          </div>
        )}
      </Downshift>
    </div>
  );
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  onLemmaSelect: PropTypes.func.isRequired,
  selectedLemma: PropTypes.object
};

export default withStyles(styles)(Search);
