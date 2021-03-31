export default function randomObstruction(grid) {
  const walls = [];
  const nodes = [];
  for (const row of grid) for (const node of row) nodes.push(node);
  let i = 0;
  while (i < 1000) {
    walls.push(nodes[i]);
    i = i + Math.floor(Math.random() * 5 + 1);
  }
  return walls;
}
