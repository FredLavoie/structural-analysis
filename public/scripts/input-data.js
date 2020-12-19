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
import { validateForm } from './lib/validateFormClient.js';

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
submitForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const validForm = await validateForm();
  if (validForm === false) {
    return;
  }

  // add global objects to sessions storage
  sessionStorage.setItem('globalNodeObject', JSON.stringify(globalNodeObject));
  sessionStorage.setItem('globalMemberObject', JSON.stringify(globalMemberObject));

  // submit form
  submitForm.submit();
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
  for (let i = 0; i < arr.length; i += 2) {
    jointNum += 1;
    drawNode(jointNum, arr[i+1], '#structure-window');
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
