import React, { Component } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBCol,
  MDBRow,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBRangeInput,
} from "mdbreact";

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithms: ["BFS", "DFS", "Dijkstra", "A*"],
      selectedAlgorithm: "Dijkstra",
      mazes: ["Maze 1", "Maze 2", "Maze 3"],
      selectedMaze: "",
    };
  }

  onAlgorithmSelected = (event) => {
    const value = event.target.innerHTML;
    this.setState({ selectedAlgorithm: value });
    this.props.setAlgorithm(value);
  };

  onMazeSelected = (event) => {
    const value = event.target.innerHTML;
    this.setState({ selectedMaze: value });
    this.props.setMaze(value);
  };

  onSpeedChange = (event) => {
    const value = event.target.value;
    this.props.setSpeed(value);
  };

  onReset = () => {
    console.log("on reset chala");
    this.setState({ selectedMaze: "" });
    this.props.onReset();
  };

  render() {
    const selectedAlgo = this.state.selectedAlgorithm;
    const selectedMaze = this.state.selectedMaze;
    const onAlgorithmSelected = this.onAlgorithmSelected;
    const onMazeSelected = this.onMazeSelected;
    return (
      <MDBRow style={{ marginTop: "10px", marginBottom: "-5px" }}>
        <MDBCol md="2" className="text-center">
          <MDBDropdown>
            <MDBDropdownToggle caret color="primary">
              Algorithm
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              {this.state.algorithms.map(function (name, index) {
                if (selectedAlgo === name)
                  return (
                    <MDBDropdownItem onClick={onAlgorithmSelected} active>
                      {name}
                    </MDBDropdownItem>
                  );
                else return <MDBDropdownItem onClick={onAlgorithmSelected}>{name}</MDBDropdownItem>;
              })}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
        <MDBCol md="2">
          <MDBRow>
            <MDBCol md="12" className="text-center">
              <MDBRow>
                <label htmlFor="speed" className="blue-text"></label>
                <MDBCol md="3" className="text-center">
                  <span className="font-weight-light blue-text mr-4">0.5x</span>
                </MDBCol>
                <MDBCol md="3" className="text-center">
                  <span className="font-weight-light blue-text mr-4">1x</span>
                </MDBCol>
                <MDBCol md="3" className="text-center">
                  <span className="font-weight-light blue-text mr-4">1.5x</span>
                </MDBCol>
                <MDBCol md="3">
                  <span className="font-weight-light blue-text ml-2">2x</span>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol md="12" className="text-center">
              <input
                type="range"
                className="custom-range"
                id="speed"
                min="1"
                max="4"
                defaultValue="2"
                step="1"
                onChange={this.onSpeedChange}
              />
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol md="4" className="text-center">
          <MDBBtnGroup className="mb-4">
            <MDBBtn color="primary" onClick={this.props.onVisualize}>
              Visualize
            </MDBBtn>
            <MDBBtn color="warning" onClick={this.props.onPause}>
              Pause
            </MDBBtn>
            <MDBBtn color="danger" onClick={this.onReset}>
              Reset
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
        <MDBCol md="4" className="text-center">
          <MDBDropdown>
            <MDBDropdownToggle caret color="primary">
              Maze
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              {this.state.mazes.map(function (name, index) {
                if (selectedMaze === name)
                  return (
                    <MDBDropdownItem onClick={onMazeSelected} active>
                      {name}
                    </MDBDropdownItem>
                  );
                else return <MDBDropdownItem onClick={onMazeSelected}>{name}</MDBDropdownItem>;
              })}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
      </MDBRow>
    );
  }
}
