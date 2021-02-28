export function drawMemberPointLoad(memberNum, offset, load, nodes, members, window) {
  const startJoint = members[memberNum].joints[0];
  const endJoint = members[memberNum].joints[1];
  const xDist = nodes[endJoint][0][0] - nodes[startJoint][0][0];
  const yDist = nodes[endJoint][0][1] - nodes[startJoint][0][1];
  const windowXDist = nodes[endJoint][1][0] - nodes[startJoint][1][0];
  const windowYDist = nodes[endJoint][1][1] - nodes[startJoint][1][1];
  const memberLength = Math.sqrt(xDist **2 + yDist **2);
  const loadOffsetRatio = offset / memberLength;
  const relLoadPositionX = windowXDist * loadOffsetRatio;
  const relLoadPositionY = windowYDist * loadOffsetRatio;
  const arrowPointX = nodes[startJoint][1][0] + relLoadPositionX;
  const arrowPointY = nodes[startJoint][1][1] + relLoadPositionY;

  const point = `${arrowPointX} ${arrowPointY}`;
  const base1 = load < 0 ? `${arrowPointX + 3.5} ${arrowPointY - 10}`: `${arrowPointX + 3.5} ${arrowPointY + 10}`;
  const base2 = load < 0 ? `${arrowPointX - 3.5} ${arrowPointY - 10}`: `${arrowPointX - 3.5} ${arrowPointY + 10}`;
  const rotateAngle = load < 0 ? members[memberNum].forceAngle * -1 : 360 - members[memberNum].forceAngle;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector(window);
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','member-load');
  arrow.setAttributeNS(null, 'stroke', '#0000ff');
  arrow.setAttributeNS(null, 'fill', '#0000ff');
  arrow.setAttributeNS(null, 'points', `${point}, ${base1}, ${base2}`);
  arrow.setAttributeNS(null, 'transform', `rotate(${rotateAngle} ${arrowPointX} ${arrowPointY})`);
  box.append(arrow);

  const headX = arrowPointX;
  const headY = arrowPointY;
  const tailX = headX;
  const tailY = load < 0 ? headY - 50 : headY + 50;
  const textOffset = load > 0 ? +2 : -1;

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','member-load');
  line.setAttributeNS(null, 'stroke', '#0000ff');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${headX}`);
  line.setAttributeNS(null, 'y1',`${headY}`);
  line.setAttributeNS(null, 'x2', `${tailX}`);
  line.setAttributeNS(null, 'y2',`${tailY}`);
  line.setAttributeNS(null, 'transform', `rotate(${rotateAngle} ${arrowPointX} ${arrowPointY})`);
  box.append(line);

  const text = document.createElementNS(ns, 'text');
  text.setAttributeNS(null, 'id','member-load');
  text.setAttribute('x', `${tailX - 10}`);
  text.setAttribute('y', `${tailY + (10 * textOffset)}`);
  text.setAttribute('height', '5');
  text.setAttribute('width', '5');
  text.setAttributeNS(null, 'transform', `rotate(${rotateAngle} ${arrowPointX} ${arrowPointY})`);
  text.textContent = `${load}`;
  box.append(text);
}
