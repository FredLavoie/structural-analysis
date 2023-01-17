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
import { validateForm } from "./lib/validate-form-client.js";

//************************************************ DOCUMENT READY ****************************************************/
//********************************************************************************************************************/

// instantiate the globabl objects that hold the structure and loads data
const globalNodeObject = {};
const globalMemberObject = {};
const globalLoadObject = { nodeLoads: [], memberLoads: [] };

// add event listener to the resizing of the window to redraw
// the entire structure if the window is resized
window.addEventListener("resize", () => {
    redrawAllData();
});

// add event listeners for any form data changes and redraw the entire
// structure if changes are detected
document.addEventListener("change", () => {
    const allJointsClasses = document.querySelectorAll(".joint");
    allJointsClasses.forEach((ea) => {
        ea.addEventListener("change", () => {
            redrawAllData();
        });
    });

    const allMembersClasses = document.querySelectorAll(".member");
    allMembersClasses.forEach((ea) => {
        ea.addEventListener("change", () => {
            redrawAllData();
        });
    });

    const allSupportsClasses = document.querySelectorAll(".supports");
    allSupportsClasses.forEach((ea) => {
        ea.addEventListener("change", () => {
            redrawAllData();
        });
    });

    const allJointLoadsClasses = document.querySelectorAll(".joint-loads");
    allJointLoadsClasses.forEach((ea) => {
        ea.addEventListener("change", () => {
            redrawAllData();
        });
    });

    const allMemberLoadsClasses = document.querySelectorAll(".member-loads");
    allMemberLoadsClasses.forEach((ea) => {
        ea.addEventListener("change", () => {
            redrawAllData();
        });
    });
});

const submitForm = document.querySelector("#input-form");
submitForm.addEventListener("submit", async (event) => {
    // pause form submission
    event.preventDefault();

    const validForm = await validateForm();
    if (!validForm) return;

    // add all load input to global load object
    populateGlobalLoadsObjects();

    // add global objects to sessions storage
    sessionStorage.setItem("globalNodeObject", JSON.stringify(globalNodeObject));
    sessionStorage.setItem("globalMemberObject", JSON.stringify(globalMemberObject));
    sessionStorage.setItem("globalLoadObject", JSON.stringify(globalLoadObject));

    // submit form
    submitForm.submit();
});

//************************************************** FUNCTIONS *******************************************************/
//********************************************************************************************************************/
function redrawAllData() {
    // clear all svg nodes before redrawing
    document.querySelectorAll("svg>#joint").forEach((n) => n.remove());
    document.querySelectorAll("svg>#joint-tag").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member-tag").forEach((n) => n.remove());
    document.querySelectorAll("svg>#support").forEach((n) => n.remove());
    document.querySelectorAll("svg>#joint-load").forEach((n) => n.remove());
    document.querySelectorAll("svg>#member-load").forEach((n) => n.remove());

    const windowWidth = document.querySelector("#structure-window").clientWidth;
    const windowHeight = document.querySelector("#structure-window").clientHeight;

    const memberArray = [...document.querySelectorAll(".member")].map((e) => Number(e.value));
    const jointArray = [...document.querySelectorAll(".joint")].map((e) => Number(e.value));
    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);
    const supportsArray = [...document.querySelectorAll(".supports")].map((e) => Number(e.value));
    const jointLoadArray = [...document.querySelectorAll(".joint-loads")].map((e) => Number(e.value));
    const memberLoadArray = [...document.querySelectorAll(".member-loads")].map((e) => Number(e.value));

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
        drawJoint(jointNum, arr[i + 1], "#structure-window");
        globalNodeObject[jointNum] = [arr[i], arr[i + 1]];
    }
}

function generateMembers(arr) {
    let memberNumber = 0;

    for (let i = 0; i < arr.length; i += 2) {
        memberNumber += 1;
        if (!arr[i] || !arr[i + 1]) return;

        drawMember(memberNumber, arr[i], arr[i + 1], globalNodeObject, "#structure-window");

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
        globalNodeObject[jointNum].push([arr[i], arr[i + 1], arr[i + 2]]);

        if (arr[i] === 1 && arr[i + 1] === 1 && arr[i + 2] === 1) {
            drawSupportXYR(jointNum, globalNodeObject, globalMemberObject, "#structure-window"); // fixed support
        } else if (arr[i] === 1 && arr[i + 1] === 1 && arr[i + 2] === 0) {
            drawSupportXY(jointNum, globalNodeObject, "#structure-window"); // pin support
        } else if (arr[i] === 1 && arr[i + 1] === 0 && arr[i + 2] === 1) {
            drawSupportXR(jointNum, globalNodeObject, "#structure-window"); // x-rest rot-rest
        } else if (arr[i] === 1 && arr[i + 1] === 0 && arr[i + 2] === 0) {
            drawSupportX(jointNum, globalNodeObject, "#structure-window"); // x-rest > roller support
        } else if (arr[i] === 0 && arr[i + 1] === 0 && arr[i + 2] === 1) {
            drawSupportR(jointNum, globalNodeObject, "#structure-window"); // rot-rest
        } else if (arr[i] === 0 && arr[i + 1] === 1 && arr[i + 2] === 0) {
            drawSupportY(jointNum, globalNodeObject, "#structure-window"); // y-rest > roller support
        } else if (arr[i] === 0 && arr[i + 1] === 1 && arr[i + 2] === 1) {
            drawSupportYR(jointNum, globalNodeObject, "#structure-window"); // y-rest rot-rest
        }
        jointNum += 1;
    }
}

function generateJointLoads(arr) {
    for (let i = 0; i < arr.length; i += 4) {
        if (!arr[i] || arr[i] === 0) return;
        if (arr[i] && arr[i + 1] !== 0) drawJointLoadX(arr[i], arr[i + 1], globalNodeObject, "#structure-window");
        if (arr[i] && arr[i + 2] !== 0) drawJointLoadY(arr[i], arr[i + 2], globalNodeObject, "#structure-window");
        if (arr[i] && arr[i + 3] !== 0) drawJointLoadM(arr[i], arr[i + 3], globalNodeObject, "#structure-window");
    }
}

function generateMemberLoads(arr) {
    for (let i = 0; i < arr.length; i += 4) {
        if (!arr[i] || arr[i] === 0) return;
        if (arr[i] && arr[i + 1] !== 0 && arr[i + 2] !== 0) {
            drawMemberPointLoad(
                arr[i],
                arr[i + 1],
                arr[i + 2],
                globalNodeObject,
                globalMemberObject,
                "#structure-window",
            );
        }
        if (arr[i] && arr[i + 3] !== 0) {
            drawMemberUDLLoad(arr[i], arr[i + 3], globalNodeObject, globalMemberObject, "#structure-window");
        }
    }
}

function populateGlobalLoadsObjects() {
    const jointLoadArray = [...document.querySelectorAll(".joint-loads")].map((e) => Number(e.value));
    const memberLoadArray = [...document.querySelectorAll(".member-loads")].map((e) => Number(e.value));

    for (let i = 0; i < jointLoadArray.length; i += 4) {
        globalLoadObject.nodeLoads.push(
            jointLoadArray[i],
            jointLoadArray[i + 1],
            jointLoadArray[i + 2],
            jointLoadArray[i + 3],
        );
    }
    for (let i = 0; i < memberLoadArray.length; i += 4) {
        globalLoadObject.memberLoads.push(
            memberLoadArray[i],
            memberLoadArray[i + 1],
            memberLoadArray[i + 2],
            memberLoadArray[i + 3],
        );
    }
}
