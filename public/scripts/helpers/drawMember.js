export function drawMember(num, start, end, nodes) {
  if (!(start in nodes) || !(end in nodes)) return;

  if (start !== 0 && end !== 0) {
    const ns = 'http://www.w3.org/2000/svg';
    const box = document.querySelector('#structure-window');
    const member = document.createElementNS(ns, 'line');
    member.setAttributeNS(null, 'id','member');
    member.setAttributeNS(null, 'x1', `${nodes[start][1][0]}`);
    member.setAttributeNS(null, 'y1',`${nodes[start][1][1]}`);
    member.setAttributeNS(null, 'x2', `${nodes[end][1][0]}`);
    member.setAttributeNS(null, 'y2',`${nodes[end][1][1]}`);
    member.setAttribute('stroke', 'black');
    member.setAttribute('stroke-width', '3');
    box.append(member);

    const midX = (nodes[start][1][0] + nodes[end][1][0]) / 2;
    const midY = (nodes[start][1][1] + nodes[end][1][1]) / 2;

    const text = document.createElementNS(ns, 'text');
    text.setAttributeNS(null, 'id','member-tag');
    text.setAttribute('x', `${midX - 15}`);
    text.setAttribute('y', `${midY - 15}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${num}`;
    box.append(text);
  }
}
