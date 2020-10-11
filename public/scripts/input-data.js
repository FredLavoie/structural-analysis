import {
  drawNode,
  drawMember,
  drawXYRSupport,
  drawXYSupport,
  drawXRSupport,
  drawYRSupport,
  drawXSupport,
  drawYSupport,
  drawRSupport,
  drawXJointLoad,
  drawYJointLoad,
  drawMJointLoad,
  drawMemberPointLoad,
  drawMemberUDLLoad
} from "./draw-functions.js";

//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

const globalNodeObject = {};
const globalMemberObject = {};

window.addEventListener('resize', function() {
  redrawAllData();
});

document.addEventListener('change', function() {
  const allJointsClasses = document.querySelectorAll('.joint');
  allJointsClasses.forEach(ea => {
    ea.addEventListener('change', function() {
      redrawAllData();
    });
  });

  const allMembersClasses = document.querySelectorAll('.member');
  allMembersClasses.forEach(ea => {
    ea.addEventListener('change', function() {
      redrawAllData();
    });
  });

  const allSupportsClasses = document.querySelectorAll('.supports');
  allSupportsClasses.forEach(ea => {
    ea.addEventListener('change', function() {
      redrawAllData();
    });
  });

  const allJointLoadsClasses = document.querySelectorAll('.joint-loads');
  allJointLoadsClasses.forEach(ea => {
    ea.addEventListener('change', function() {
      redrawAllData();
    });
  });

  const allMemberLoadsClasses = document.querySelectorAll('.member-loads');
  allMemberLoadsClasses.forEach(ea => {
    ea.addEventListener('change', function() {
      redrawAllData();
    });
  });
});



//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

function redrawAllData() {
  // clear all svg nodes before redrawing
  document.querySelectorAll('svg>#joint').forEach(n => n.remove());
  document.querySelectorAll('svg>#joint-tag').forEach(n => n.remove());
  document.querySelectorAll('svg>#member').forEach(n => n.remove());
  document.querySelectorAll('svg>#member-tag').forEach(n => n.remove());
  document.querySelectorAll('svg>#support').forEach(n => n.remove());
  document.querySelectorAll('svg>#joint-load').forEach(n => n.remove());
  document.querySelectorAll('svg>#member-load').forEach(n => n.remove());

  const windowWidth = document.querySelector('#structure-window').clientWidth;
  const windowHeight = document.querySelector('#structure-window').clientHeight;

  const memberArray = [...document.querySelectorAll('.member')]
    .map(e => Number(e.value));

  const jointArray = [...document.querySelectorAll('.joint')]
    .map(e => Number(e.value));

  const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

  const supportsArray = [...document.querySelectorAll('.supports')]
    .map(e => Number(e.value));

  const jointLoadArray = [...document.querySelectorAll('.joint-loads')]
    .map(e => Number(e.value));

  const memberLoadArray = [...document.querySelectorAll('.member-loads')]
    .map(e => Number(e.value));

  generateJoints(jointCoordinates);
  generateMembers(memberArray);
  generateSupports(supportsArray);
  generateJointLoads(jointLoadArray);
  generateMemberLoads(memberLoadArray);
}

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

  if (yMin < 0) { // translate all y-coordiantes by yMin
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

    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject);

    let start = globalNodeObject[arr[i]][1];
    let end = globalNodeObject[arr[i+1]][1];

    if(start && end) {
      globalMemberObject[memberNumber] = {
        joints: [arr[i], arr[i+1]],
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
    if(arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 1) {
      drawXYRSupport(jointNum, globalNodeObject); // fixed support
    } else if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawXYSupport(jointNum, globalNodeObject); // pin support
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawXRSupport(jointNum, globalNodeObject); // x-rest rot-rest
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 0) {
      drawXSupport(jointNum, globalNodeObject); // x-rest / roller support
    } else if (arr[i] === 0 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawRSupport(jointNum, globalNodeObject); // rot-rest
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawYSupport(jointNum, globalNodeObject); // y-rest / roller support
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 1) {
      drawYRSupport(jointNum, globalNodeObject); // y-rest rot-rest
    }
    jointNum += 1;
  }
}

function generateJointLoads(arr) {
  for(let i = 0; i < arr.length; i += 4) {
    if(!arr[i] || arr[i] === 0) return;
    if(arr[i] && arr[i+1] !== 0) drawXJointLoad(arr[i], arr[i+1], globalNodeObject);
    if(arr[i] && arr[i+2] !== 0) drawYJointLoad(arr[i], arr[i+2], globalNodeObject);
    if(arr[i] && arr[i+3] !== 0) drawMJointLoad(arr[i], arr[i+3], globalNodeObject);
  }
}

function generateMemberLoads(arr) {
  for(let i = 0; i < arr.length; i += 4) {
    if(!arr[i] || arr[i] === 0) return;
    if(arr[i] && arr[i+1] !== 0 && arr[i+2] !== 0) {
      drawMemberPointLoad(arr[i], arr[i+1], arr[i+2], globalNodeObject, globalMemberObject);
    }
    if(arr[i] && arr[i+3] !== 0) {
      drawMemberUDLLoad(arr[i], arr[i+3], globalNodeObject, globalMemberObject);
    }
  }
}

function calculateForceAngle(start, end) {
  let xDist = end[0] - start[0];
  let yDist = -(end[1] - start[1]);
  let angle = Math.abs(Math.atan(yDist/xDist) * (180 / Math.PI));
  let forceAngle = 0;

  if(xDist >= 0 && yDist >= 0) { // quadrant 1
    forceAngle = angle;
  } else if(xDist <= 0 && yDist >= 0) { // quadrant 2
    forceAngle = 180 - angle;
  } else if(xDist <= 0 && yDist <= 0) { // quadrant 3
    forceAngle = 180 + angle;
  } else if(xDist >= 0 && yDist <= 0) { // quadrant 4
    forceAngle = angle * -1;
  }
  return Math.round(forceAngle);
}
