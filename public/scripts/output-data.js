import { calculateJointCoordinates } from './lib/calculateJointCoordinates.js';
import { calculateForceAngle } from './lib/calculateForceAngle.js';
import { drawJoint } from './lib/drawJoint.js';
import { drawMember } from './lib/drawMember.js';
import { drawSupportXYR } from './lib/drawSupportXYR.js';
import { drawSupportXY } from './lib/drawSupportXY.js';
import { drawSupportXR } from './lib/drawSupportXR.js';
import { drawSupportYR } from './lib/drawSupportYR.js';
import { drawSupportX } from './lib/drawSupportX.js';
import { drawSupportY } from './lib/drawSupportY.js';
import { drawSupportR } from './lib/drawSupportR.js';
import { drawJointLoadX } from './lib/drawJointLoadX.js';
import { drawJointLoadY } from './lib/drawJointLoadY.js';
import { drawJointLoadM } from './lib/drawJointLoadM.js';
import { drawMemberPointLoad } from './lib/drawMemberPointLoad.js';
import { drawMemberUDLLoad } from './lib/drawMemberUDLLoad.js';
import { drawReactionX } from './lib/drawReactionX.js';
import { drawReactionY } from './lib/drawReactionY.js';
import { drawReactionM } from './lib/drawReactionM.js';

// get global objects from sessions storage
const globalNodeObject = JSON.parse(sessionStorage.getItem('globalNodeObject'));
const globalMemberObject = JSON.parse(sessionStorage.getItem('globalMemberObject'));
const globalLoadObject = JSON.parse(sessionStorage.getItem('globalLoadObject'));
let globalResultsObject = {};

console.log('globalNodeObject: ', globalNodeObject);
console.log('globalMemberObject: ', globalMemberObject);

//************************************************ DOCUMENT READY ****************************************************/
//********************************************************************************************************************/

window.addEventListener('load', async () => {
  await fetchResultsJSON()
    .catch((err) => {
      console.log('fetch error: ', err);
    });

  redrawAllSVGElements();
});

window.addEventListener('resize', () => {
  redrawAllSVGElements();
});

//************************************************** FUNCTIONS *******************************************************/
//********************************************************************************************************************/

async function fetchResultsJSON() {
  const res = await fetch('/results-json');
  const obj = await res.json();
  globalResultsObject = obj;
  console.log('globalResultsObject: ', globalResultsObject);
}

function redrawAllSVGElements() {
  // clear all svg nodes before redrawing
  document.querySelectorAll('svg>#joint').forEach((n) => n.remove());
  document.querySelectorAll('svg>#joint-tag').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member-tag').forEach((n) => n.remove());
  document.querySelectorAll('svg>#support').forEach((n) => n.remove());
  document.querySelectorAll('svg>#joint-load').forEach((n) => n.remove());
  document.querySelectorAll('svg>#member-load').forEach((n) => n.remove());

  const windowWidth = document.querySelector('#input-diagram').clientWidth;
  const windowHeight = document.querySelector('#input-diagram').clientHeight;

  const jointArray = [];
  for (const node in globalNodeObject) {
    jointArray.push(globalNodeObject[node][0][0]);
    jointArray.push(globalNodeObject[node][0][1]);
  }
  const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

  const memberArray = [];
  for (const node in globalMemberObject) {
    memberArray.push(globalMemberObject[node].joints[0]);
    memberArray.push(globalMemberObject[node].joints[1]);
  }

  const supportsArray = [];
  for (const node in globalNodeObject) {
    supportsArray.push(globalNodeObject[node][2][0]);
    supportsArray.push(globalNodeObject[node][2][1]);
    supportsArray.push(globalNodeObject[node][2][2]);
  }

  const jointLoadArray = globalLoadObject.nodeLoads;
  const memberLoadArray = globalLoadObject.memberLoads;

  const memberForces = {};
  for (let i = 1; i <= (memberArray.length / 2); i++) {
    memberForces[i] = globalResultsObject.secondaryUnknowns[0][i-1];
  }
  console.log('memberForces:', memberForces);

  const reactions = {};
  for (let i = (memberArray.length / 2); i < globalResultsObject.secondaryUnknowns[0].length; i++) {
    const nodeNumber = globalResultsObject.secondaryUnknowns[0][i][0];
    const secondaryUnknows = globalResultsObject.secondaryUnknowns[0];
    reactions[nodeNumber] = [secondaryUnknows[i][1], secondaryUnknows[i][2], secondaryUnknows[i][3]];
  }
  console.log('reactions:', reactions);

  generateJoints(jointCoordinates);
  generateMembers(memberArray);
  generateSupports(supportsArray);
  generateJointLoads(jointLoadArray);
  generateMemberLoads(memberLoadArray);
  generateReactions(reactions);
}

