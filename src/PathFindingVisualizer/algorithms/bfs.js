export default function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [];
  queue.push(startNode);
  var i = 0;
  while (queue.length > 0) {
    i++;
    let currentNode = queue.shift();
    if (currentNode.isWall) continue;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    pushNeighboursToQueue(currentNode, grid, queue);
  }
}

function pushNeighboursToQueue(node, grid, queue) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.previousNode = node;
    neighbour.isConsidered = true;
    queue.push(neighbour);
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  return neighbours.filter((neighbour) => !neighbour.isVisited && !neighbour.isConsidered);
}
