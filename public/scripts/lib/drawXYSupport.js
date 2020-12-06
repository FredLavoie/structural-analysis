export function drawXYSupport(jointNum, nodes) { // pin support
  if (!nodes[jointNum][1][0] || !nodes[jointNum][1][1]) return;

  const xCoord = nodes[jointNum][1][0];
  const yCoord = nodes[jointNum][1][1];
  const point = `${xCoord} ${yCoord + 5}`;
  const base1 = `${xCoord - 8} ${yCoord + 14}`;
  const base2 = `${xCoord + 8} ${yCoord + 14}`;
  const lineStartX = xCoord - 12;
  const lineStartY = yCoord + 14;
  const lineEndX = xCoord + 12;
  const lineEndY = yCoord + 14;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const triangle = document.createElementNS(ns, 'polygon');
  triangle.setAttributeNS(null, 'id','support');
  triangle.setAttributeNS(null, 'stroke', 'green');
  triangle.setAttributeNS(null, 'fill', 'none');
  triangle.setAttributeNS(null, 'stroke-width', '2');
  triangle.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  box.append(triangle);

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
    const lSX = `${lineStartX + offset}`;
    const lSY = `${lineStartY}`;
    const lEX = `${lineStartX + offset - 3}`;
    const lEY = `${lineStartY + 4}`;

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
