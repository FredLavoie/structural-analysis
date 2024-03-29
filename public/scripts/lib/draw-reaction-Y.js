export function drawReactionY(jointNum, load, nodes) {
    const headX = nodes[jointNum][1][0];
    const headY = nodes[jointNum][1][1];
    const tailX = headX;
    const tailY = load < 0 ? headY - 50 : headY + 50;

    const base1 = load < 0 ? `${headX - 3.5} ${headY - 10}` : `${headX - 3.5} ${headY + 10}`;
    const base2 = load < 0 ? `${headX + 3.5} ${headY - 10}` : `${headX + 3.5} ${headY + 10}`;
    const point = `${headX} ${headY}`;
    const offset = load > 0 ? 5 : -5;
    const textOffset = load > 0 ? +25 : -10;

    const ns = "http://www.w3.org/2000/svg";
    const box = document.querySelector("#reactions-diagram");
    const arrow = document.createElementNS(ns, "polygon");
    arrow.setAttributeNS(null, "id", "joint-load");
    arrow.setAttributeNS(null, "stroke", "red");
    arrow.setAttributeNS(null, "fill", "red");
    arrow.setAttributeNS(null, "points", `${base1}, ${point}, ${base2}`);
    arrow.setAttributeNS(null, "transform", `translate(0 ${offset})`);
    box.append(arrow);

    const line = document.createElementNS(ns, "line");
    line.setAttributeNS(null, "id", "joint-load");
    line.setAttributeNS(null, "stroke", "red");
    line.setAttributeNS(null, "stroke-width", "2");
    line.setAttributeNS(null, "x1", `${headX}`);
    line.setAttributeNS(null, "y1", `${headY}`);
    line.setAttributeNS(null, "x2", `${tailX}`);
    line.setAttributeNS(null, "y2", `${tailY}`);
    line.setAttributeNS(null, "transform", `translate(0 ${offset})`);
    box.append(line);

    const text = document.createElementNS(ns, "text");
    text.setAttributeNS(null, "id", "reaction-joint");
    text.setAttribute("x", `${tailX - 30}`);
    text.setAttribute("y", `${tailY + textOffset}`);
    text.setAttribute("height", "5");
    text.setAttribute("width", "5");
    text.textContent = `${load}`;
    box.append(text);
}
