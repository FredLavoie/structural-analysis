//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

const globalNodeObject = {};
const globalMemberObject = {};

$(document).change(function() {
  const windowWidth = $('#structure-window').width();
  const windowHeight = $('#structure-window').height();

  $('.joint').keyup(function() {
    // clear joints before drawing updated joints
    $('svg').children('circle').remove();
    $('svg').children('text').remove();
    $('svg').children('line').remove();

    let jointArray = $('.joint').map(function() {
      return Number(this.value);
    }).get();

    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);
    let jointNum = 0;
    for (const point of jointCoordinates) {
      jointNum += 1;
      drawNode(jointNum, point);
      globalNodeObject[jointNum] = point;
    }
  });

  $('.member').keyup(function() {
    // clear members before drawing updated members
    $('svg').children('line').remove();
    $('svg').children('#member-tag').remove();

    let memberArray = $('.member').map(function() {
      return Number(this.value);
    }).get();

    let memberNumber = 0;
    for(let i = 0; i < memberArray.length; i += 2) {
      memberNumber += 1;
      drawMembers(memberNumber, memberArray[i], memberArray[i + 1]);
      
      let start = globalNodeObject[memberArray[i]];
      let end = globalNodeObject[memberArray[i + 1]];

      globalMemberObject[memberNumber] = { start: start, end: end };
    }
  });

  // $('.supports').change(function() {
  //   letSupportsArray = $('.supports').map(function() {
  //     return Number(this.value);
  //   }).get();


  // });
});


//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

function calculateJointCoordinates(arr, windowWidth, windowHeight) {
  const jointCoordinates = [];
  let xCoords = [];
  let yCoords = [];

  for(let i = 0; i < arr.length; i++){
    if (i % 2 === 0) {
      xCoords.push(arr[i]);
    } else {
      yCoords.push(arr[i]);
    }
  }
  let xMax = Math.max(...xCoords); 
  let xMin = Math.min(...xCoords);
  let yMax = Math.max(...yCoords);
  let yMin = Math.min(...yCoords);
  let xRange = xMax - xMin;
  let yRange = yMax - yMin;
  let xMidRange = xRange / 2;
  let yMidRange = yRange / 2;

  if(xRange > yRange){
    let multiplier = (windowWidth * 0.8) / xRange;
    for(let i = 0; i < arr.length; i += 2) {
      let x = (arr[i] * multiplier) + (windowWidth * 0.1);
      let y = -((arr[i + 1] - yMidRange) * multiplier) + (windowHeight / 2);
      jointCoordinates.push([Math.floor(x), Math.floor(y)]);
    }
  } else {
    let multiplier = (windowHeight * 0.8) / yRange;
    for(let i = 0; i < arr.length; i += 2) {
      let x = ((arr[i] - xMidRange) * multiplier) + (windowWidth / 2);
      let y = (windowHeight * 0.9) - (arr[i+1] * multiplier);
      jointCoordinates.push([Math.floor(x), Math.floor(y)]);
    }
  }
  return jointCoordinates;
}

function drawNode(jointNum, point) {
  if(isNaN(point[0]) || isNaN(point[1])) return;
  else {
    const ns = 'http://www.w3.org/2000/svg';
    const box = $('#structure-window');
    const node = document.createElementNS(ns, 'circle');
    node.setAttributeNS(null, "id",`joint${jointNum}`);
    node.setAttributeNS(null, "r", "5");
    node.setAttributeNS(null, "cx", `${point[0]}`);
    node.setAttributeNS(null, "cy",`${point[1]}`);
    box.append(node);

    const text = document.createElementNS(ns, 'text');
    text.setAttributeNS(null, "id",'joint-tag');
    text.setAttribute('x', `${point[0] - 10}`);
    text.setAttribute('y', `${point[1] - 10}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${jointNum}`;
    box.append(text);
  }
}

function drawMembers(num, start, end) {
  console.log('this got called');
  if(!(start in globalNodeObject) || !(end in globalNodeObject)) {
    return;
  }

  if(start !== 0 && end !== 0) {
    const ns = 'http://www.w3.org/2000/svg';
    const box = $('#structure-window');
    const member = document.createElementNS(ns, 'line');
    member.setAttributeNS(null, "id",`member${num}`);
    member.setAttributeNS(null, "x1", `${globalNodeObject[start][0]}`);
    member.setAttributeNS(null, "y1",`${globalNodeObject[start][1]}`);
    member.setAttributeNS(null, "x2", `${globalNodeObject[end][0]}`);
    member.setAttributeNS(null, "y2",`${globalNodeObject[end][1]}`);
    member.setAttribute("stroke", "black");
    member.setAttribute("stroke-width", 3);
    box.append(member);

    let midX = (globalNodeObject[start][0] + globalNodeObject[end][0]) / 2;
    let midY = (globalNodeObject[start][1] + globalNodeObject[end][1]) / 2;

    const text = document.createElementNS(ns, 'text');
    text.setAttributeNS(null, "id",'member-tag');
    text.setAttribute('x', `${midX - 10}`);
    text.setAttribute('y', `${midY - 10}`);
    text.setAttribute('height', '5');
    text.setAttribute('width', '5');
    text.textContent = `${num}`;
    box.append(text);
  }
}
