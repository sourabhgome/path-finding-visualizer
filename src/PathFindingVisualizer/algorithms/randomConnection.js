export default function randomConnection(grid) {
  const walls = [];
  const nodes = [];
  for (const row of grid) for (const node of row) nodes.push(node);
  let i = 0;
  let j = 0;
  while (i < 20) {
    j = 0;
    while (j < 50) {
      walls.push(grid[i][j]);
      grid[i][j].isWall = true;
      j += 2;
    }
    i += 2;
  }
  i = 0;
  while (i < 1000) {
    let j = parseInt(i / 50);
    let k = i % 50;
    console.log(j, k);
    if (j > 0 && j < 19 && k > 0 && k < 49) {
      if (grid[j - 1][k].isWall || grid[j][k - 1].isWall || grid[j + 1][k].isWall || grid[j][k + 1].isWall)
        walls.push(nodes[i]);
    }
    i = i + Math.floor(Math.random() * 4 + 1);
  }
  return walls;
}
