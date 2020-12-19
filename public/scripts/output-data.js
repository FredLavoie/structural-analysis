import { calculateJointCoordinates } from './lib/calculateJointCoordinates.js';
// import { calculateForceAngle } from './lib/calculateForceAngle.js';
import { drawNode } from './lib/drawNode.js';
// import { drawMember } from './lib/drawMember.js';
// import { drawXYRSupport } from './lib/drawXYRSupport.js';
// import { drawXYSupport } from './lib/drawXYSupport.js';
// import { drawXRSupport } from './lib/drawXRSupport.js';
// import { drawYRSupport } from './lib/drawYRSupport.js';
// import { drawXSupport } from './lib/drawXSupport.js';
// import { drawYSupport } from './lib/drawYSupport.js';
// import { drawRSupport } from './lib/drawRSupport.js';
// import { drawXJointLoad } from './lib/drawXJointLoad.js';
// import { drawYJointLoad } from './lib/drawYJointLoad.js';
// import { drawMJointLoad } from './lib/drawMJointLoad.js';
// import { drawMemberPointLoad } from './lib/drawMemberPointLoad.js';
// import { drawMemberUDLLoad } from './lib/drawMemberUDLLoad.js';

// get global objects from sessions storage
const globalNodeObject = JSON.parse(sessionStorage.getItem('globalNodeObject'));
const globalMemberObject = JSON.parse(sessionStorage.getItem('globalMemberObject'));
let globalResultsObject = {};

console.log('globalNodeObject: ', globalNodeObject);
console.log('globalMemberObject: ', globalMemberObject);

//************************************************ DOCUMENT READY ****************************************************/
//********************************************************************************************************************/

// document.addEventListener('DOMContentLoaded', () => {
window.addEventListener('load', async () => {
  await fetchResultsJSON()
    .catch((err) => {
      console.log('fetch error: ', err);
    });

  redrawAllFrames();
});



window.addEventListener('resize', () => {
  redrawAllFrames();
});

//************************************************** FUNCTIONS *******************************************************/
//********************************************************************************************************************/

async function fetchResultsJSON() {
  const res = await fetch('/results-json');
  const obj = await res.json();
  globalResultsObject = obj;
  console.log('globalResultsObject: ', globalResultsObject);
}

function redrawAllFrames() {
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

  generateJoints(jointCoordinates);
}

function generateJoints(arr) {
  let jointNum = 0;
  for (let i = 0; i < arr.length; i += 2) {
    jointNum += 1;
    drawNode(jointNum, arr[i+1], '#input-diagram');
    drawNode(jointNum, arr[i+1], '#shear-forces-diagram');
    drawNode(jointNum, arr[i+1], '#moment-forces-diagram');
    drawNode(jointNum, arr[i+1], '#displacements-diagram');
    drawNode(jointNum, arr[i+1], '#reactions-diagram');
    globalNodeObject[jointNum] = [arr[i], arr[i+1]];
  }
}