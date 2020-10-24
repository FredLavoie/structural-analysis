export function calculateForceAngle(start, end) {
  const xDist = end[0] - start[0];
  const yDist = -(end[1] - start[1]);
  const angle = Math.abs(Math.atan(yDist/xDist) * (180 / Math.PI));
  let forceAngle = 0;

  if (xDist >= 0 && yDist >= 0) { // quadrant 1
    forceAngle = angle;
  } else if (xDist <= 0 && yDist >= 0) { // quadrant 2
    forceAngle = 180 - angle;
  } else if (xDist <= 0 && yDist <= 0) { // quadrant 3
    forceAngle = 180 + angle;
  } else if (xDist >= 0 && yDist <= 0) { // quadrant 4
    forceAngle = angle * -1;
  }
  return Math.round(forceAngle);
}
