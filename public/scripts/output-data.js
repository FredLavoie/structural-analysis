import { calculateJointCoordinates } from "./lib/calculate-joint-coordinates.js";
import { calculateForceAngle } from "./lib/calculate-force-angle.js";
import { drawJoint } from "./lib/draw-joint.js";
import { drawMember } from "./lib/draw-member.js";
import { drawSupportXYR } from "./lib/draw-support-XYR.js";
import { drawSupportXY } from "./lib/draw-support-XY.js";
import { drawSupportXR } from "./lib/draw-support-XR.js";
import { drawSupportYR } from "./lib/draw-support-YR.js";
import { drawSupportX } from "./lib/draw-support-X.js";
import { drawSupportY } from "./lib/draw-support-Y.js";
import { drawSupportR } from "./lib/draw-support-R.js";
import { drawJointLoadX } from "./lib/draw-joint-load-X.js";
import { drawJointLoadY } from "./lib/draw-joint-load-Y.js";
import { drawJointLoadM } from "./lib/draw-joint-load-M.js";
import { drawMemberPointLoad } from "./lib/draw-member-point-load.js";
import { drawMemberUDLLoad } from "./lib/draw-member-UDL-load.js";
import { drawReactionX } from "./lib/draw-reaction-X.js";
import { drawReactionY } from "./lib/draw-reaction-Y.js";
import { drawReactionM } from "./lib/draw-reaction-M.js";
import { drawJointDisplacement } from "./lib/draw-joint-displacement.js";

// get global objects from sessions storage
const globalNodeObject = JSON.parse(sessionStorage.getItem("globalNodeObject"));
const globalMemberObject = JSON.parse(sessionStorage.getItem("globalMemberObject"));
const globalLoadObject = JSON.parse(sessionStorage.getItem("globalLoadObject"));
let globalResultsObject = {};

console.log("globalNodeObject: ", globalNodeObject);
console.log("globalMemberObject: ", globalMemberObject);

//************************************************ DOCUMENT READY ****************************************************/
//********************************************************************************************************************/

window.addEventListener("load", async () => {
    await fetchResultsJSON().catch(() => {
        window.location.href = "/error-exec";
    });
    redrawAllSVGElements();
});

window.addEventListener("resize", () => {
    redrawAllSVGElements();
});

async function fetchResultsJSON() {
    const res = await fetch("/results-json");
    if (res.status < 200 || res.status > 300) {
        var error = new Error(res.statusText);
        throw error;
    } else {
        globalResultsObject = await res.json();
        console.log("globalResultsObject: ", globalResultsObject);
    }
}

//*********************************************** REDRAW FUNCTIONS ***************************************************/
//********************************************************************************************************************/

function redrawAllSVGElements() {
    // clear all svg nodes before redrawing
    document.querySelectorAll("svg>#joint").forEach((n) => n.remove());
    document.querySelectorAll("svg>#joint-tag").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member-tag").forEach((n) => n.remove());
    document.querySelectorAll("svg>#support").forEach((n) => n.remove());
    document.querySelectorAll("svg>#joint-load").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member-load").forEach((n) => n.remove());
    document.querySelectorAll("svg>#displaced-joint").forEach((n) => n.remove());
    document.querySelectorAll("svg>#reaction-joint").forEach((n) => n.remove());

    const windowWidth = document.querySelector("#input-diagram").clientWidth;
    const windowHeight = document.querySelector("#input-diagram").clientHeight;

    const jointArray = []; // move to module
    for (const node in globalNodeObject) {
        jointArray.push(globalNodeObject[node][0][0]);
        jointArray.push(globalNodeObject[node][0][1]);
    }
    console.log("jointArray: ", jointArray);
    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);

    const memberArray = []; // move to module
    for (const node in globalMemberObject) {
        memberArray.push(globalMemberObject[node].joints[0]);
        memberArray.push(globalMemberObject[node].joints[1]);
    }

    const supportsArray = []; // move to module
    for (const node in globalNodeObject) {
        supportsArray.push(globalNodeObject[node][2][0]);
        supportsArray.push(globalNodeObject[node][2][1]);
        supportsArray.push(globalNodeObject[node][2][2]);
    }

    const jointLoadArray = globalLoadObject.nodeLoads;
    const memberLoadArray = globalLoadObject.memberLoads;

    const memberForces = {}; // move to module
    for (let i = 1; i <= memberArray.length / 2; i++) {
        memberForces[i] = globalResultsObject.secondaryUnknowns[i - 1];
    }
    console.log("memberForces:", memberForces);

    const reactions = {}; // move to module
    for (let i = memberArray.length / 2; i < globalResultsObject.secondaryUnknowns.length; i++) {
        const nodeNumber = globalResultsObject.secondaryUnknowns[i][0];
        const secondaryUnknows = globalResultsObject.secondaryUnknowns;
        reactions[nodeNumber] = [
            secondaryUnknows[i][1].toPrecision(3),
            secondaryUnknows[i][2].toPrecision(3),
            secondaryUnknows[i][3].toPrecision(3),
        ];
    }
    console.log("reactions:", reactions);

    generateJoints(jointCoordinates);
    generateMembers(memberArray);
    generateSupports(supportsArray);
    generateJointLoads(jointLoadArray);
    generateMemberLoads(memberLoadArray);
    generateReactions(reactions);
    generateDisplacements(jointCoordinates);
}

//********************************************** GENERATE FUNCTIONS **************************************************/
//********************************************************************************************************************/

