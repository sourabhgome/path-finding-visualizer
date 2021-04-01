export default function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristicDistance = 0;
  const unvisitedNodes = [];
  for (const row of grid) {
    for (const node of row) {
      unvisitedNodes.push(node);
    }
  }
  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    let closestNode = unvisitedNodes.shift();
    console.log(closestNode);
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbours(closestNode, grid, finishNode);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance);
  //nodeA.distance + nodeA.heuristicDistance - (nodeB.distance + nodeB.heuristicDistance)
}

function updateUnvisitedNeighbours(node, grid, finishNode) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.heuristicDistance = getManhattanDistance(
      neighbour.row,
      neighbour.col,
      finishNode.row,
      finishNode.col
    );
    neighbour.previousNode = node;
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  /*if (row > 0) neighbours.push(grid[row - 1][col]);
      if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
      if (col > 0) neighbours.push(grid[row][col - 1]);
      if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);*/
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (row > 0) neighbours.push(grid[row - 1][col]);
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}

function getManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getDiagonalDistance(x1, y1, x2, y2) {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

function getEuclideanDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
