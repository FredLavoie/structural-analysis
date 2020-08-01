//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

$(document).change(function() {
  const windowWidth = $('#structure-window').width();
  const windowHeight = $('#structure-window').height();

  $('.joint').change(function() {
    // clear joints before drawing updated joints
    $('svg').children('circle').remove();

    let jointArray = $('.joint').map(function() {
      return Number(this.value);
    }).get();
    console.log('jointArray: ', jointArray);
    const jointCoordinates = calculateJointCoordinates(jointArray, windowWidth, windowHeight);
    let jointNum = 0;
    for (const point of jointCoordinates) {
      jointNum += 1;
      createNode(jointNum, point);
    }
  });

  // $('.member').change(function() {
  //   let memberArray = $('.member').map(function() {
  //     return Number(this.value);
  //   }).get();
  //   console.log('member array: ', memberArray);
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

function createNode(jointNum, point) {
  const ns = 'http://www.w3.org/2000/svg';
  const box = $('#structure-window');
  const node = document.createElementNS(ns, 'circle');
  node.setAttributeNS(null, "id",`joint${jointNum}`);
  node.setAttributeNS(null, "r", "5");
  node.setAttributeNS(null, "cx", `${point[0]}`);
  node.setAttributeNS(null, "cy",`${point[1]}`);
  box.append(node);
}

// function createMembers(jointNum, point) {
//   const ns = 'http://www.w3.org/2000/svg';
//   const box = $('#structure-window');
//   const node = document.createElementNS(ns, 'circle');
//   node.setAttributeNS(null, "id",`joint${jointNum}`);
//   node.setAttributeNS(null, "r", "5");
//   node.setAttributeNS(null, "cx", `${point[0]}`);
//   node.setAttributeNS(null, "cy",`${point[1]}`);
//   box.append(node);
// }