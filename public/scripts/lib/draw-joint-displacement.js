export function drawJointDisplacement(jointCoords, displacements) {
    const xCoord = jointCoords[0] + displacements[0] * 3;
    const yCoord = jointCoords[1] - displacements[1] * 3;

    const ns = "http://www.w3.org/2000/svg";
    const box = document.querySelector("#displacements-diagram");
    const node = document.createElementNS(ns, "circle");
    node.setAttributeNS(null, "stroke", "red");
    node.setAttributeNS(null, "fill", "red");
    node.setAttributeNS(null, "id", "displaced-joint");
    node.setAttributeNS(null, "r", "4");
    node.setAttributeNS(null, "cx", `${xCoord}`);
    node.setAttributeNS(null, "cy", `${yCoord}`);
    box.append(node);

    const member = document.createElementNS(ns, "line");
    member.setAttributeNS(null, "id", "member");
    member.setAttributeNS(null, "x1", `${nodes[start][1][0]}`);
    member.setAttributeNS(null, "y1", `${nodes[start][1][1]}`);
    member.setAttributeNS(null, "x2", `${nodes[end][1][0]}`);
    member.setAttributeNS(null, "y2", `${nodes[end][1][1]}`);
    member.setAttribute("stroke", "red");
    member.setAttribute("stroke-width", "3");
    box.append(member);

    if (displacements[0] < 0 || displacements[0] > 0 || displacements[1] < 0 || displacements[1] > 0) {
        const xDelta = Math.abs(displacements[0]) > 1 ? displacements[0].toFixed(1) : displacements[0].toFixed(3);
        const yDelta = Math.abs(displacements[1]) > 1 ? displacements[1].toFixed(1) : displacements[1].toFixed(3);

        const text = document.createElementNS(ns, "text");
        text.setAttributeNS(null, "id", "joint-tag");
        text.setAttribute("x", `${xCoord - 15}`);
        text.setAttribute("y", `${yCoord - 15}`);
        text.setAttribute("height", "5");
        text.setAttribute("width", "5");
        text.textContent = `[${xDelta}, ${yDelta}]`;
        box.append(text);
    }
}

// the drawing of displaced members should use the drawMember and drawJoint
// functions, and pass in the colour parameter instead of re-writing these
// functions (DRY principle)
