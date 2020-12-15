module.exports = async function (obj) {
  const numJoints = Number(obj.numJoints);
  const numMembers = Number(obj.numMembers);
  const numElasticModulus = Number(obj.numElasticModulus);
  const numAreas = Number(obj.numAreas);
  const numMomentOfInertia = Number(obj.numMomentOfInertia);
  const elasticMods = extractProperties(obj.ElasticMods);
  const areas = extractProperties(obj.Areas);
  const MoIs = extractProperties(obj.MoI);
  const joints = obj.joints.map((e) => Number(e));
  const members = obj.members.map((e) => Number(e));
  const loads = obj.loads.map((e) => Number(e));
  const numJointLoads = Number(obj.numJointLoads);
  const numMemLoads = Number(obj.numMemLoads);

  let valid = true;
  const messages = [];

  // eslint-disable-next-line no-useless-escape
  const specChar = /[!@#$%^&*()_+=\[\]{};':"\\|,<>\/?]+/;
  const alphaChar = /[a-zA-Z]/;

  /******************************************************* TEST ********************************************************************/
  /*********************************************************************************************************************************/

  /*************** GENERAL INFO ****************/
  if (numJoints < 0 || numJoints === '' || !Number.isInteger(numJoints) || specChar.test(numJoints)|| alphaChar.test(numJoints)) {
    valid = false,
    messages.push('The number of joints input is incorrect');
  }

  if (numMembers < 0 || numMembers === '' || !Number.isInteger(numMembers)) {
    valid = false,
    messages.push('The number of members input is incorrect');
  }

  if (numElasticModulus < 0 || numElasticModulus === '' || !Number.isInteger(numElasticModulus)
    || specChar.test(numElasticModulus)|| alphaChar.test(numElasticModulus)) {
    valid = false,
    messages.push('The number of elestic moduli input is incorrect');
  }

  if (numAreas < 0 || numAreas === '' || !Number.isInteger(numAreas)) {
    valid = false,
    messages.push('The number of areas input is incorrect');
  }

  if (numMomentOfInertia < 0 || numMomentOfInertia === '' || !Number.isInteger(numMomentOfInertia)
    || specChar.test(numMomentOfInertia)|| alphaChar.test(numMomentOfInertia)) {
    valid = false,
    messages.push('The number of moment of inertias input is incorrect');
  }

  // stop validation at this point if errors exist in general info
  if (valid === false) return { valid: valid, messageList: messages };

  /************* PROPERTIES INPUT **************/
  for (const ea of elasticMods) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea) || elasticMods.length !== numElasticModulus) {
      valid = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  for (const ea of areas) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea) || areas.length !== numAreas) {
      valid = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  for (const ea of MoIs) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea) || MoIs.length !== numMomentOfInertia) {
      valid = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  /*************** JOINTS INPUT ****************/
  for (let i = 0; i < joints.length; i += 5) {
    if (joints[i] === '' || joints[i+1] === '' || specChar.test(joints[i]) || specChar.test(joints[i+1])
    || alphaChar.test(joints[i]) || alphaChar.test(joints[i+1])) {
      valid = false,
      messages.push('One or more joint coordinate values are incorrect');
    }
    if (joints[i+2] < 0 || joints[i+3] < 0 || joints[i+4] < 0 || joints[i+2] > 1 || joints[i+3] > 1 || joints[i+4] > 1
      || alphaChar.test(joints[i+2]) || alphaChar.test(joints[i+3])|| alphaChar.test(joints[i+4])
      || specChar.test(joints[i+2]) || specChar.test(joints[i+3])|| specChar.test(joints[i+4])) {
      valid = false,
      messages.push('One or more joint support values are incorrect');
    }
  }

  /************** MEMBERS INPUT ****************/
  for (let i = 0; i < members.length; i += 5) {
    if (members[i] < 0 || members[i+1] < 0 || members[i] > numJoints || members[i+1] > numJoints
      || !Number.isInteger(members[i]) || !Number.isInteger(members[i+1])) {
      valid = false,
      messages.push('One or more member number values are incorrect');
    }
    if (members[i+2] < 0 ||members[i+2] > numElasticModulus || !Number.isInteger(members[i+2])) {
      valid = false,
      messages.push('One or more elastic modulus values are incorrect');
    }
    if (members[i+3] < 0 ||members[i+3] > numAreas || !Number.isInteger(members[i+3])) {
      valid = false,
      messages.push('One or more area values are incorrect');
    }
    if (members[i+4] < 0 ||members[i+4] > numMomentOfInertia || !Number.isInteger(members[i+4])) {
      valid = false,
      messages.push('One or more moment of inertia values are incorrect');
    }
  }

  /************* JOINT LOAD INPUT **************/
  for (let i = 0; i < numJointLoads; i++) {
    const endIndex = numJointLoads * 4;
    for (let i = 0; i < endIndex; i += 4) {
      if (loads[i] < 0 || loads[i] === '' || !Number.isInteger(loads[i])) {
        valid = false,
        messages.push('One or more joint number values are incorrect');
      }
      if (loads[i+1] === '' || specChar.test(loads[i+1])|| alphaChar.test(loads[i+1])) {
        valid = false,
        messages.push('One or more joint x-direction force values are incorrect');
      }
      if (loads[i+2] === '' || specChar.test(loads[i+2])|| alphaChar.test(loads[i+2])) {
        valid = false,
        messages.push('One or more joint x-direction force values are incorrect');
      }
      if (loads[i+3] === '' || specChar.test(loads[i+3])|| alphaChar.test(loads[i+3])) {
        valid = false,
        messages.push('One or more joint moment force values are incorrect');
      }
    }
  }

  /************* MEMBER LOAD INPUT *************/
  for (let i = 0; i < numMemLoads; i++) {
    const startIndex = numJointLoads * 4;
    for (let i = startIndex; i < loads.length; i += 4) {
      if (loads[i] < 0 || loads[i] === '' || !Number.isInteger(loads[i])) {
        valid = false,
        messages.push('One or more member number values are incorrect');
      }
      if (loads[i+1] === '' || specChar.test(loads[i+1])|| alphaChar.test(loads[i+1])) {
        valid = false,
        messages.push('One or more point load distance values are incorrect');
      }
      if (loads[i+2] < 0 || loads[i+2] === '' || specChar.test(loads[i+2])|| alphaChar.test(loads[i+2])) {
        valid = false,
        messages.push('One or more point load force values are incorrect');
      }
      if (loads[i+3] === '' || specChar.test(loads[i+3])|| alphaChar.test(loads[i+3])) {
        valid = false,
        messages.push('One or more UDL force values are incorrect');
      }
    }
  }

  /*********** NUMBER OF LOADS INPUT ***********/
  if (numJointLoads < 0 || numJointLoads === '' || !Number.isInteger(numJointLoads)) {
    valid = false,
    messages.push('The number of joint loads input is incorrect');
  }

  if (numMemLoads < 0 || numMemLoads === '' || !Number.isInteger(numMemLoads)) {
    valid = false,
    messages.push('The number of member loads input is incorrect');
  }

  return { valid: valid, messageList: messages };
};


/***************************************************** FUNCTIONS *****************************************************************/
/*********************************************************************************************************************************/


function extractProperties(data) {
  if (typeof data === 'string') data = [ data ];
  const resultArr = data.map((e) => Number(e));
  return resultArr;
}
