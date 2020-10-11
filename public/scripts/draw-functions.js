export function drawNode(jointNum, point) {
  if(isNaN(point[0]) || isNaN(point[1])) return;
  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const node = document.createElementNS(ns, 'circle');
  node.setAttributeNS(null, 'id','joint');
  node.setAttributeNS(null, 'r', '5');
  node.setAttributeNS(null, 'cx', `${point[0]}`);
  node.setAttributeNS(null, 'cy',`${point[1]}`);
  box.append(node);

  const text = document.createElementNS(ns, 'text');
  text.setAttributeNS(null, 'id','joint-tag');
  text.setAttribute('x', `${point[0] - 15}`);
  text.setAttribute('y', `${point[1] - 15}`);
  text.setAttribute('height', '5');
  text.setAttribute('width', '5');
  text.textContent = `${jointNum}`;
  box.append(text);
}

export function drawMember(num, start, end, globalNodeObject) {
  if(!(start in globalNodeObject) || !(end in globalNodeObject)) return;

  if(start !== 0 && end !== 0) {
    const ns = 'http://www.w3.org/2000/svg';
    const box = document.querySelector('#structure-window');
    const member = document.createElementNS(ns, 'line');
    member.setAttributeNS(null, 'id','member');
    member.setAttributeNS(null, 'x1', `${globalNodeObject[start][1][0]}`);
    member.setAttributeNS(null, 'y1',`${globalNodeObject[start][1][1]}`);
    member.setAttributeNS(null, 'x2', `${globalNodeObject[end][1][0]}`);
    member.setAttributeNS(null, 'y2',`${globalNodeObject[end][1][1]}`);
    member.setAttribute('stroke', 'black');
    member.setAttribute('stroke-width', '3');
    box.append(member);

    let midX = (globalNodeObject[start][1][0] + globalNodeObject[end][1][0]) / 2;
    let midY = (globalNodeObject[start][1][1] + globalNodeObject[end][1][1]) / 2;

    const text = document.createElementNS(ns, 'text');
    text.setAttributeNS(null, 'id','member-tag');
    text.setAttribute('x', `${midX - 15}`);
    text.setAttribute('y', `${midY - 15}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${num}`;
    box.append(text);
  }
}

export function drawXYRSupport(jointNum, globalNodeObject, globalMemberObject) { // fixed support
  if(!globalNodeObject[jointNum][1][0] ||
    !globalNodeObject[jointNum][1][1] ||
    globalNodeObject[jointNum][1][0] === 0 ||
    globalNodeObject[jointNum][1][1] === 0
  ) return;

  let angle = -1;
  for(const ea in globalMemberObject) {
    if(globalMemberObject[ea].joints[0] === jointNum || globalMemberObject[ea].joints[1] === jointNum) {
      const deltaX = globalMemberObject[ea].end[0] - globalMemberObject[ea].start[0];
      const deltaY = globalMemberObject[ea].end[1] - globalMemberObject[ea].start[1];
      const orientation = Math.abs(deltaX) > Math.abs(deltaY) ? 'horz' : 'vert';

      if(orientation === 'horz' &&
      globalMemberObject[ea].joints[0] === jointNum &&
      globalMemberObject[ea].start[0] < globalMemberObject[ea].end[0]) {
        angle = 0;
      } else if(orientation === 'horz' &&
      globalMemberObject[ea].joints[1] === jointNum &&
      globalMemberObject[ea].end[0] > globalMemberObject[ea].start[0]) {
        angle = 180;
      } else if(orientation === 'horz' &&
      globalMemberObject[ea].joints[0] === jointNum &&
      globalMemberObject[ea].start[0] > globalMemberObject[ea].end[0]) {
        angle = 180;
      } else if(orientation === 'horz' &&
      globalMemberObject[ea].joints[1] === jointNum &&
      globalMemberObject[ea].end[0] < globalMemberObject[ea].start[0]) {
        angle = 0;
      } else if(orientation === 'vert' &&
      globalMemberObject[ea].joints[0] === jointNum &&
      globalMemberObject[ea].end[1] < globalMemberObject[ea].start[1]) {
        angle = 270;
      } else if(orientation === 'vert' &&
      globalMemberObject[ea].joints[1] === jointNum &&
      globalMemberObject[ea].end[1] > globalMemberObject[ea].start[1]) {
        angle = 90;
      } else if(orientation === 'vert' &&
      globalMemberObject[ea].joints[0] === jointNum &&
      globalMemberObject[ea].end[1] > globalMemberObject[ea].start[1]) {
        angle = 90;
      } else if(orientation === 'vert' &&
      globalMemberObject[ea].joints[1] === jointNum &&
      globalMemberObject[ea].end[1] < globalMemberObject[ea].start[1]) {
        angle = 270;
      } else {
        return;
      }
    }
  }

  const xCoord = globalNodeObject[jointNum][1][0];
  const yCoord = globalNodeObject[jointNum][1][1];
  const lineStartX = xCoord - 5;
  const lineStartY = yCoord - 12;
  const lineEndX = xCoord - 5;
  const lineEndY = yCoord + 12;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
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

  for(let i = 1; i <= 5; i++) {
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

export function drawXYSupport(jointNum, globalNodeObject) { // pin support
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const xCoord = globalNodeObject[jointNum][1][0];
  const yCoord = globalNodeObject[jointNum][1][1];
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

  for(let i = 1; i <= 5; i++) {
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

export function drawXRSupport(jointNum, globalNodeObject) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

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

  const xLine = document.createElementNS(ns, 'line');
  xLine.setAttributeNS(null, 'id','support');
  xLine.setAttributeNS(null, 'stroke', 'green');
  xLine.setAttributeNS(null, 'stroke-width', '1');
  xLine.setAttributeNS(null, 'x1', `${globalNodeObject[jointNum][1][0] + 7}`);
  xLine.setAttributeNS(null, 'y1',`${globalNodeObject[jointNum][1][1] + 12}`);
  xLine.setAttributeNS(null, 'x2', `${globalNodeObject[jointNum][1][0] - 7}`);
  xLine.setAttributeNS(null, 'y2',`${globalNodeObject[jointNum][1][1] + 12}`);
  box.append(xLine);
}

export function drawYRSupport(jointNum, globalNodeObject) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

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

export function drawXSupport(jointNum, globalNodeObject) {  // X - roller support
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const xCoord = globalNodeObject[jointNum][1][0];
  const yCoord = globalNodeObject[jointNum][1][1];
  const lineStartX = xCoord - 15;
  const lineStartY = yCoord - 12;
  const lineEndX = xCoord - 15;
  const lineEndY = yCoord + 12;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttributeNS(null, 'id','support');
  circle.setAttributeNS(null, 'stroke', 'green');
  circle.setAttributeNS(null, 'stroke-width', '2');
  circle.setAttributeNS(null, 'fill', 'none');
  circle.setAttributeNS(null, 'r', '5');
  circle.setAttributeNS(null, 'cx', `${globalNodeObject[jointNum][1][0] - 9}`);
  circle.setAttributeNS(null, 'cy',`${globalNodeObject[jointNum][1][1]}`);
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

  for(let i = 1; i <= 5; i++) {
    const offset = ((24/ 5) * i) - 2;
    const lSX = `${lineStartX}`;
    const lSY = `${lineStartY + offset}`;
    const lEX = `${lineStartX - 3}`;
    const lEY = `${lineStartY  + offset - 3}`;

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

export function drawYSupport(jointNum, globalNodeObject) { // Y - roller support
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

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

  for(let i = 1; i <= 5; i++) {
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

export function drawRSupport(jointNum, globalNodeObject) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

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
}

export function drawXJointLoad(jointNum, load, globalNodeObject) {
  if(!globalNodeObject[jointNum]) return;

  let headX = globalNodeObject[jointNum][1][0];
  let headY = globalNodeObject[jointNum][1][1];
  let tailX = load > 0 ? headX - 50 : headX + 50;
  let tailY = headY;

  let base1 = load > 0 ? `${headX - 10} ${headY - 3.5}` : `${headX + 10} ${headY - 3.5}`;
  let base2 = load > 0 ? `${headX - 10} ${headY + 3.5}` : `${headX + 10} ${headY + 3.5}`;
  let point = `${headX} ${headY}`;
  let offset = load > 0 ? -5 : 5;

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

export function drawYJointLoad(jointNum, load, globalNodeObject) {
  if(!globalNodeObject[jointNum]) return;

  let headX = globalNodeObject[jointNum][1][0];
  let headY = globalNodeObject[jointNum][1][1];
  let tailX = headX;
  let tailY = load < 0 ? headY - 50 : headY + 50;

  let base1 = load < 0 ? `${headX - 3.5} ${headY - 10}` : `${headX - 3.5} ${headY + 10}`;
  let base2 = load < 0 ? `${headX + 3.5} ${headY - 10}` : `${headX + 3.5} ${headY + 10}`;
  let point = `${headX} ${headY}`;
  let offset = load > 0 ? 5 : -5;

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  arrow.setAttributeNS(null, 'transform', `translate(0 ${offset})`);
  box.append(arrow);

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','joint-load');
  line.setAttributeNS(null, 'stroke', 'red');
  line.setAttributeNS(null, 'stroke-width', '2');
  line.setAttributeNS(null, 'x1', `${headX}`);
  line.setAttributeNS(null, 'y1',`${headY}`);
  line.setAttributeNS(null, 'x2', `${tailX}`);
  line.setAttributeNS(null, 'y2',`${tailY}`);
  line.setAttributeNS(null, 'transform', `translate(0 ${offset})`);
  box.append(line);
}

export function drawMJointLoad(jointNum, moment, globalNodeObject) {
  if(!globalNodeObject[jointNum]) return;

  let cx = globalNodeObject[jointNum][1][0] - 15;
  let cy = globalNodeObject[jointNum][1][1] + 15;
  let base1 = `${globalNodeObject[jointNum][1][0] + 12} ${globalNodeObject[jointNum][1][1] - 12}`;
  let base2 = `${globalNodeObject[jointNum][1][0] + 18} ${globalNodeObject[jointNum][1][1] - 18}`;
  let point = '';
  let path = '';

  if(moment < 0) {
    path += `M ${cx},${cy} a 1 1 0 0 1 30 -30`;
    point += `${globalNodeObject[jointNum][1][0] + 22} ${globalNodeObject[jointNum][1][1] - 8}`;
  } else if(moment > 0) {
    path += `M ${cx},${cy} a 1 1 0 0 0 30 -30`;
    point += `${globalNodeObject[jointNum][1][0] + 8} ${globalNodeObject[jointNum][1][1] - 22}`;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#structure-window');
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  box.append(arrow);

  const arc = document.createElementNS(ns, 'path');
  arc.setAttributeNS(null,'id', 'joint-load');
  arc.setAttributeNS(null, 'stroke', 'red');
  arc.setAttributeNS(null, 'fill', 'none');
  arc.setAttributeNS(null, 'stroke-width', '2');
  arc.setAttributeNS(null, 'd', path);
  box.append(arc);
}

export function drawMemberPointLoad(memberNum, offset, load, globalNodeObject, globalMemberObject) {
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

export function drawMemberUDLLoad(memberNum, udl, globalNodeObject, globalMemberObject) {
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

  for(let i = 0; i < 8; i++) {
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
