//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

const globalNodeObject = {};
const globalMemberObject = {};

$(window).on('resize', function() {
  // clear joints and members before drawing update
  $('svg').children('#joint').remove();
  $('svg').children('#joint-tag').remove();
  $('svg').children('#member').remove();
  $('svg').children('#member-tag').remove();
  $('svg').children('#support').remove();
  $('svg').children('#joint-load').remove();

  const windowWidth = $('#structure-window').width();
  const windowHeight = $('#structure-window').height();

  const memberArray = $('.member').map(function() {
    return Number(this.value);
  }).get();

  const jointArray = $('.joint').map(function() {
    return Number(this.value);
  }).get();

  const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

  const SupportsArray = $('.supports').map(function() {
    return Number(this.value);
  }).get();

  generateSupports(SupportsArray);
  generateJoints(jointCoordinates);
  generateMembers(memberArray);
});

$(document).on('change', function() {
  const windowWidth = $('#structure-window').width();
  const windowHeight = $('#structure-window').height();

  $('.joint').on('change', function() {
    // clear joints before drawing updated joints
    $('svg').children('#joint').remove();
    $('svg').children('#joint-tag').remove();
    $('svg').children('#member').remove();
    $('svg').children('#member-tag').remove();
    $('svg').children('#support').remove();
    $('svg').children('#joint-load').remove();

    const jointArray = $('.joint').map(function() {
      return Number(this.value);
    }).get();

    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

    generateJoints(jointCoordinates);
  });

  $('.member').on('change', function() {
    // clear members before drawing updated members
    $('svg').children('#member').remove();
    $('svg').children('#member-tag').remove();

    const memberArray = $('.member').map(function() {
      return Number(this.value);
    }).get();

    generateMembers(memberArray);
  });

  $('.supports').on('change', function() {
    // clear supports before drawing updated members
    $('svg').children('#support').remove();
    const supportsArray = $('.supports').map(function() {
      return Number(this.value);
    }).get();

    generateSupports(supportsArray);
  });

  $('.joint-loads').on('change', function() {
    // clear joint loads before drawing updated members
    $('svg').children('#joint-load').remove();

    const jointLoadArray = $('.joint-loads').map(function() {
      return Number(this.value);
    }).get();

    generateJointLoads(jointLoadArray);
  });
  $('.member-loads').on('change', function() {
    // clear member loads before drawing updated members
    $('svg').children('#member-load').remove();

    const memberLoadArray = $('.member-loads').map(function() {
      return Number(this.value);
    }).get();

    generateMemberLoads(memberLoadArray);
  });
});


//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

function calculateJointCoordinates(arr, width, height) {
  const jointCoordinates = [];
  let xCoords = [];
  let yCoords = [];

  for(let i = 0; i < arr.length; i++){
    if (i % 2 === 0) {
      xCoords.push(arr[i]);
    } else {
      yCoords.push(arr[i]);
    }
  }
  let xMax = Math.max(...xCoords);
  let xMin = Math.min(...xCoords);
  let yMax = Math.max(...yCoords);
  let yMin = Math.min(...yCoords);

  if (xMin < 0) { // translate all x-coordiantes by xMin
    let count = 0;
    for(let i = 0; i < arr.length; i += 2){
      arr.splice(i, 1, xCoords[count] -= xMin );
      count += 1;
    }
  }

  if (yMin < 0) { // translate all y-coordiantes by xMin
    let count = 0;
    for(let i = 1; i <= arr.length; i += 2){
      arr.splice(i, 1, yCoords[count] -= yMin );
      count += 1;
    }
  }

  let xRange = xMax - xMin;
  let yRange = yMax - yMin;
  let xMidRange = xRange / 2;
  let yMidRange = yRange / 2;

  if(xRange > yRange){
    let multiplier = (width * 0.8) / xRange;
    for(let i = 0; i < arr.length; i += 2) {
      let x = (arr[i] * multiplier) + (width * 0.1);
      let y = -((arr[i + 1] - yMidRange) * multiplier) + (height / 2);
      jointCoordinates.push([arr[i], arr[i+1]],[Math.floor(x), Math.floor(y)]);
    }
  } else {
    let multiplier = (height * 0.8) / yRange;
    for(let i = 0; i < arr.length; i += 2) {
      let x = ((arr[i] - xMidRange) * multiplier) + (width / 2);
      let y = (height * 0.9) - (arr[i+1] * multiplier);
      jointCoordinates.push([arr[i], arr[i+1]],[Math.floor(x), Math.floor(y)]);
    }
  }
  return jointCoordinates;
}

