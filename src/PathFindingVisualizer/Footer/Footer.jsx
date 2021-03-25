import React, { Component } from "react";
import { MDBCol, MDBRow } from "mdbreact";

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <MDBRow>
        <MDBCol
          size="12"
          className="font-small pt-4 mt-4 text-center py-3"
          style={{ backgroundColor: "#e0e0e0" }}
        >
          &copy; {new Date().getFullYear()} Copyright: <a href="#"> Sourabh Gome </a>
        </MDBCol>
      </MDBRow>
    );
  }
}
