export default function drawMemberPointLoad(memberNum, offset, load, globalNodeObject, globalMemberObject) {
  const startJoint = globalMemberObject[memberNum].joints[0];
  const endJoint = globalMemberObject[memberNum].joints[1];
  const xDist = globalNodeObject[endJoint][0][0] - globalNodeObject[startJoint][0][0];
  const yDist = globalNodeObject[endJoint][0][1] - globalNodeObject[startJoint][0][1];
  const windowXDist = globalNodeObject[endJoint][1][0] - globalNodeObject[startJoint][1][0];
  const windowYDist = globalNodeObject[endJoint][1][1] - globalNodeObject[startJoint][1][1];
  const memberLength = Math.sqrt(xDist **2 + yDist **2);
  const loadOffsetRatio = offset / memberLength;
  const relLoadPositionX = windowXDist * loadOffsetRatio;
  const relLoadPositionY = windowYDist * loadOffsetRatio;
  const arrowPointX = globalNodeObject[startJoint][1][0] + relLoadPositionX;
  const arrowPointY = globalNodeObject[startJoint][1][1] + relLoadPositionY;

  const point = `${arrowPointX} ${arrowPointY}`;
  const base1 = load < 0 ? `${arrowPointX + 3.5} ${arrowPointY - 10}`: `${arrowPointX + 3.5} ${arrowPointY + 10}`;
  const base2 = load < 0 ? `${arrowPointX - 3.5} ${arrowPointY - 10}`: `${arrowPointX - 3.5} ${arrowPointY + 10}`;
  const rotateAngle = load < 0 ? globalMemberObject[memberNum].forceAngle * -1 : 360 - globalMemberObject[memberNum].forceAngle;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
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
}
