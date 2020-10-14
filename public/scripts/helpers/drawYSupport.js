export default function drawYSupport(jointNum, globalNodeObject) { // Y - roller support
  if (!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const xCoord = globalNodeObject[jointNum][1][0];
  const yCoord = globalNodeObject[jointNum][1][1];
  const lineStartX = xCoord - 12;
  const lineStartY = yCoord + 15;
  const lineEndX = xCoord + 12;
  const lineEndY = yCoord + 15;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttributeNS(null, 'id','support');
  circle.setAttributeNS(null, 'stroke', 'green');
  circle.setAttributeNS(null, 'stroke-width', '2');
  circle.setAttributeNS(null, 'fill', 'none');
  circle.setAttributeNS(null, 'r', '5');
  circle.setAttributeNS(null, 'cx', `${globalNodeObject[jointNum][1][0]}`);
  circle.setAttributeNS(null, 'cy',`${globalNodeObject[jointNum][1][1] + 9}`);
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
