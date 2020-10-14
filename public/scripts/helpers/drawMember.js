export default function drawMember(num, start, end, globalNodeObject) {
  if (!(start in globalNodeObject) || !(end in globalNodeObject)) return;

  if (start !== 0 && end !== 0) {
    const ns = 'http://www.w3.org/2000/svg';
    const box = document.querySelector('#structure-window');
    const member = document.createElementNS(ns, 'line');
    member.setAttributeNS(null, 'id','member');
    member.setAttributeNS(null, 'x1', `${globalNodeObject[start][1][0]}`);
    member.setAttributeNS(null, 'y1',`${globalNodeObject[start][1][1]}`);
    member.setAttributeNS(null, 'x2', `${globalNodeObject[end][1][0]}`);
    member.setAttributeNS(null, 'y2',`${globalNodeObject[end][1][1]}`);
    member.setAttribute('stroke', 'black');
    member.setAttribute('stroke-width', '3');
    box.append(member);

    const midX = (globalNodeObject[start][1][0] + globalNodeObject[end][1][0]) / 2;
    const midY = (globalNodeObject[start][1][1] + globalNodeObject[end][1][1]) / 2;

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
