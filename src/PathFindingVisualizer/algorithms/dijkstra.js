export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = [];
  for (const row of grid) {
    for (const node of row) {
      unvisitedNodes.push(node);
    }
  }
  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    let closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbours(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours(node, grid) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.previousNode = node;
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  console.log("Before filter : ", neighbours);
  console.log(
    "After filter : ",
    neighbours.filter((neighbour) => !neighbour.isVisited)
  );
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}

export function getNodesInShortestPathOrder(finishNode) {
  const shortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return shortestPath;
}
