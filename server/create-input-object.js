module.exports = function (obj) {

  let inputObject = {};
  inputObject.numJoints = Number(obj.numJoints);
  inputObject.numMembers = Number(obj.numMembers);
  inputObject.numElasticModulus = Number(obj.numElasticModulus);
  inputObject.numAreas = Number(obj.numAreas);
  inputObject.numMomentOfInertia = Number(obj.numMomentOfInertia);
  inputObject.numLoadCases = 1;
  inputObject.joints = extractJointsAndMembers(obj.joints);
  inputObject.elasticMods = extractProperties(obj.ElasticMods);
  inputObject.areas = extractProperties(obj.Areas);
  inputObject.MoI = extractProperties(obj.MoI);
  inputObject.members = extractJointsAndMembers(obj.members);
  inputObject.loads = extractLoads(obj.loads, obj.numJointLoads, obj.numMemLoads);

  return inputObject;
};

/******************************** HELPER FUNCTIONS ********************************/
/**********************************************************************************/

function extractJointsAndMembers(data) {
  let resultArr = [];
  let num = data.length / 5;
  for (let i = 0; i < num; i++) {
    let arr = [];
    let section = i * 5;
    for (let i = 0; i < 5; i++) {
      arr.push(Number(data[section + i]));
    }
    resultArr.push(arr);
  }
  return resultArr;
}

function extractProperties(data) {
  if(typeof data == 'string') data = [ data ];
  let resultArr = data.map(e => Number(e));
  return resultArr;
}

function extractLoads(data, njl, nml) {
  let resultArr = [[Number(njl), Number(nml)]];
  let num = data.length / 4;
  for (let i = 0; i < num; i++) {
    let arr = [];
    let section = i * 4;
    for (let i = 0; i < 4; i++) {
      arr.push(Number(data[section + i]));
    }
    resultArr.push(arr);
  }
  return resultArr;
}
