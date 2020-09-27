//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

const globalNodeObject = {};
const globalMemberObject = {};

$(window).on('resize', function() {
  // clear joints and members before drawing update
  $('svg').children('circle').remove();
  $('svg').children('text').remove();
  $('svg').children('line').remove();
  $('svg').children('#member-tag').remove();
  $('svg').children('#support').remove();

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
    $('svg').children('circle').remove();
    $('svg').children('text').remove();
    $('svg').children('line').remove();

    const jointArray = $('.joint').map(function() {
      return Number(this.value);
    }).get();

    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

    generateJoints(jointCoordinates);
  });

  $('.member').on('change', function() {
    // clear members before drawing updated members
    $('svg').children('line').remove();
    $('svg').children('#member-tag').remove();

    const memberArray = $('.member').map(function() {
      return Number(this.value);
    }).get();

    generateMembers(memberArray);
  });

  $('.supports').on('change', function() {
    $('svg').children('#support').remove();

    const supportsArray = $('.supports').map(function() {
      return Number(this.value);
    }).get();
    console.log('supportsArray: ', supportsArray);
    generateSupports(supportsArray);
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
      jointCoordinates.push([Math.floor(x), Math.floor(y)]);
    }
  } else {
    let multiplier = (height * 0.8) / yRange;
    for(let i = 0; i < arr.length; i += 2) {
      let x = ((arr[i] - xMidRange) * multiplier) + (width / 2);
      let y = (height * 0.9) - (arr[i+1] * multiplier);
      jointCoordinates.push([Math.floor(x), Math.floor(y)]);
    }
  }
  return jointCoordinates;
}

function generateJoints(arr) {
  let jointNum = 0;
  for (const point of arr) {
    jointNum += 1;
    drawNode(jointNum, point);
    globalNodeObject[jointNum] = point;
  }
}

function generateMembers(arr) {
  let memberNumber = 0;

  for(let i = 0; i < arr.length; i += 2) {
    memberNumber += 1;
    drawMember(memberNumber, arr[i], arr[i + 1]);
    
    let start = globalNodeObject[arr[i]];
    let end = globalNodeObject[arr[i + 1]];

    if(start, end) {
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
      drawFixedSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 0) { // pin
      drawPinnedSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 1) { // x-rest rot-rest
      drawXSupport(jointNum);
      drawRotSupport(jointNum);
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 0) { // x-rest
      drawXSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 0 && arr[i+2] === 1) { // rot-rest
      drawRotSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 0) { // y-rest
      drawYSupport(jointNum);
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 1) { // y-rest rot-rest
      drawYSupport(jointNum);
      drawRotSupport(jointNum);
    }
    jointNum += 1;
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
    node.setAttributeNS(null, 'id',`joint${jointNum}`);
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
    member.setAttributeNS(null, 'id',`member${num}`);
    member.setAttributeNS(null, 'x1', `${globalNodeObject[start][0]}`);
    member.setAttributeNS(null, 'y1',`${globalNodeObject[start][1]}`);
    member.setAttributeNS(null, 'x2', `${globalNodeObject[end][0]}`);
    member.setAttributeNS(null, 'y2',`${globalNodeObject[end][1]}`);
    member.setAttribute('stroke', 'black');
    member.setAttribute('stroke-width', '3');
    box.append(member);

    let midX = (globalNodeObject[start][0] + globalNodeObject[end][0]) / 2;
    let midY = (globalNodeObject[start][1] + globalNodeObject[end][1]) / 2;

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

function drawFixedSupport(jointNum) {
  console.log('jointNum: ', jointNum);
  console.log('globalNodeObject: ', globalNodeObject);

  if(!globalNodeObject[jointNum][0] || !globalNodeObject[jointNum][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
  const support = document.createElementNS(ns, 'rect');
  support.setAttributeNS(null, 'id',`support`);
  support.setAttributeNS(null, 'stroke', 'green');
  support.setAttributeNS(null, 'stroke-width', '2');
  support.setAttributeNS(null, 'fill', 'none');
  support.setAttributeNS(null, 'height', '14');
  support.setAttributeNS(null, 'width', '14');
  support.setAttributeNS(null, 'x', `${globalNodeObject[jointNum][0] - 7}`);
  support.setAttributeNS(null, 'y',`${globalNodeObject[jointNum][1] + 5}`);
  box.append(support);
}

function drawPinnedSupport(jointNum) {
  console.log('jointNum: ', jointNum);
  console.log('globalNodeObject: ', globalNodeObject);

  if(!globalNodeObject[jointNum][0] || !globalNodeObject[jointNum][1]) return;

  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
  const support = document.createElementNS(ns, 'circle');
  support.setAttributeNS(null, 'id',`support`);
  support.setAttributeNS(null, 'stroke', 'green');
  support.setAttributeNS(null, 'stroke-width', '2');
  support.setAttributeNS(null, 'fill', 'none');
  support.setAttributeNS(null, 'r', '7');
  support.setAttributeNS(null, 'cx', `${globalNodeObject[jointNum][0]}`);
  support.setAttributeNS(null, 'cy',`${globalNodeObject[jointNum][1] + 12}`);
  box.append(support);
}

function drawXSupport(jointNum) {

}

function drawYSupport(jointNum) {

}

function drawRotSupport(jointNum) {

}
