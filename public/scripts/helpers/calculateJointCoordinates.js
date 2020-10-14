export default function calculateJointCoordinates(arr, width, height) {
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

  if (xMin < 0) { // translate all x-coordiantes by xMin
    let count = 0;
    for (let i = 0; i < arr.length; i += 2) {
      arr.splice(i, 1, xCoords[count] -= xMin);
      count += 1;
    }
  }

  if (yMin < 0) { // translate all y-coordiantes by yMin
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
      jointCoordinates.push([arr[i], arr[i+1]],[Math.floor(x), Math.floor(y)]);
    }
  } else {
    const multiplier = (height * 0.8) / yRange;
    for (let i = 0; i < arr.length; i += 2) {
      const x = ((arr[i] - xMidRange) * multiplier) + (width / 2);
      const y = (height * 0.9) - (arr[i+1] * multiplier);
      jointCoordinates.push([arr[i], arr[i+1]],[Math.floor(x), Math.floor(y)]);
    }
  }
  return jointCoordinates;
}
