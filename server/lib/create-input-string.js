// Takes the object provided by the server and creates the string that
// the Fortran program expect

module.exports = async function (obj) {

  let dataString = '';

  // write first line of input file
  dataString += (
    obj.numJoints.toString() + ' ' +
    obj.numMembers.toString() + ' ' +
    obj.numElasticModulus.toString() + ' ' +
    obj.numAreas.toString() + ' ' +
    obj.numMomentOfInertia.toString() + ' ' +
    obj.numLoadCases.toString() + '\n'
  );

  // write joint data block of input file
  let count = 1;
  for (const joint of obj.joints) {
    const num = count.toString();
    dataString += num + ' ';
    dataString += joint[0] + ' ';
    dataString += joint[1] + ' ';
    dataString += joint[2] + ' ';
    dataString += joint[3] + ' ';
    dataString += joint[4] + '\n';
    count += 1;
  }

  // write properties block of input file
  count = 1;
  for (const em of obj.elasticMods) {
    const num = count.toString();
    dataString += num + ' ';
    dataString += em + '\n';
    count += 1;
  }

  count = 1;
  for (const area of obj.areas) {
    const num = count.toString();
    dataString += num + ' ';
    dataString += area + '\n';
    count += 1;
  }

  count = 1;
  for (const Mo of obj.MoI) {
    const num = count.toString();
    dataString += num + ' ';
    dataString += Mo + '\n';
    count += 1;
  }

  // write member data block of input file
  count = 1;
  for (const member of obj.members) {
    const num = count.toString();
    dataString += num + ' ';
    dataString += member[0] + ' ';
    dataString += member[1] + ' ';
    dataString += member[2] + ' ';
    dataString += member[3] + ' ';
    dataString += member[4] + '\n';
    count += 1;
  }

  // write loads block of input file
  for (const ea of obj.loads) {
    const removeComma = ea.reduce((acc, e) => {
      return acc += ' ' + e.toString();
    });
    dataString += removeComma + '\n';
  }

  return dataString;
};
