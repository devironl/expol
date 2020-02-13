import React from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import logo from "../assets/Wilfried-logo-blanc.png";

const styles = () => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: 280,
    marginLeft: 12
  },
  image: {
    position: "relative",
    width: "100%",
    height: 64
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%"
  }
});

function LogoButton(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <a
        href="http://wilfriedmag.be"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.image}
      >
        <span
          className={classes.imageSrc}
          style={{
            backgroundImage: `url(${logo})`
          }}
        />
      </a>
    </div>
  );
}

LogoButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LogoButton);