function generateJoints(arr) {
  let jointNum = 0;
  for (let i = 0; i < arr.length; i+=2) {
    jointNum += 1;
    drawNode(jointNum, arr[i+1]);
    globalNodeObject[jointNum] = [arr[i], arr[i+1]];
  }
}

function generateMembers(arr) {
  let memberNumber = 0;

  for(let i = 0; i < arr.length; i += 2) {
    memberNumber += 1;
    if(!arr[i] || !arr[i+1]) return;

    drawMember(memberNumber, arr[i], arr[i+1]);

    let start = globalNodeObject[arr[i]][1];
    let end = globalNodeObject[arr[i+1]][1];

    if(start && end) {
      globalMemberObject[memberNumber] = {
        start: start,
        end: end,
        forceAngle: calculateForceAngle(start, end),
      };
    }
  }
}

function generateSupports(arr) {
  let jointNum = 1;
  for(let i = 0; i < arr.length; i += 3) {
    if(arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 1) { // fixed
      drawXYRSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 0) { // pin
      drawXYSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 1) { // x-rest rot-rest
      drawXRSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 0) { // x-rest
      drawXSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 0 && arr[i+2] === 1) { // rot-rest
      drawRSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 0) { // y-rest
      drawYSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 1) { // y-rest rot-rest
      drawYRSupport(jointNum);
    }
    jointNum += 1;
  }
}

function generateJointLoads(arr) {
  for(let i = 0; i < arr.length; i += 4) {
    if(!arr[i] || arr[i] === 0) return;
    if(arr[i] && arr[i+1] !== 0) drawXJointLoad(arr[i], arr[i+1]);
    if(arr[i] && arr[i+2] !== 0) drawYJointLoad(arr[i], arr[i+2]);
    if(arr[i] && arr[i+3] !== 0) drawMJointLoad(arr[i], arr[i+3]);
  }
}

function generateMemberLoads(arr) {
  for(let i = 0; i < arr.length; i += 4) {
    if(!arr[i] || arr[i] === 0) return;
    if(arr[i] && arr[i+1] !== 0 && arr[i+2] !== 0) drawMemberPointLoad(arr[i], arr[i+1], arr[i+2]);
    // if(arr[i] && arr[i+3] !== 0) drawMemberUDLLoad(arr[i], arr[i+3]);
  }
}

function calculateForceAngle(start, end) {
  let xDist = end[0] - start[0];
  let yDist = -(end[1] - start[1]);
  let angle = Math.abs(Math.atan(yDist/xDist) * (180 / Math.PI));
  let forceAngle = 0;

  if(xDist >= 0 && yDist >= 0) { // quadrant 1
    forceAngle = angle + 90;
  } else if(xDist <= 0 && yDist >= 0) { // quadrant 2
    forceAngle = (180 - angle) + 90;
  } else if(xDist <= 0 && yDist <= 0) { // quadrant 3
    forceAngle = (180 + angle) + 90;
  } else if(xDist >= 0 && yDist <= 0) { // quadrant 4
    forceAngle = 90 - angle;
  }
  return Math.round(forceAngle);
}

//************************************* DRAW FUNCTIONS *******************************************/
//************************************************************************************************/

