import { calculateJointCoordinates } from './lib/calculateJointCoordinates.js';
import { calculateForceAngle } from './lib/calculateForceAngle.js';
import { drawNode } from './lib/drawNode.js';
import { drawMember } from './lib/drawMember.js';
import { drawXYRSupport } from './lib/drawXYRSupport.js';
import { drawXYSupport } from './lib/drawXYSupport.js';
import { drawXRSupport } from './lib/drawXRSupport.js';
import { drawYRSupport } from './lib/drawYRSupport.js';
import { drawXSupport } from './lib/drawXSupport.js';
import { drawYSupport } from './lib/drawYSupport.js';
import { drawRSupport } from './lib/drawRSupport.js';
import { drawXJointLoad } from './lib/drawXJointLoad.js';
import { drawYJointLoad } from './lib/drawYJointLoad.js';
import { drawMJointLoad } from './lib/drawMJointLoad.js';
import { drawMemberPointLoad } from './lib/drawMemberPointLoad.js';
import { drawMemberUDLLoad } from './lib/drawMemberUDLLoad.js';

//************************************************ DOCUMENT READY ****************************************************/
//********************************************************************************************************************/

const globalNodeObject = {};
const globalMemberObject = {};

window.addEventListener('resize', () => {
  redrawAllData();
});

document.addEventListener('change', () => {
  const allJointsClasses = document.querySelectorAll('.joint');
  allJointsClasses.forEach((ea) => {
    ea.addEventListener('change', () => {
      redrawAllData();
    });
  });

  const allMembersClasses = document.querySelectorAll('.member');
  allMembersClasses.forEach((ea) => {
    ea.addEventListener('change', () => {
      redrawAllData();
    });
  });

  const allSupportsClasses = document.querySelectorAll('.supports');
  allSupportsClasses.forEach((ea) => {
    ea.addEventListener('change', () => {
      redrawAllData();
    });
  });

  const allJointLoadsClasses = document.querySelectorAll('.joint-loads');
  allJointLoadsClasses.forEach((ea) => {
    ea.addEventListener('change', () => {
      redrawAllData();
    });
  });

  const allMemberLoadsClasses = document.querySelectorAll('.member-loads');
  allMemberLoadsClasses.forEach((ea) => {
    ea.addEventListener('change', () => {
      redrawAllData();
    });
  });
});

const submitForm = document.querySelector('#input-form');
submitForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // const validForm = validateInput(data);
  // if (!validForm) {
  //   // show failure flag on front end
  //   return;
  // }

  sessionStorage.setItem('globalNodeObject', JSON.stringify(globalNodeObject));
  sessionStorage.setItem('globalMemberObject', JSON.stringify(globalMemberObject));

  const data = new URLSearchParams();
  for (const pair of new FormData(submitForm)) {
    data.append(pair[0], pair[1]);
  }

  // submit the form
  fetch('/results', {
    method: 'POST',
    body: data
  }).then((res) => res.json())
    .then((data) => {
      switch (data.message) {
      case 'Success':
        window.location.href = '/results';
        break;
      case 'Wrong Input':
        window.location.href = '/';
        break;
      case 'Error: write file':
        window.location.href = '/error-write';
        break;
      case 'Error: executing program':
        window.location.href = '/error-exec';
        break;
      default:
        return;
      }
    });
});

//************************************************** FUNCTIONS *******************************************************/
//********************************************************************************************************************/
function redrawAllData() {
  // clear all svg nodes before redrawing
  document.querySelectorAll('svg>#joint').forEach((n) => n.remove());
  document.querySelectorAll('svg>#joint-tag').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member-tag').forEach((n) => n.remove());
  document.querySelectorAll('svg>#support').forEach((n) => n.remove());
  document.querySelectorAll('svg>#joint-load').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member-load').forEach((n) => n.remove());

  const windowWidth = document.querySelector('#structure-window').clientWidth;
  const windowHeight = document.querySelector('#structure-window').clientHeight;

  const memberArray = [...document.querySelectorAll('.member')].map((e) => Number(e.value));
  const jointArray = [...document.querySelectorAll('.joint')].map((e) => Number(e.value));
  const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);
  const supportsArray = [...document.querySelectorAll('.supports')].map((e) => Number(e.value));
  const jointLoadArray = [...document.querySelectorAll('.joint-loads')].map((e) => Number(e.value));
  const memberLoadArray = [...document.querySelectorAll('.member-loads')].map((e) => Number(e.value));

  generateJoints(jointCoordinates);
  generateMembers(memberArray);
  generateSupports(supportsArray);
  generateJointLoads(jointLoadArray);
  generateMemberLoads(memberLoadArray);
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

  for (let i = 0; i < arr.length; i += 2) {
    memberNumber += 1;
    if (!arr[i] || !arr[i+1]) return;

    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject);

    const start = globalNodeObject[arr[i]][1];
    const end = globalNodeObject[arr[i+1]][1];

    if (start && end) {
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
  for (let i = 0; i < arr.length; i += 3) {
    if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 1) {
      drawXYRSupport(jointNum, globalNodeObject, globalMemberObject); // fixed support
    } else if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawXYSupport(jointNum, globalNodeObject);                      // pin support
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawXRSupport(jointNum, globalNodeObject);                      // x-rest rot-rest
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 0) {
      drawXSupport(jointNum, globalNodeObject);                      // x-rest > roller support
    } else if (arr[i] === 0 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawRSupport(jointNum, globalNodeObject);                      // rot-rest
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawYSupport(jointNum, globalNodeObject);                      // y-rest > roller support
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 1) {
      drawYRSupport(jointNum, globalNodeObject);                     // y-rest rot-rest
    }
    jointNum += 1;
  }
}

function generateJointLoads(arr) {
  for (let i = 0; i < arr.length; i += 4) {
    if (!arr[i] || arr[i] === 0) return;
    if (arr[i] && arr[i+1] !== 0) drawXJointLoad(arr[i], arr[i+1], globalNodeObject);
    if (arr[i] && arr[i+2] !== 0) drawYJointLoad(arr[i], arr[i+2], globalNodeObject);
    if (arr[i] && arr[i+3] !== 0) drawMJointLoad(arr[i], arr[i+3], globalNodeObject);
  }
}

function generateMemberLoads(arr) {
  for (let i = 0; i < arr.length; i += 4) {
    if (!arr[i] || arr[i] === 0) return;
    if (arr[i] && arr[i+1] !== 0 && arr[i+2] !== 0) {
      drawMemberPointLoad(arr[i], arr[i+1], arr[i+2], globalNodeObject, globalMemberObject);
    }
    if (arr[i] && arr[i+3] !== 0) {
      drawMemberUDLLoad(arr[i], arr[i+3], globalNodeObject, globalMemberObject);
    }
  }
}
