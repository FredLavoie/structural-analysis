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
submitForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const validForm = await validateFormClientSide();

  if (validForm === false) {
    return;
  }

  // add global objects to sessions storage
  sessionStorage.setItem('globalNodeObject', JSON.stringify(globalNodeObject));
  sessionStorage.setItem('globalMemberObject', JSON.stringify(globalMemberObject));

  const data = new URLSearchParams();
  for (const pair of new FormData(submitForm)) {
    data.append(pair[0], pair[1]);
  }

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

function validateFormClientSide() {
  const NumJoints = document.querySelector('#input-numJoints');
  const NumMembers = document.querySelector('#input-numMembers');
  const NumEMs = document.querySelector('#input-numEMs');
  const NumAreas = document.querySelector('#input-numAreas');
  const NumMoI = document.querySelector('#input-numMOIs');
  const allJointsClasses = document.querySelectorAll('.joint');
  const allMembersClasses = document.querySelectorAll('.member');
  const allSupportsClasses = document.querySelectorAll('.supports');
  const allNumPropClasses = document.querySelectorAll('.num-prop');
  const allJLJ = document.querySelectorAll('.jl-j');
  const allJLX = document.querySelectorAll('.jl-x');
  const allJLY = document.querySelectorAll('.jl-y');
  const allJLL = document.querySelectorAll('.jl-l');
  const allMLM = document.querySelectorAll('.ml-m');
  const allMLXD = document.querySelectorAll('.ml-xd');
  const allMLPL = document.querySelectorAll('.ml-pl');
  const allMLUDL = document.querySelectorAll('.ml-udl');
  let errorBool = true;

  NumJoints.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control';
    }
  });

  NumMembers.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control';
    }
  });

  NumEMs.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control';
    }
  });

  NumAreas.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control';
    }
  });

  NumMoI.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control';
    }
  });

  allJointsClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control joint error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint';
    }
  });

  allMembersClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control member error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member';
    }
  });

  allSupportsClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value)) || Number(ea.value) > 1) {
      ea.className = 'input-style form-control supports error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control supports';
    }
  });

  allNumPropClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control num-prop error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control num-prop';
    }
  });

  allJLJ.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control joint-loads jl-j error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-j';
    }
  });

  allJLX.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control joint-loads jl-x error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-x';
    }
  });

  allJLY.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control joint-loads jl-y error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-y';
    }
  });

  allJLL.forEach((ea) => {
    if (ea.value === '') {
      ea.className = 'input-style form-control joint-loads jl-l error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-l';
    }
  });

  allMLM.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control member-loads ml-m error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads ml-m';
    }
  });

  allMLXD.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control member-loads ml-xd error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mlxd';
    }
  });

  allMLPL.forEach((ea) => {
    if (ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control member-loads ml-pl error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mlpl';
    }
  });

  allMLUDL.forEach((ea) => {
    if (ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control member-loads ml-udl error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mludl';
    }
  });

  return errorBool;
}
