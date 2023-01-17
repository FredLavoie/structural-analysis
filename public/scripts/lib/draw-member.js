/**
 * Draw the line representing a member within a box
 *
 * @param {number} num the member id number to display
 * @param {number} start the coordinate of the start of the member
 * @param {number} end the coordinate of the end of the member
 * @param {number[]} nodes coordinates of joints within the SVG box where draw the member to-and-from
 * @param {string} window the CSS class of the SVG box to append the new SVG elements to
 * @returns nothing
 */
export function drawMember(num, start, end, nodes, window) {
    if (!(start in nodes) || !(end in nodes)) return;

    if (start !== 0 && end !== 0) {
        const ns = "http://www.w3.org/2000/svg";
        const box = document.querySelector(window);
        const member = document.createElementNS(ns, "line");
        member.setAttributeNS(null, "id", "member");
        member.setAttributeNS(null, "x1", `${nodes[start][1][0]}`);
        member.setAttributeNS(null, "y1", `${nodes[start][1][1]}`);
        member.setAttributeNS(null, "x2", `${nodes[end][1][0]}`);
        member.setAttributeNS(null, "y2", `${nodes[end][1][1]}`);
        member.setAttribute("stroke", "black");
        member.setAttribute("stroke-width", "3");
        box.append(member);

        const midX = (nodes[start][1][0] + nodes[end][1][0]) / 2;
        const midY = (nodes[start][1][1] + nodes[end][1][1]) / 2;

        if (window !== "#internal-forces-diagram") {
            const text = document.createElementNS(ns, "text");
            text.setAttributeNS(null, "id", "member-tag");
            text.setAttribute("x", `${midX - 15}`);
            text.setAttribute("y", `${midY - 15}`);
            text.setAttribute("height", "5");
            text.setAttribute("width", "5");
            text.textContent = `${num}`;
            box.append(text);
        }
    }
}
