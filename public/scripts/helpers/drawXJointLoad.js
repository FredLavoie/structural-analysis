export default function drawXJointLoad(jointNum, load, globalNodeObject) {
  if (!globalNodeObject[jointNum]) return;

  const headX = globalNodeObject[jointNum][1][0];
  const headY = globalNodeObject[jointNum][1][1];
  const tailX = load > 0 ? headX - 50 : headX + 50;
  const tailY = headY;

  const base1 = load > 0 ? `${headX - 10} ${headY - 3.5}` : `${headX + 10} ${headY - 3.5}`;
  const base2 = load > 0 ? `${headX - 10} ${headY + 3.5}` : `${headX + 10} ${headY + 3.5}`;
  const point = `${headX} ${headY}`;
  const offset = load > 0 ? -5 : 5;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  arrow.setAttributeNS(null, 'transform', `translate(${offset} 0)`);
  box.append(arrow);

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','joint-load');
  line.setAttributeNS(null, 'stroke', 'red');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${headX}`);
  line.setAttributeNS(null, 'y1',`${headY}`);
  line.setAttributeNS(null, 'x2', `${tailX}`);
  line.setAttributeNS(null, 'y2',`${tailY}`);
  line.setAttributeNS(null, 'transform', `translate(${offset} 0)`);
  box.append(line);
}
