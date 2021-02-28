export function drawJointDisplacement(jointNum, point) {
  console.log('point: ', point);
  const ns = 'http://www.w3.org/2000/svg';
  const box = document.querySelector('#displacements-diagram');
  const node = document.createElementNS(ns, 'circle');
  node.setAttributeNS(null, 'stroke', 'red');
  node.setAttributeNS(null, 'id','displaced-joint');
  node.setAttributeNS(null, 'r', '4');
  node.setAttributeNS(null, 'cx', `${point[0]}`);
  node.setAttributeNS(null, 'cy',`${point[1]}`);
  box.append(node);

  // const text = document.createElementNS(ns, 'text');
  // text.setAttributeNS(null, 'id','joint-tag');
  // text.setAttribute('x', `${point[0] - 15}`);
  // text.setAttribute('y', `${point[1] - 15}`);
  // text.setAttribute('height', '5');
  // text.setAttribute('width', '5');
  // text.textContent = `${jointNum}`;
  // box.append(text);
}
