import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    const { row, col, isFinish, isStart, isWall, isVisited, isIncludedInPath, weight, key } = this.props;
    this.baseClassName = isFinish ? "node-finish" : isStart ? "node-start" : "";
    this.className = this.baseClassName;
    this.state = {
      key: key,
      row: row,
      col: col,
      isFinish: isFinish,
      isStart: isStart,
      isWall: isWall,
      isVisited: false,
      isIncludedInPath: false,
      weight: weight,
    };
    this.props.registerNode(row, col, this);
  }

  setIsVisited(isVisited) {
    if (isVisited) this.className = this.baseClassName + " node-visited";
    else this.className = this.baseClassName;
    this.setState({ isVisited: isVisited });
  }

  setIsWall(isWall) {
    if (isWall) {
      this.className = this.baseClassName + " node-wall";
      this.setState({ isWall: isWall });
    } else {
      this.className = this.baseClassName;
      this.setState({ isWall: isWall });
    }
  }

  getIsWall() {
    return this.state.isWall;
  }

  setIsIncludedInPath(isIncludedInPath) {
    if (isIncludedInPath) this.className = this.baseClassName + " node-shortest-path";
    this.setState({ isIncludedInPath: isIncludedInPath });
  }

  reset() {
    this.className = this.baseClassName;
    this.setState({
      isWall: false,
      isVisited: false,
      isIncludedInPath: false,
    });
  }

  render() {
    const { row, col, isWall, onMouseDown, onMouseEnter, onMouseUp } = this.props;
    if (isWall) {
      this.className = this.baseClassName + " node-wall";
      this.setState({ isWall: isWall });
    }
    return (
      <div
        className={`node ${this.className}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0,
};