function generateJoints(arr) {
  let jointNum = 0;
  for (let i = 0; i < arr.length; i += 2) {
    jointNum += 1;
    drawJoint(jointNum, arr[i+1], '#input-diagram');
    drawJoint(jointNum, arr[i+1], '#internal-forces-diagram');
    drawJoint(jointNum, arr[i+1], '#displacements-diagram');
    drawJoint(jointNum, arr[i+1], '#reactions-diagram');
    globalNodeObject[jointNum] = [arr[i], arr[i+1]];
  }
}

function generateMembers(arr) {
  let memberNumber = 0;

  for (let i = 0; i < arr.length; i += 2) {
    memberNumber += 1;
    if (!arr[i] || !arr[i+1]) return;

    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject, '#input-diagram');
    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject, '#internal-forces-diagram');
    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject, '#displacements-diagram');
    drawMember(memberNumber, arr[i], arr[i+1], globalNodeObject, '#reactions-diagram');

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
      drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, '#input-diagram');
      drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, '#internal-forces-diagram');
      drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, '#displacements-diagram');
      drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, '#reactions-diagram');
    } else if (arr[i] === 1 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawSupportXY(jointNum, globalNodeObject, '#input-diagram');
      drawSupportXY(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportXY(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportXY(jointNum, globalNodeObject, '#reactions-diagram');
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawSupportXR(jointNum, globalNodeObject, '#input-diagram');
      drawSupportXR(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportXR(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportXR(jointNum, globalNodeObject, '#reactions-diagram');
    } else if (arr[i] === 1 && arr[i+1] === 0 && arr[i+2] === 0) {
      drawSupportX(jointNum, globalNodeObject, '#input-diagram');
      drawSupportX(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportX(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportX(jointNum, globalNodeObject, '#reactions-diagram');
    } else if (arr[i] === 0 && arr[i+1] === 0 && arr[i+2] === 1) {
      drawSupportR(jointNum, globalNodeObject, '#input-diagram');
      drawSupportR(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportR(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportR(jointNum, globalNodeObject, '#reactions-diagram');
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 0) {
      drawSupportY(jointNum, globalNodeObject, '#input-diagram');
      drawSupportY(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportY(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportY(jointNum, globalNodeObject, '#reactions-diagram');
    } else if (arr[i] === 0 && arr[i+1] === 1 && arr[i+2] === 1) {
      drawSupportYR(jointNum, globalNodeObject, '#input-diagram');
      drawSupportYR(jointNum, globalNodeObject, '#internal-forces-diagram');
      drawSupportYR(jointNum, globalNodeObject, '#displacements-diagram');
      drawSupportYR(jointNum, globalNodeObject, '#reactions-diagram');
    }
    jointNum += 1;
  }
}

function generateJointLoads(arr) {
  for (let i = 0; i < arr.length; i += 4) {
    if (arr[i] && arr[i+1] !== 0) drawJointLoadX(arr[i], arr[i+1], globalNodeObject, '#input-diagram');
    if (arr[i] && arr[i+2] !== 0) drawJointLoadY(arr[i], arr[i+2], globalNodeObject, '#input-diagram');
    if (arr[i] && arr[i+3] !== 0) drawJointLoadM(arr[i], arr[i+3], globalNodeObject, '#input-diagram');
  }
}

function generateMemberLoads(arr) {
  for (let i = 0; i < arr.length; i += 4) {
    if (!arr[i] || arr[i] === 0) return;
    if (arr[i] && arr[i+1] !== 0 && arr[i+2] !== 0) {
      drawMemberPointLoad(arr[i], arr[i+1], arr[i+2], globalNodeObject, globalMemberObject, '#input-diagram');
    }
    if (arr[i] && arr[i+3] !== 0) {
      drawMemberUDLLoad(arr[i], arr[i+3], globalNodeObject, globalMemberObject, '#input-diagram');
    }
  }
}

function generateReactions(obj) {
  for (const node in obj) {
    drawReactionX(node, obj[node]);
    drawReactionY(node, obj[node]);
    drawReactionM(node, obj[node]);
  }
}
