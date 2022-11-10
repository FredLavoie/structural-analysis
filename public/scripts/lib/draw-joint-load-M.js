export function drawJointLoadM(jointNum, moment, nodes, window) {
  if (!nodes[jointNum]) return;

  const cx = nodes[jointNum][1][0] - 15;
  const cy = nodes[jointNum][1][1] + 15;
  const base1 = `${nodes[jointNum][1][0] + 12} ${nodes[jointNum][1][1] - 12}`;
  const base2 = `${nodes[jointNum][1][0] + 18} ${nodes[jointNum][1][1] - 18}`;
  let point = '';
  let path = '';

  if (moment < 0) {
    path += `M ${cx},${cy} a 1 1 0 0 1 30 -30`;
    point += `${nodes[jointNum][1][0] + 22} ${nodes[jointNum][1][1] - 8}`;
  } else if (moment > 0) {
    path += `M ${cx},${cy} a 1 1 0 0 0 30 -30`;
    point += `${nodes[jointNum][1][0] + 8} ${nodes[jointNum][1][1] - 22}`;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector(window);
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id', 'joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  box.append(arrow);

  const arc = document.createElementNS(ns, 'path');
  arc.setAttributeNS(null, 'id', 'joint-load');
  arc.setAttributeNS(null, 'stroke', 'red');
  arc.setAttributeNS(null, 'fill', 'none');
  arc.setAttributeNS(null, 'stroke-width', '2');
  arc.setAttributeNS(null, 'd', path);
  box.append(arc);

  const text = document.createElementNS(ns, 'text');
  text.setAttributeNS(null, 'id', 'joint-load');
  text.setAttribute('x', `${cx - 25}`);
  text.setAttribute('y', `${cy + 25}`);
  text.setAttribute('height', '5');
  text.setAttribute('width', '5');
  text.textContent = `${moment}`;
  box.append(text);
}