function generateJoints(arr) {
    let jointNum = 0;
    for (let i = 0; i < arr.length; i += 2) {
        jointNum += 1;
        drawJoint(jointNum, arr[i + 1], "#input-diagram");
        drawJoint(jointNum, arr[i + 1], "#internal-forces-diagram");
        drawJoint(jointNum, arr[i + 1], "#displacements-diagram");
        drawJoint(jointNum, arr[i + 1], "#reactions-diagram");
        globalNodeObject[jointNum] = [arr[i], arr[i + 1]];
    }
}

function generateMembers(arr) {
    let memberNumber = 0;

    for (let i = 0; i < arr.length; i += 2) {
        memberNumber += 1;
        if (!arr[i] || !arr[i + 1]) return;

        drawMember(memberNumber, arr[i], arr[i + 1], globalNodeObject, "#input-diagram");
        drawMember(memberNumber, arr[i], arr[i + 1], globalNodeObject, "#internal-forces-diagram");
        drawMember(memberNumber, arr[i], arr[i + 1], globalNodeObject, "#displacements-diagram");
        drawMember(memberNumber, arr[i], arr[i + 1], globalNodeObject, "#reactions-diagram");

        const start = globalNodeObject[arr[i]][1];
        const end = globalNodeObject[arr[i + 1]][1];

        if (start && end) {
            globalMemberObject[memberNumber] = {
                joints: [arr[i], arr[i + 1]],
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
        if (arr[i] === 1 && arr[i + 1] === 1 && arr[i + 2] === 1) {
            drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, "#input-diagram");
            drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, "#internal-forces-diagram");
            drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, "#displacements-diagram");
            drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, "#reactions-diagram");
        } else if (arr[i] === 1 && arr[i + 1] === 1 && arr[i + 2] === 0) {
            drawSupportXY(jointNum, globalNodeObject, "#input-diagram");
            drawSupportXY(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportXY(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportXY(jointNum, globalNodeObject, "#reactions-diagram");
        } else if (arr[i] === 1 && arr[i + 1] === 0 && arr[i + 2] === 1) {
            drawSupportXR(jointNum, globalNodeObject, "#input-diagram");
            drawSupportXR(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportXR(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportXR(jointNum, globalNodeObject, "#reactions-diagram");
        } else if (arr[i] === 1 && arr[i + 1] === 0 && arr[i + 2] === 0) {
            drawSupportX(jointNum, globalNodeObject, "#input-diagram");
            drawSupportX(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportX(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportX(jointNum, globalNodeObject, "#reactions-diagram");
        } else if (arr[i] === 0 && arr[i + 1] === 0 && arr[i + 2] === 1) {
            drawSupportR(jointNum, globalNodeObject, "#input-diagram");
            drawSupportR(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportR(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportR(jointNum, globalNodeObject, "#reactions-diagram");
        } else if (arr[i] === 0 && arr[i + 1] === 1 && arr[i + 2] === 0) {
            drawSupportY(jointNum, globalNodeObject, "#input-diagram");
            drawSupportY(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportY(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportY(jointNum, globalNodeObject, "#reactions-diagram");
        } else if (arr[i] === 0 && arr[i + 1] === 1 && arr[i + 2] === 1) {
            drawSupportYR(jointNum, globalNodeObject, "#input-diagram");
            drawSupportYR(jointNum, globalNodeObject, "#internal-forces-diagram");
            drawSupportYR(jointNum, globalNodeObject, "#displacements-diagram");
            drawSupportYR(jointNum, globalNodeObject, "#reactions-diagram");
        }
        jointNum += 1;
    }
}

function generateJointLoads(arr) {
    for (let i = 0; i < arr.length; i += 4) {
        if (arr[i] && arr[i + 1] !== 0) drawJointLoadX(arr[i], arr[i + 1], globalNodeObject, "#input-diagram");
        if (arr[i] && arr[i + 2] !== 0) drawJointLoadY(arr[i], arr[i + 2], globalNodeObject, "#input-diagram");
        if (arr[i] && arr[i + 3] !== 0) drawJointLoadM(arr[i], arr[i + 3], globalNodeObject, "#input-diagram");
    }
}

function generateMemberLoads(arr) {
    for (let i = 0; i < arr.length; i += 4) {
        if (!arr[i] || arr[i] === 0) return;
        if (arr[i] && arr[i + 1] !== 0 && arr[i + 2] !== 0) {
            drawMemberPointLoad(arr[i], arr[i + 1], arr[i + 2], globalNodeObject, globalMemberObject, "#input-diagram");
        }
        if (arr[i] && arr[i + 3] !== 0) {
            drawMemberUDLLoad(arr[i], arr[i + 3], globalNodeObject, globalMemberObject, "#input-diagram");
        }
    }
}

function generateReactions(obj) {
    for (const node in obj) {
        if (obj[node][0] > 0.01 || obj[node][0] < -0.01) {
            drawReactionX(node, obj[node][0], globalNodeObject);
        }
        if (obj[node][1] > 0.01 || obj[node][1] < -0.01) {
            drawReactionY(node, obj[node][1], globalNodeObject);
        }
        if (obj[node][2] > 0.01 || obj[node][2] < -0.01) {
            drawReactionM(node, obj[node][2], globalNodeObject);
        }
    }
}

/* 
Move this logic into draw-joint-displacemnet function to draw all nodes and members
*/
function generateDisplacements(jointCoordinates) {
    for (let i = 0; i < jointCoordinates.length; i++) {
        drawJointDisplacement(jointCoordinates[i + 1], globalResultsObject.primaryUnknowns[i]);
        i += 1;
    }
}
