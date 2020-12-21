export function drawXYRSupport(jointNum, nodes, members, window) { // fixed support
  const currentJoint = nodes[jointNum];

  if (!currentJoint[1][0] || !currentJoint[1][1] || currentJoint[1][0] === 0 || currentJoint[1][1] === 0) return;

  let angle = -1;
  for (const member in members) {
    const currentMember = members[member];
    if (currentMember.joints[0] === jointNum || currentMember.joints[1] === jointNum) {
      const deltaX = currentMember.end[0] - currentMember.start[0];
      const deltaY = currentMember.end[1] - currentMember.start[1];
      const orientation = Math.abs(deltaX) > Math.abs(deltaY) ? 'horz' : 'vert';

      if (orientation === 'horz' && currentMember.joints[0] === jointNum && currentMember.start[0] < currentMember.end[0]) {
        angle = 0;
      } else if (orientation === 'horz' && currentMember.joints[1] === jointNum && currentMember.end[0] > currentMember.start[0]) {
        angle = 180;
      } else if (orientation === 'horz' && currentMember.joints[0] === jointNum && currentMember.start[0] > currentMember.end[0]) {
        angle = 180;
      } else if (orientation === 'horz' && currentMember.joints[1] === jointNum && currentMember.end[0] < currentMember.start[0]) {
        angle = 0;
      } else if (orientation === 'vert' && currentMember.joints[0] === jointNum && currentMember.end[1] < currentMember.start[1]) {
        angle = 270;
      } else if (orientation === 'vert' && currentMember.joints[1] === jointNum && currentMember.end[1] > currentMember.start[1]) {
        angle = 90;
      } else if (orientation === 'vert' && currentMember.joints[0] === jointNum && currentMember.end[1] > currentMember.start[1]) {
        angle = 90;
      } else if (orientation === 'vert' && currentMember.joints[1] === jointNum && currentMember.end[1] < currentMember.start[1]) {
        angle = 270;
      } else {
        return;
      }
    }
  }

  const xCoord = nodes[jointNum][1][0];
  const yCoord = nodes[jointNum][1][1];
  const lineStartX = xCoord - 5;
  const lineStartY = yCoord - 12;
  const lineEndX = xCoord - 5;
  const lineEndY = yCoord + 12;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector(window);
  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','support');
  line.setAttributeNS(null, 'stroke', 'green');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${lineStartX}`);
  line.setAttributeNS(null, 'y1', `${lineStartY}`);
  line.setAttributeNS(null, 'x2', `${lineEndX}`);
  line.setAttributeNS(null, 'y2', `${lineEndY}`);
  line.setAttributeNS(null, 'transform', `rotate(${angle} ${xCoord} ${yCoord})`);
  box.append(line);

  for (let i = 1; i <= 5; i++) {
    const offset = ((24/ 5) * i) - 2;
    const lSX = `${lineStartX}`;
    const lSY = `${lineStartY + offset}`;
    const lEX = `${lineStartX - 4}`;
    const lEY = `${lineStartY  + offset - 4}`;

    const dLine = document.createElementNS(ns, 'line');
    dLine.setAttributeNS(null, 'id','support');
    dLine.setAttributeNS(null, 'stroke', 'green');
    dLine.setAttributeNS(null, 'stroke-width', '1');
    dLine.setAttributeNS(null, 'x1', `${lSX}`);
    dLine.setAttributeNS(null, 'y1', `${lSY}`);
    dLine.setAttributeNS(null, 'x2', `${lEX}`);
    dLine.setAttributeNS(null, 'y2', `${lEY}`);
    dLine.setAttributeNS(null, 'transform', `rotate(${angle} ${xCoord} ${yCoord})`);
    box.append(dLine);
  }
}
