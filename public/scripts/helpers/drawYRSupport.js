export default function drawYRSupport(jointNum, globalNodeObject) {
  if (!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const support = document.createElementNS(ns, 'rect');
  support.setAttributeNS(null, 'id','support');
  support.setAttributeNS(null, 'stroke', 'green');
  support.setAttributeNS(null, 'stroke-width', '1');
  support.setAttributeNS(null, 'fill', 'none');
  support.setAttributeNS(null, 'height', '14');
  support.setAttributeNS(null, 'width', '14');
  support.setAttributeNS(null, 'x', `${globalNodeObject[jointNum][1][0] - 7}`);
  support.setAttributeNS(null, 'y',`${globalNodeObject[jointNum][1][1] + 5}`);
  box.append(support);

  const circle = document.createElementNS(ns, 'circle');
  circle.setAttributeNS(null, 'id','support');
  circle.setAttributeNS(null, 'stroke', 'green');
  circle.setAttributeNS(null, 'stroke-width', '1');
  circle.setAttributeNS(null, 'fill', 'none');
  circle.setAttributeNS(null, 'r', '6');
  circle.setAttributeNS(null, 'cx', `${globalNodeObject[jointNum][1][0]}`);
  circle.setAttributeNS(null, 'cy',`${globalNodeObject[jointNum][1][1] + 12}`);
  box.append(circle);

  const yLine = document.createElementNS(ns, 'line');
  yLine.setAttributeNS(null, 'id','support');
  yLine.setAttributeNS(null, 'stroke', 'green');
  yLine.setAttributeNS(null, 'stroke-width', '1');
  yLine.setAttributeNS(null, 'x1', `${globalNodeObject[jointNum][1][0]}`);
  yLine.setAttributeNS(null, 'y1',`${globalNodeObject[jointNum][1][1] + 5}`);
  yLine.setAttributeNS(null, 'x2', `${globalNodeObject[jointNum][1][0]}`);
  yLine.setAttributeNS(null, 'y2',`${globalNodeObject[jointNum][1][1] + 18}`);
  box.append(yLine);
}
