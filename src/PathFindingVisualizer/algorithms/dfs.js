export default function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [];
  stack.push(startNode);
  while (stack.length > 0) {
    let currentNode = stack.pop();
    if (currentNode.isWall) continue;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    pushNeighboursToStack(currentNode, grid, stack);
  }
  return visitedNodesInOrder;
}

function pushNeighboursToStack(node, grid, stack) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.previousNode = node;
    //neighbour.isConsidered = true;
    stack.push(neighbour);
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (row > 0) neighbours.push(grid[row - 1][col]);
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}
