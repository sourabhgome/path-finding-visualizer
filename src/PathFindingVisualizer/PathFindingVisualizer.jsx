import reactDom from "react-dom";
import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBFooter, MDBBtn } from "mdbreact";
import "./PathFindingVisualizer.css";
import Navbar from "./Navbar/Navbar";
import Grid from "./Grid/Grid";
import Toolbar from "./Toolbar/Toolbar";
import Footer from "./Footer/Footer";

export default class PathFindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.registerGrid = this.registerGrid.bind(this);
    this.onVisualize = this.onVisualize.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onReset = this.onReset.bind(this);
    this.setAlgorithm = this.setAlgorithm.bind(this);
    this.setMaze = this.setMaze.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
  }

  registerGrid(grid) {
    this.grid = grid;
  }

  onVisualize() {
    this.grid.onVisualize();
  }

  onReset() {
    this.grid.onReset();
  }

  onPause() {
    this.grid.onPause();
  }

  setSpeed(speed) {
    this.grid.setSpeed(speed);
  }

  setAlgorithm(algorithm) {
    this.grid.setAlgorithm(algorithm);
  }

  setMaze(maze) {
    this.grid.setMaze(maze);
  }

  componentDidMount() {}

  render() {
    return (
      <MDBContainer fluid className="cloudy-knoxville-gradient">
        <Navbar></Navbar>
        <Toolbar
          onVisualize={this.onVisualize}
          onReset={this.onReset}
          onPause={this.onPause}
          setAlgorithm={this.setAlgorithm}
          setMaze={this.setMaze}
          setSpeed={this.setSpeed}
        ></Toolbar>
        <Grid registerGrid={this.registerGrid}></Grid>
        <Footer></Footer>
      </MDBContainer>
    );
  }
}
