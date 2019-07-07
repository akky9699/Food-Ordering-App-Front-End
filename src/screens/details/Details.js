import React, { Component } from "react";
import "./Details.css";
import { withStyles } from "@material-ui/core/styles";
import Header from "../../common/header/Header";

const styles = theme => ({});

class Details extends Component {

  render() {


    return (
      <div>
        <Header />
     
      </div>
    );
  }
}

export default withStyles(styles)(Details);
