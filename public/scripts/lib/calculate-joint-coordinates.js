/**
 * This module converts the user inputted coordinate values into coordinates
 * that are scaled for the size of the SVG box that they are appended to.
 * 
 * @param {number[]} arr user inputted joint coordinates (unitless)
 * @param {number} width of the window in pixels
 * @param {number} height of the window in pixels
 * @returns {number[]} joint coordinates scaled to the SVG boxa
 */
export function calculateJointCoordinates(arr, width, height) {
  console.log('arr in calculateJointCoordinates: ', arr);
  const jointCoordinates = [];
  const xCoords = [];
  const yCoords = [];

  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      xCoords.push(arr[i]);
    } else {
      yCoords.push(arr[i]);
    }
  }
  const xMax = Math.max(...xCoords);
  const xMin = Math.min(...xCoords);
  const yMax = Math.max(...yCoords);
  const yMin = Math.min(...yCoords);

  // translate all x-coordiantes by xMin
  if (xMin < 0) {
    let count = 0;
    for (let i = 0; i < arr.length; i += 2) {
      arr.splice(i, 1, xCoords[count] -= xMin);
      count += 1;
    }
  }

  // translate all y-coordiantes by yMin
  if (yMin < 0) {
    let count = 0;
    for (let i = 1; i <= arr.length; i += 2) {
      arr.splice(i, 1, yCoords[count] -= yMin);
      count += 1;
    }
  }

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xMidRange = xRange / 2;
  const yMidRange = yRange / 2;

  if (xRange > yRange) {
    const multiplier = (width * 0.8) / xRange;
    for (let i = 0; i < arr.length; i += 2) {
      const x = (arr[i] * multiplier) + (width * 0.1);
      const y = -((arr[i + 1] - yMidRange) * multiplier) + (height / 2);
      jointCoordinates.push([arr[i], arr[i + 1]], [Math.floor(x), Math.floor(y)]);
    }
  } else {
    const multiplier = (height * 0.8) / yRange;
    for (let i = 0; i < arr.length; i += 2) {
      const x = ((arr[i] - xMidRange) * multiplier) + (width / 2);
      const y = (height * 0.9) - (arr[i + 1] * multiplier);
      jointCoordinates.push([arr[i], arr[i + 1]], [Math.floor(x), Math.floor(y)]);
    }
  }
  return jointCoordinates;
}