function drawNode(jointNum, point) {
  if(isNaN(point[0]) || isNaN(point[1])) return;
  else {
    const ns = 'http://www.w3.org/2000/svg';
    const box = $('#structure-window');
    const node = document.createElementNS(ns, 'circle');
    node.setAttributeNS(null, 'id','joint');
    node.setAttributeNS(null, 'r', '5');
    node.setAttributeNS(null, 'cx', `${point[0]}`);
    node.setAttributeNS(null, 'cy',`${point[1]}`);
    box.append(node);

    const text = document.createElementNS(ns, 'text');
    text.setAttributeNS(null, 'id','joint-tag');
    text.setAttribute('x', `${point[0] - 10}`);
    text.setAttribute('y', `${point[1] - 10}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${jointNum}`;
    box.append(text);
  }
}

function drawMember(num, start, end) {
  if(!(start in globalNodeObject) || !(end in globalNodeObject)) return;

  if(start !== 0 && end !== 0) {
    const ns = 'http://www.w3.org/2000/svg';
    const box = $('#structure-window');
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
    text.setAttribute('x', `${midX - 10}`);
    text.setAttribute('y', `${midY - 10}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${num}`;
    box.append(text);
  }
}

function drawXYRSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawXYSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

  const xLine = document.createElementNS(ns, 'line');
  xLine.setAttributeNS(null, 'id','support');
  xLine.setAttributeNS(null, 'stroke', 'green');
  xLine.setAttributeNS(null, 'stroke-width', '1');
  xLine.setAttributeNS(null, 'x1', `${globalNodeObject[jointNum][1][0] + 7}`);
  xLine.setAttributeNS(null, 'y1',`${globalNodeObject[jointNum][1][1] + 12}`);
  xLine.setAttributeNS(null, 'x2', `${globalNodeObject[jointNum][1][0] - 7}`);
  xLine.setAttributeNS(null, 'y2',`${globalNodeObject[jointNum][1][1] + 12}`);
  box.append(xLine);

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

function drawXRSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawYRSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawXSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawYSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawRSupport(jointNum) {
  if(!globalNodeObject[jointNum][1][0] || !globalNodeObject[jointNum][1][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
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

function drawXJointLoad(jointNum, load) {
  if(!globalNodeObject[jointNum]) return;

  let headX = globalNodeObject[jointNum][1][0];
  let headY = globalNodeObject[jointNum][1][1];
  let tailX = load > 0 ? headX - 50 : headX + 50;
  let tailY = headY;

  let base1 = load > 0 ? `${headX - 10} ${headY - 3.5}` : `${headX + 10} ${headY - 3.5}`;
  let base2 = load > 0 ? `${headX - 10} ${headY + 3.5}` : `${headX + 10} ${headY + 3.5}`;
  let point = `${headX} ${headY}`;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  box.append(arrow);

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','joint-load');
  line.setAttributeNS(null, 'stroke', 'red');
  line.setAttributeNS(null, 'stroke-width', '1');
  line.setAttributeNS(null, 'x1', `${headX}`);
  line.setAttributeNS(null, 'y1',`${headY}`);
  line.setAttributeNS(null, 'x2', `${tailX}`);
  line.setAttributeNS(null, 'y2',`${tailY}`);
  box.append(line);
}

function drawYJointLoad(jointNum, load) {
  if(!globalNodeObject[jointNum]) return;

  let headX = globalNodeObject[jointNum][1][0];
  let headY = globalNodeObject[jointNum][1][1];
  let tailX = headX;
  let tailY = load < 0 ? headY - 50 : headY + 50;

  let base1 = load < 0 ? `${headX - 3.5} ${headY - 10}` : `${headX - 3.5} ${headY + 10}`;
  let base2 = load < 0 ? `${headX + 3.5} ${headY - 10}` : `${headX + 3.5} ${headY + 10}`;
  let point = `${headX} ${headY}`;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
  const arrow = document.createElementNS(ns, 'polygon');
  arrow.setAttributeNS(null, 'id','joint-load');
  arrow.setAttributeNS(null, 'stroke', 'red');
  arrow.setAttributeNS(null, 'fill', 'red');
  arrow.setAttributeNS(null, 'points', `${base1}, ${point}, ${base2}`);
  box.append(arrow);

  const line = document.createElementNS(ns, 'line');
  line.setAttributeNS(null, 'id','joint-load');
  line.setAttributeNS(null, 'stroke', 'red');
  line.setAttributeNS(null, 'stroke-width', '1');
  line.setAttributeNS(null, 'x1', `${headX}`);
  line.setAttributeNS(null, 'y1',`${headY}`);
  line.setAttributeNS(null, 'x2', `${tailX}`);
  line.setAttributeNS(null, 'y2',`${tailY}`);
  box.append(line);
}

function drawMJointLoad(jointNum, moment) {
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
  const box = $('#structure-window');
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

function drawMemberPointLoad(memberNum, offset, load) {
  // console.log('globalMemberObject: ', globalMemberObject);
  // console.log('globalNodeObject: ', globalNodeObject);
}

// function drawMemberUDLLoad(memberNum, udl) {

// }
