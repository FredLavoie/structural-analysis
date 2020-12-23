export function drawSupportR(jointNum, nodes, window) {
  if (!nodes[jointNum][1][0] || !nodes[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector(window);
  const support = document.createElementNS(ns, 'rect');
  support.setAttributeNS(null, 'id','support');
  support.setAttributeNS(null, 'stroke', 'green');
  support.setAttributeNS(null, 'stroke-width', '1');
  support.setAttributeNS(null, 'fill', 'none');
  support.setAttributeNS(null, 'height', '14');
  support.setAttributeNS(null, 'width', '14');
  support.setAttributeNS(null, 'x', `${nodes[jointNum][1][0] - 7}`);
  support.setAttributeNS(null, 'y',`${nodes[jointNum][1][1] + 5}`);
  box.append(support);

  const circle = document.createElementNS(ns, 'circle');
  circle.setAttributeNS(null, 'id','support');
  circle.setAttributeNS(null, 'stroke', 'green');
  circle.setAttributeNS(null, 'stroke-width', '1');
  circle.setAttributeNS(null, 'fill', 'none');
  circle.setAttributeNS(null, 'r', '6');
  circle.setAttributeNS(null, 'cx', `${nodes[jointNum][1][0]}`);
  circle.setAttributeNS(null, 'cy',`${nodes[jointNum][1][1] + 12}`);
  box.append(circle);
}
