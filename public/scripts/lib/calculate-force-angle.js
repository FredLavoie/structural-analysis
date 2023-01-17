/**
 * Given the start & end coordinates of a member (the two joints), calculate
 * the angle of the force perpendiculare to the member from the horizontal.
 * This angle is then used to determine the draw angle of the point load and/or
 * UDL on a member.
 *
 * @param {number[]} start the coordinate of the start of the member
 * @param {number[]} end the coordinate of the end of the member
 * @returns {number} force angle perpendicular to the member
 */
export function calculateForceAngle(start, end) {
    const xDist = end[0] - start[0];
    const yDist = -(end[1] - start[1]);
    const angle = Math.abs(Math.atan(yDist / xDist) * (180 / Math.PI));
    let forceAngle = 0;

    if (xDist >= 0 && yDist >= 0) {
        // quadrant 1
        forceAngle = angle;
    } else if (xDist <= 0 && yDist >= 0) {
        // quadrant 2
        forceAngle = 180 - angle;
    } else if (xDist <= 0 && yDist <= 0) {
        // quadrant 3
        forceAngle = 180 + angle;
    } else if (xDist >= 0 && yDist <= 0) {
        // quadrant 4
        forceAngle = angle * -1;
    }
    return Math.round(forceAngle);
}
