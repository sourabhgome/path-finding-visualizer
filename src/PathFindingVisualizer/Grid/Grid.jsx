import reactDom from "react-dom";
import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import "../PathFindingVisualizer.css";
import Node from "../Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import dfs from "../algorithms/dfs";
import bfs from "../algorithms/bfs";
import randomObstruction from "../algorithms/randomObstruction";
import randomConnection from "../algorithms/randomConnection";

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
    this.selectedAlgorithm = "Dijkstra";
    this.props.registerGrid(this);
    this.registerNode = this.registerNode.bind(this);
    this.isMousePressed = false;
    this.draggingStart = false;
    this.draggingFinish = false;
    this.timeoutVisitedNodesInOrder = [];
    this.timeoutNodesInShortestPathOrder = [];
    this.timeoutMazeNodes = [];
    this.timeoutVisualization = null;
    this.visitedNodesInOrderCurrentIndex = 0;
    this.nodesInShortestPathOrderCurrentIndex = 0;
    this.mazeNodesCurrentIndex = 0;
    this.visitedNodesInOrder = [];
    this.nodesInShortestPathOrder = [];
    this.mazeNodes = [];
    this.isVisualizing = false;
    this.canDrawMaze = true;
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
      isConsidered: false,
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
    return () => {
      this.visitedNodesInOrderCurrentIndex++;
      this.nodes[node.row][node.col].setIsVisited(true);
    };
  }

  setIsWall(wall) {
    if (
      (wall.row != this.startNode.row || wall.col != this.startNode.col) &&
      (wall.row != this.finishNode.row || wall.col != this.finishNode.col)
    )
      return () => {
        this.grid[wall.row][wall.col].isWall = true;
        this.nodes[wall.row][wall.col].setIsWall(true);
      };
  }

  setIsIncludedInMaze(wall) {
    if (
      (wall.row != this.startNode.row || wall.col != this.startNode.col) &&
      (wall.row != this.finishNode.row || wall.col != this.finishNode.col)
    )
      return () => {
        this.mazeNodesCurrentIndex++;
        this.grid[wall.row][wall.col].isWall = true;
        this.nodes[wall.row][wall.col].setIsWall(true);
      };
  }
  setIsIncludedInPath(node) {
    return () => {
      this.nodesInShortestPathOrderCurrentIndex++;
      this.nodes[node.row][node.col].setIsIncludedInPath(true);
    };
  }

  setSpeed(speed) {
    this.speed = speed == 1 ? 40 : speed == 2 ? 20 : speed == 3 ? 15 : 10;
    if (this.isVisualizing) {
      if (this.timeoutVisitedNodesInOrder.length) {
        for (let timeout of this.timeoutVisitedNodesInOrder) clearTimeout(timeout);
        for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
        clearTimeout(this.timeoutVisualization);
      } else if (this.timeoutNodesInShortestPathOrder.length) {
        for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
        clearTimeout(this.timeoutVisualization);
        this.isVisualizing = false;
      } else if (this.timeoutMazeNodes.length) {
        for (let timeout of this.timeoutMazeNodes) clearTimeout(timeout);
        clearTimeout(this.timeoutVisualization);
        this.isVisualizing = false;
      }
      this.timeoutVisitedNodesInOrder = [];
      this.timeoutNodesInShortestPathOrder = [];
      this.animate(
        this.visitedNodesInOrder,
        this.visitedNodesInOrderCurrentIndex,
        this.nodesInShortestPathOrder,
        this.nodesInShortestPathOrderCurrentIndex
      );
    }
  }

  setAlgorithm(algorithm) {
    this.selectedAlgorithm = algorithm;
    this.setState({ selectedAlgorithm: algorithm });
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
    if (this.timeoutVisitedNodesInOrder.length) {
      for (let timeout of this.timeoutVisitedNodesInOrder) clearTimeout(timeout);
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.isVisualizing = false;
      this.visualizationStopped();
    } else if (this.timeoutNodesInShortestPathOrder.length) {
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.isVisualizing = false;
      this.visualizationStopped();
    }
    this.visitedNodesInOrderCurrentIndex = 0;
    this.nodesInShortestPathOrderCurrentIndex = 0;
    this.timeoutVisitedNodesInOrder = [];
    this.timeoutNodesInShortestPathOrder = [];
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
    if (this.timeoutVisitedNodesInOrder.length) {
      for (let timeout of this.timeoutVisitedNodesInOrder) clearTimeout(timeout);
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.visualizationStopped();
      this.isVisualizing = false;
    } else if (this.timeoutNodesInShortestPathOrder.length) {
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.visualizationStopped();
      this.isVisualizing = false;
    } else if (this.mazeNodes.length) {
      for (let timeout of this.timeoutMazeNodes) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.visualizationStopped();
      this.isVisualizing = false;
    }
    this.timeoutVisitedNodesInOrder = [];
    this.timeoutNodesInShortestPathOrder = [];
    this.timeoutMazeNodes = [];
  }

  onResume() {
    if (this.visitedNodesInOrder.length || this.nodesInShortestPathOrder.length)
      this.animate(
        this.visitedNodesInOrder,
        this.visitedNodesInOrderCurrentIndex,
        this.nodesInShortestPathOrder,
        this.nodesInShortestPathOrderCurrentIndex
      );
    else if (this.mazeNodes.length) {
      this.animateMaze(this.mazeNodes, this.mazeNodesCurrentIndex);
    }
  }

  //Mouse listeners
  handleMouseDown(row, col) {
    if (this.canDrawMaze) {
      this.isMousePressed = true;
      if (row == this.startNode.row && col == this.startNode.col) {
        this.draggingStart = true;
      } else if (row == this.finishNode.row && col == this.finishNode.col) {
        this.draggingFinish = true;
      } else {
        if (this.grid[row][col].isWall) {
          this.grid[row][col].isWall = false;
          this.nodes[row][col].setIsWall(false);
        } else {
          this.grid[row][col].isWall = true;
          this.nodes[row][col].setIsWall(true);
        }
      }
    }
    //this.setState({ grid: this.grid });
  }

  handleMouseEnter(row, col) {
    if (this.isMousePressed) {
      if (this.draggingStart && (row != this.finishNode.row || col != this.finishNode.col)) {
        this.nodes[this.startNode.row][this.startNode.col].setStart(false);
        this.grid[this.startNode.row][this.startNode.col].isStart = false;
        this.startNode.row = row;
        this.startNode.col = col;
        this.nodes[this.startNode.row][this.startNode.col].setStart(true);
        this.grid[this.startNode.row][this.startNode.col].isStart = true;
      } else if (this.draggingFinish && (this.startNode.row != row || this.startNode.col != col)) {
        this.nodes[this.finishNode.row][this.finishNode.col].setFinish(false);
        this.grid[this.finishNode.row][this.finishNode.col].isFinish = false;
        this.finishNode.row = row;
        this.finishNode.col = col;
        this.nodes[this.finishNode.row][this.finishNode.col].setFinish(true);
        this.grid[this.finishNode.row][this.finishNode.col].oisFinish = true;
      } else {
        if (
          (row != this.startNode.row && col != this.startNode.col) ||
          (row != this.finishNode.row && col != this.finishNode.col)
        ) {
          this.grid[row][col].isWall = true;
          this.nodes[row][col].setIsWall(true);
        }
      }
    }
  }

  handleMouseUp() {
    this.isMousePressed = false;
    this.draggingFinish = false;
    this.draggingStart = false;
  }

  visualizationStopped = () => {
    this.canDrawMaze = true;
    this.isVisualizing = false;
    this.props.visualizationStopped();
  };

  onVisualize() {
    this.canDrawMaze = false;
    if (this.timeoutVisitedNodesInOrder.length) {
      for (let timeout of this.timeoutVisitedNodesInOrder) clearTimeout(timeout);
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.visitedNodesInOrderCurrentIndex = 0;
      this.nodesInShortestPathOrderCurrentIndex = 0;
      if (this.isVisualizing) this.visualizationStopped();
      this.isVisualizing = true;
    } else if (this.timeoutNodesInShortestPathOrder.length) {
      for (let timeout of this.timeoutNodesInShortestPathOrder) clearTimeout(timeout);
      clearTimeout(this.timeoutVisualization);
      this.visitedNodesInOrderCurrentIndex = 0;
      this.nodesInShortestPathOrderCurrentIndex = 0;
      if (this.isVisualizing) this.visualizationStopped();
      this.isVisualizing = true;
    }
    const grid = this.grid;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    for (const row of this.grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
        node.isConsidered = false;
        node.previousNode = null;
      }
    }
    for (const row of this.nodes) {
      for (const node of row) {
        if (!node.getIsWall()) node.setIsVisited(false);
      }
    }
    if (this.selectedAlgorithm === "Dijkstra") {
      this.visualizeDijkstra();
    } else if (this.selectedAlgorithm === "DFS") {
      this.visualizeDFS();
    } else if (this.selectedAlgorithm === "BFS") {
      this.visualizeBFS();
    }
  }

  visualizeDijkstra() {
    const grid = this.grid;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = dijkstra(this.grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.visitedNodesInOrder = visitedNodesInOrder;
    this.nodesInShortestPathOrder = nodesInShortestPathOrder;
    this.visitedNodesInOrderCurrentIndex = 0;
    this.nodesInShortestPathOrderCurrentIndex = 0;
    this.animate(visitedNodesInOrder, 0, nodesInShortestPathOrder, 0);
  }

  visualizeDFS() {
    const grid = this.grid;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = dfs(this.grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.visitedNodesInOrder = visitedNodesInOrder;
    this.nodesInShortestPathOrder = nodesInShortestPathOrder;
    this.visitedNodesInOrderCurrentIndex = 0;
    this.nodesInShortestPathOrderCurrentIndex = 0;
    this.animate(visitedNodesInOrder, 0, nodesInShortestPathOrder, 0);
  }

  visualizeBFS() {
    const grid = this.grid;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = bfs(this.grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.visitedNodesInOrder = visitedNodesInOrder;
    this.nodesInShortestPathOrder = nodesInShortestPathOrder;
    this.visitedNodesInOrderCurrentIndex = 0;
    this.nodesInShortestPathOrderCurrentIndex = 0;
    this.animate(visitedNodesInOrder, 0, nodesInShortestPathOrder, 0);
  }

  animate(
    visitedNodesInOrder,
    visitedNodesInOrderIndex,
    nodesInShortestPathOrder,
    nodesInShortestPathOrderIndex
  ) {
    let k = 1;
    this.timeoutVisitedNodesInOrder = [];
    this.timeoutNodesInShortestPathOrder = [];
    this.timeoutVisualization = null;
    for (let i = visitedNodesInOrderIndex; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      this.timeoutVisitedNodesInOrder.push(setTimeout(this.setIsVisited(node), this.speed * k++));
    }
    for (let i = nodesInShortestPathOrderIndex; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      this.timeoutNodesInShortestPathOrder.push(setTimeout(this.setIsIncludedInPath(node), this.speed * k++));
    }
    this.timeoutVisualization = setTimeout(this.visualizationStopped, this.speed * k++);
  }

  setMaze(maze) {
    this.isVisualizing = true;
    if (maze === "Random Obstruction") {
      this.mazeNodes = randomObstruction(this.grid);
      this.mazeNodesCurrentIndex = 0;
      this.animateMaze(this.mazeNodes, 0);
    } else if (maze === "Random Connection") {
      this.mazeNodes = randomConnection(this.grid);
      this.mazeNodesCurrentIndex = 0;
      this.animateMaze(this.mazeNodes, 0);
    }
  }

  animateMaze(walls, index) {
    let k = 1;
    for (let i = index; i < walls.length; i++) {
      const wall = walls[i];
      this.timeoutMazeNodes.push(setTimeout(this.setIsIncludedInMaze(wall), this.speed * k++));
    }
    this.timeoutVisualization = setTimeout(this.visualizationStopped, this.speed * k++);
  }

  render() {
    const { grid } = this.state;
    return (
      <MDBRow>
        <MDBCol size="12">
          <div className="border border-info z-depth-2" style={{ backgroundColor: "white" }}>
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
