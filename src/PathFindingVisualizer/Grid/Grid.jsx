import reactDom from "react-dom";
import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import "../PathFindingVisualizer.css";
import Node from "../Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
    };
    this.nodes = [];
    this.grid = [];
    this.rows = 20;
    this.cols = 50;
    this.speed = 15;
    this.startNode = { row: 10, col: 15 };
    this.finishNode = { row: 10, col: 35 };
    this.algorithms = [];
    this.selectedAlgoritm = "Dijkstra";
    this.props.registerGrid(this);
    this.registerNode = this.registerNode.bind(this);
    this.isMousePressed = false;
  }

  //Init
  componentDidMount() {
    this.nodes = [];
    for (let row = 0; row < this.rows; row++) {
      const currentRow = [];
      for (let col = 0; col < this.cols; col++) {
        const currentNode = [];
        currentRow.push(currentNode);
      }
      this.nodes.push(currentRow);
    }
    this.initGrid();
  }

  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === this.startNode.row && col === this.startNode.col,
      isFinish: row === this.finishNode.row && col === this.finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  initGrid() {
    const nodes = [];
    for (let row = 0; row < this.rows; row++) {
      const currentRow = [];
      for (let col = 0; col < this.cols; col++) {
        const currentNode = this.createNode(row, col);
        currentRow.push(currentNode);
      }
      nodes.push(currentRow);
    }
    this.grid = nodes;
    this.setState({ grid: nodes });
  }

  //setters
  registerNode(row, col, node) {
    this.nodes[row][col] = node;
  }

  setIsVisited(node) {
    return () => this.nodes[node.row][node.col].setIsVisited(true);
  }

  setIsIncludedInPath(node) {
    return () => this.nodes[node.row][node.col].setIsIncludedInPath(true);
  }

  setSpeed(speed) {
    this.speed = speed == 1 ? 100 : speed == 2 ? 20 : speed == 3 ? 15 : 10;
  }

  setAlgorithm(algorithm) {
    console.log(algorithm);
  }

  setMaze(maze) {
    console.log(maze);
  }

  /*sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }*/

  //listeners
  onReset = () => {
    let r = 0,
      c = 0;
    for (const row of this.nodes) {
      c = 0;
      for (const node of row) {
        node.reset();
        this.grid[r][c].isWall = false;
        c++;
      }
      r++;
    }
    this.setState({
      grid: this.grid,
    });
  };

  onPause() {
    console.log("Pause clicked");
  }

  //Mouse listeners
  handleMouseDown(row, col) {
    this.isMousePressed = true;
    if (this.grid[row][col].isWall) {
      this.grid[row][col].isWall = false;
      this.nodes[row][col].setIsWall(false);
    } else {
      this.grid[row][col].isWall = true;
      this.nodes[row][col].setIsWall(true);
    }
    //this.setState({ grid: this.grid });
  }

  handleMouseEnter(row, col) {
    if (this.isMousePressed) {
      this.grid[row][col].isWall = true;
      this.nodes[row][col].setIsWall(true);
    }
  }

  handleMouseUp() {
    this.isMousePressed = false;
  }

  onVisualize() {
    if (this.selectedAlgoritm === "Dijkstra") {
      this.visualizeDijkstra();
    }
  }

  visualizeDijkstra() {
    const grid = this.grid;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    for (const row of this.grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
      }
    }
    for (const row of this.nodes) {
      for (const node of row) {
        if (!node.getIsWall()) node.setIsVisited(false);
      }
    }
    const visitedNodesInOrder = dijkstra(this.grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    let k = 1;
    for (const node of visitedNodesInOrder) {
      setTimeout(this.setIsVisited(node), this.speed * k++);
    }
    for (const node of nodesInShortestPathOrder) {
      setTimeout(this.setIsIncludedInPath(node), this.speed * k++);
    }
  }

  render() {
    const { grid } = this.state;
    console.log("Render chala");
    return (
      <MDBRow>
        <MDBCol size="12">
          <div
            onMouseMoveCapture={() => {
              console.log("Kalu");
            }}
            className="border border-info z-depth-2"
            style={{ backgroundColor: "white" }}
          >
            {grid.map((row, rowIndex) => {
              return (
                <div style={{ display: "flex" }} key={rowIndex}>
                  {row.map((node, nodeIndex) => {
                    const { row, col, isWall, isStart, isFinish } = node;
                    return (
                      <Node
                        row={row}
                        col={col}
                        key={nodeIndex}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        test={"foo"}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)} //alterative to binding
                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)} //alternative to binding
                        onMouseUp={() => this.handleMouseUp()}
                        registerNode={this.registerNode}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </MDBCol>
      </MDBRow>
    );
  }
}
