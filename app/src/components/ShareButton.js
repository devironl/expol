/*global FB */
import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import {
  Grid,
  TextField,
  IconButton,
  DialogTitle,
  Dialog,
  Tooltip
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";

import fLogo from "../assets/facebook.png";
import tLogo from "../assets/twitter.png";
import wLogo from "../assets/whatsapp.png";

const styles = theme => ({
  dialogContent: {
    minWidth: 230
  },
  imageSpan: {
    height: 32,
    width: 32
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 200
  },
  facebookAnchor: {
    cursor: "pointer"
  },
  logoImg: {
    height: 32,
    width: 32
  },
  shareButtonsContainer: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

class ShareDialog extends React.Component {
  state = {
    showCopiedTooltip: false
  };

  handleClose = () => {
    this.setState({ showCopiedTooltip: false });
    this.props.onClose();
  };

  handleTooltipOpen = () => {
    this.setState({ showCopiedTooltip: true });
  };

  handleTooltipClose = () => {
    this.setState({ showCopiedTooltip: false });
  };

  onClick = () => {
    const textField = document.getElementById("link-text-field");
    textField.focus();
    textField.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        this.setState({ showCopiedTooltip: true });
      }
    } catch (err) {
      console.log("Unable to copy to clipboard");
    }
  };

  getEncoded = () => {
    const { text, link } = this.props;

    return {
      encodedText: encodeURIComponent(text),
      encodedLink: encodeURIComponent(link),
      encodedFullQuote: encodeURIComponent(`${text}\n${link}`)
    };
  };

  facebookShare = () => {
    const { link , text } = this.props;

    FB.ui(
      {
        method: "share",
        href: link,
        quote: text
      },
      function() {}
    );
  };

  render() {
    const { classes, onClose, text, link, ...other } = this.props;
    const { encodedText, encodedLink, encodedFullQuote } = this.getEncoded();

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="dialogue-partage" {...other}>
        <DialogTitle id="dialogue-partage">Partager</DialogTitle>
        <Grid container direction="column" className={classes.dialogContent}>
          <Grid container justify="center">
            <Tooltip
              onClose={this.handleTooltipClose}
              onOpen={this.handleTooltipOpen}
              open={this.state.showCopiedTooltip}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Lien copié"
            >
              <TextField
                id="link-text-field"
                onClick={this.onClick}
                label="Lien vers ce terme"
                defaultValue={link}
                className={classes.textField}
                margin="normal"
                InputProps={{
                  readOnly: true
                }}
              />
            </Tooltip>
          </Grid>
          <Grid
            container
            justify="space-evenly"
            className={classes.shareButtonsContainer}
          >
            <Grid item>
              <div className={classes.imageSpan}>
                <a
                  target="_blank"
                  href={`https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedText}`}
                  rel="noopener noreferrer"
                >
                  <img src={tLogo} className={classes.logoImg} alt="Twitter" />
                </a>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.imageSpan}>
                <a
                  target="_blank"
                  href={`https://wa.me/?text=${encodedFullQuote}`}
                  rel="noopener noreferrer"
                >
                  <img src={wLogo} className={classes.logoImg} alt="WhatsApp" />
                </a>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.imageSpan}>
                <a
                  target="_blank"
                  onClick={this.facebookShare}
                  className={classes.facebookAnchor}
                >
                  <img src={fLogo} className={classes.logoImg} alt="Facebook" />
                </a>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

ShareDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  text: PropTypes.string,
  link: PropTypes.string
};

const ShareDialogWrapped = withStyles(styles)(ShareDialog);

class ShareButton extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { text, link } = this.props;
    return (
      <div>
        <IconButton
          onClick={this.handleClickOpen}
        >
          <ShareIcon fontSize="small"/>
        </IconButton>
        <ShareDialogWrapped
          text={text}
          link={link}
          open={this.state.open}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

ShareDialog.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string
};

export default ShareButton;
