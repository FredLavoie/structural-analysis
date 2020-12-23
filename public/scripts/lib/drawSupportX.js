export function drawSupportX(jointNum, nodes, window) {  // X - roller support
  if (!nodes[jointNum][1][0] || !nodes[jointNum][1][1]) return;

  const xCoord = nodes[jointNum][1][0];
  const yCoord = nodes[jointNum][1][1];
  const lineStartX = xCoord - 15;
  const lineStartY = yCoord - 12;
  const lineEndX = xCoord - 15;
  const lineEndY = yCoord + 12;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector(window);
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttributeNS(null, 'id','support');
  circle.setAttributeNS(null, 'stroke', 'green');
  circle.setAttributeNS(null, 'stroke-width', '2');
  circle.setAttributeNS(null, 'fill', 'none');
  circle.setAttributeNS(null, 'r', '5');
  circle.setAttributeNS(null, 'cx', `${nodes[jointNum][1][0] - 9}`);
  circle.setAttributeNS(null, 'cy',`${nodes[jointNum][1][1]}`);
  box.append(circle);

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','support');
  line.setAttributeNS(null, 'stroke', 'green');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${lineStartX}`);
  line.setAttributeNS(null, 'y1', `${lineStartY}`);
  line.setAttributeNS(null, 'x2', `${lineEndX}`);
  line.setAttributeNS(null, 'y2', `${lineEndY}`);
  box.append(line);

  for (let i = 1; i <= 5; i++) {
    const offset = ((24/ 5) * i) - 2;
    const lSX = `${lineStartX}`;
    const lSY = `${lineStartY + offset}`;
    const lEX = `${lineStartX - 3}`;
    const lEY = `${lineStartY  + offset - 3}`;

    const dLine = document.createElementNS(ns, 'line');
    dLine.setAttributeNS(null, 'id','support');
    dLine.setAttributeNS(null, 'stroke', 'green');
    dLine.setAttributeNS(null, 'stroke-width', '1');
    dLine.setAttributeNS(null, 'x1', `${lSX}`);
    dLine.setAttributeNS(null, 'y1', `${lSY}`);
    dLine.setAttributeNS(null, 'x2', `${lEX}`);
    dLine.setAttributeNS(null, 'y2', `${lEY}`);
    box.append(dLine);
  }
}
