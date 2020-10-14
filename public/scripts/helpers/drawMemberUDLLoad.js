export default function drawMemberUDLLoad(memberNum, udl, globalNodeObject, globalMemberObject) {
  const startJoint = globalMemberObject[memberNum].joints[0];
  const endJoint = globalMemberObject[memberNum].joints[1];
  const xDist = globalNodeObject[endJoint][0][0] - globalNodeObject[startJoint][0][0];
  const yDist = globalNodeObject[endJoint][0][1] - globalNodeObject[startJoint][0][1];
  const windowXDist = globalNodeObject[endJoint][1][0] - globalNodeObject[startJoint][1][0];
  const windowYDist = globalNodeObject[endJoint][1][1] - globalNodeObject[startJoint][1][1];
  const memberLength = Math.sqrt(xDist **2 + yDist **2);
  const rotateAngle = udl < 0 ? globalMemberObject[memberNum].forceAngle * -1 : 360 - globalMemberObject[memberNum].forceAngle;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');

  for (let i = 0; i < 8; i++) {
    const offset = (memberLength / 7) * i;
    const loadOffsetRatio =  offset / memberLength;
    const relLoadPositionX = windowXDist * loadOffsetRatio;
    const relLoadPositionY = windowYDist * loadOffsetRatio;
    const arrowPointX = globalNodeObject[startJoint][1][0] + relLoadPositionX;
    const arrowPointY = globalNodeObject[startJoint][1][1] + relLoadPositionY;

    const point = `${arrowPointX} ${arrowPointY}`;
    const base1 = udl < 0 ? `${arrowPointX + 3.5} ${arrowPointY - 10}`: `${arrowPointX + 3.5} ${arrowPointY + 10}`;
    const base2 = udl < 0 ? `${arrowPointX - 3.5} ${arrowPointY - 10}`: `${arrowPointX - 3.5} ${arrowPointY + 10}`;

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
    const tailY = udl < 0 ? headY - 35 : headY + 35;

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

  // draw line across tails of arrows
  const opp = 35 * Math.sin(globalMemberObject[memberNum].forceAngle / (180 / Math.PI));
  const adj = 35 * Math.cos(globalMemberObject[memberNum].forceAngle / (180 / Math.PI));
  const crossLineStartX = udl < 0 ? globalNodeObject[startJoint][1][0] - opp : globalNodeObject[startJoint][1][0] + opp;
  const crossLineStartY = udl < 0 ? globalNodeObject[startJoint][1][1] - adj : globalNodeObject[startJoint][1][1] + adj;
  const crossLineEndX = udl < 0 ? globalNodeObject[endJoint][1][0] - opp : globalNodeObject[endJoint][1][0] + opp;
  const crossLineEndY = udl < 0 ? globalNodeObject[endJoint][1][1] - adj : globalNodeObject[endJoint][1][1] + adj;

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','member-load');
  line.setAttributeNS(null, 'stroke', '#0000ff');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${crossLineStartX}`);
  line.setAttributeNS(null, 'y1',`${crossLineStartY}`);
  line.setAttributeNS(null, 'x2', `${crossLineEndX}`);
  line.setAttributeNS(null, 'y2',`${crossLineEndY}`);
  box.append(line);
}
