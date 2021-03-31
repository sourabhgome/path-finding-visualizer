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
      algorithms: ["BFS", "DFS", "Dijkstra"],
      selectedAlgorithm: "Dijkstra",
      mazes: ["Random Obstruction", "Random Connection"],
      selectedMaze: "",
      isVisualizing: false,
      isPaused: false,
      isAlgorithmDropdownDisabled: false,
      isMazeDropdownDisabled: false,
      isVisualizeButtonDisabled: false,
      isSpeedbarDisabled: false,
    };
    this.selectedAlgorithm = "Dijkstra";
    this.props.registerToolbar(this);
  }

  componentDidUpdate() {}

  onAlgorithmSelected = (event) => {
    const value = event.target.innerHTML;
    this.props.setAlgorithm(value);
    this.setState({ selectedAlgorithm: value });
  };

  onMazeSelected = (event) => {
    const value = event.target.innerHTML;
    this.props.setMaze(value);
    this.setState({
      selectedMaze: value,
      isVisualizing: true,
      isVisualizeButtonDisabled: true,
      isAlgorithmDropdownDisabled: true,
      isMazeDropdownDisabled: true,
      isSpeedbarDisabled: true,
    });
  };

  onSpeedChange = (event) => {
    const value = event.target.value;
    this.props.setSpeed(value);
  };

  onResume = () => {
    this.props.onResume();
    this.setState({
      isPaused: false,
      isVisualizing: true,
      isVisualizeButtonDisabled: true,
      isAlgorithmDropdownDisabled: true,
      isMazeDropdownDisabled: true,
      isSpeedbarDisabled: true,
    });
  };

  onPause = () => {
    this.props.onPause();
    this.setState({
      isPaused: true,
    });
  };

  onReset = () => {
    this.props.onReset();
    this.setState({
      selectedMaze: "",
      isPaused: false,
      isVisualizing: false,
      isVisualizeButtonDisabled: false,
      isAlgorithmDropdownDisabled: false,
      isMazeDropdownDisabled: false,
      isSpeedbarDisabled: false,
    });
  };

  onVisualize = () => {
    //alert("onVisualize");
    this.props.onVisualize();
    this.setState({
      isVisualizing: true,
      isVisualizeButtonDisabled: true,
      isAlgorithmDropdownDisabled: true,
      isMazeDropdownDisabled: true,
      isSpeedbarDisabled: true,
    });
  };

  setIsVisualizing(isVisualizing) {
    //throw new Error("kuch bhi");
    if (isVisualizing) {
      this.setState({
        isVisualizing: true,
        isVisualizeButtonDisabled: true,
        isAlgorithmDropdownDisabled: true,
        isMazeDropdownDisabled: true,
        isSpeedbarDisabled: true,
      });
    } else {
      this.setState({
        isVisualizing: isVisualizing,
        isVisualizeButtonDisabled: false,
        isAlgorithmDropdownDisabled: false,
        isMazeDropdownDisabled: false,
        isSpeedbarDisabled: false,
      });
    }
  }

  render() {
    const selectedAlgo = this.selectedAlgorithm;
    const selectedMaze = this.state.selectedMaze;
    const onAlgorithmSelected = this.onAlgorithmSelected;
    const onMazeSelected = this.onMazeSelected;
    const state = this.state;
    let controlbutton = null;
    if (!this.state.isVisualizing && !this.state.isPaused) {
      controlbutton = (
        <MDBBtn key="PauseButtonDisabled" color="warning" disabled>
          Pause
        </MDBBtn>
      );
    } else if (this.state.isVisualizing && !this.state.isPaused) {
      controlbutton = (
        <MDBBtn key="PauseButton" color="warning" onClick={this.onPause}>
          Pause
        </MDBBtn>
      );
    } else if (!this.state.isVisualizing && this.state.isPaused) {
      controlbutton = (
        <MDBBtn key="ResumeButton" color="success" onClick={this.onResume}>
          Resume
        </MDBBtn>
      );
    }
    return (
      <MDBRow style={{ marginTop: "10px", marginBottom: "-5px" }}>
        <MDBCol md="3" className="text-center">
          <MDBDropdown>
            <MDBDropdownToggle
              disabled={state.isAlgorithmDropdownDisabled}
              key="AlgorithmDropdown"
              caret
              color="primary"
            >
              Algorithm: {this.state.selectedAlgorithm}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              {this.state.algorithms.map(function (name, index) {
                if (selectedAlgo === name)
                  return (
                    <MDBDropdownItem
                      key={name}
                      onClick={onAlgorithmSelected}
                      disabled={state.isAlgorithmDropdownDisabled}
                      active
                    >
                      {name}
                    </MDBDropdownItem>
                  );
                else
                  return (
                    <MDBDropdownItem
                      key={name}
                      disabled={state.isAlgorithmDropdownDisabled}
                      onClick={onAlgorithmSelected}
                    >
                      {name}
                    </MDBDropdownItem>
                  );
              })}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
        <MDBCol md="2" className="text-center">
          <MDBRow style={{ maxWidth: "220px" }}>
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
            <MDBCol md="12" disabled className="text-center">
              <input
                key="Speedbar"
                type="range"
                //disabled={state.isSpeedbarDisabled}
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
            <MDBBtn
              key="VisualizeButton"
              disabled={state.isVisualizeButtonDisabled}
              color="primary"
              onClick={this.onVisualize}
            >
              Visualize
            </MDBBtn>
            {controlbutton}
            <MDBBtn key="ResetButton" color="danger" onClick={this.onReset}>
              Reset
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
        <MDBCol md="3" className="text-center">
          <MDBDropdown>
            <MDBDropdownToggle
              disabled={state.isMazeDropdownDisabled}
              key="MazeDropdown"
              caret
              color="primary"
            >
              Maze: {this.state.selectedMaze}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
              {this.state.mazes.map(function (name, index) {
                if (selectedMaze === name)
                  return (
                    <MDBDropdownItem
                      key={name}
                      disabled={state.isMazeDropdownDisabled}
                      onClick={onMazeSelected}
                      active
                    >
                      {name}
                    </MDBDropdownItem>
                  );
                else
                  return (
                    <MDBDropdownItem
                      key={name}
                      disabled={state.isMazeDropdownDisabled}
                      onClick={onMazeSelected}
                    >
                      {name}
                    </MDBDropdownItem>
                  );
              })}
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBCol>
      </MDBRow>
    );
  }
}
