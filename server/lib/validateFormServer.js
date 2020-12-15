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

  let errorBool = true;
  const messages = [];

  // eslint-disable-next-line no-useless-escape
  const specChar = /[!@#$%^&*()_+=\[\]{};':"\\|,<>\/?]+/;
  const alphaChar = /[a-zA-Z]/;

  if (numJoints < 0 || numJoints === '' || !Number.isInteger(numJoints)) {
    errorBool = false,
    messages.push('The number of joints input is incorrect');
  }

  if (numMembers < 0 || numMembers === '' || !Number.isInteger(numMembers)) {
    errorBool = false,
    messages.push('The number of members input is incorrect');
  }

  if (numElasticModulus < 0 || numElasticModulus === '' || !Number.isInteger(numElasticModulus)) {
    errorBool = false,
    messages.push('The number of elestic moduli input is incorrect');
  }

  if (numAreas < 0 || numAreas === '' || !Number.isInteger(numAreas)) {
    errorBool = false,
    messages.push('The number of areas input is incorrect');
  }

  if (numMomentOfInertia < 0 || numMomentOfInertia === '' || !Number.isInteger(numMomentOfInertia)) {
    errorBool = false,
    messages.push('The number of moment of inertias input is incorrect');
  }

  for (const ea of elasticMods) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea)) {
      errorBool = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  for (const ea of areas) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea)) {
      errorBool = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  for (const ea of MoIs) {
    if (ea < 0 || ea === '' || specChar.test(ea) || alphaChar.test(ea)) {
      errorBool = false,
      messages.push('One or more elastic modulus values are incorrect');
      break;
    }
  }

  for (let i = 0; i < joints.length; i += 5) {
    if (joints[i] < 0 || joints[i+1] < 0 || joints[i] === '' || joints[i+1] === '') {
      errorBool = false,
      messages.push('One or more joint coordinate values are incorrect');
    }
    if (joints[i+2] < 0 || joints[i+3] < 0 || joints[i+4] < 0 || joints[i+2] > 1 || joints[i+3] > 1 || joints[i+4] > 1) {
      errorBool = false,
      messages.push('One or more joint support values are incorrect');
    }
  }

  for (let i = 0; i < members.length; i += 5) {
    if (members[i] < 0 || members[i+1] < 0 || members[i] > numJoints || members[i+1] > numJoints || !Number.isInteger(members[i]) || !Number.isInteger(members[i+1])) {
      console.log(typeof members[i]);
      console.log('members[i]: ', members[i]);
      console.log('members[i+1]: ', members[i+1]);
      console.log('numJoints: ', numJoints);
      console.log('!Number.isInteger(members[i]): ', !Number.isInteger(members[i]));
      console.log('!Number.isInteger(members[i+1]): ', !Number.isInteger(members[i+1]));
      errorBool = false,
      messages.push('One or more member number values are incorrect');
    }
    if (members[i+2] < 0 ||members[i+2] > numElasticModulus || !Number.isInteger(members[i+2])) {
      errorBool = false,
      messages.push('One or more elastic modulus values are incorrect');
    }
    if (members[i+3] < 0 ||members[i+3] > numAreas || !Number.isInteger(members[i+3])) {
      errorBool = false,
      messages.push('One or more area values are incorrect');
    }
    if (members[i+4] < 0 ||members[i+4] > numMomentOfInertia || !Number.isInteger(members[i+4])) {
      errorBool = false,
      messages.push('One or more moment of inertia values are incorrect');
    }
  }

  for (let i = 0; i < numJointLoads; i++) {
    const endIndex = numJointLoads * 4;
    for (let i = 0; i < endIndex; i += 4) {
      if (loads[i] < 0 || loads[i] === '' || !Number.isInteger(loads[i])) {
        errorBool = false,
        messages.push('One or more joint number values are incorrect');
      }
      if (loads[i+1] === '' || specChar.test(loads[i+1])|| alphaChar.test(loads[i+1])) {
        errorBool = false,
        messages.push('One or more joint x-direction force values are incorrect');
      }
      if (loads[i+2] === '' || specChar.test(loads[i+2])|| alphaChar.test(loads[i+2])) {
        errorBool = false,
        messages.push('One or more joint x-direction force values are incorrect');
      }
      if (loads[i+3] === '' || specChar.test(loads[i+3])|| alphaChar.test(loads[i+3])) {
        errorBool = false,
        messages.push('One or more joint moment force values are incorrect');
      }
    }
  }

  for (let i = 0; i < numMemLoads; i++) {
    const startIndex = numJointLoads * 4;
    for (let i = startIndex; i < loads.length; i += 4) {
      if (loads[i] < 0 || loads[i] === '' || !Number.isInteger(loads[i])) {
        errorBool = false,
        messages.push('One or more member number values are incorrect');
      }
      if (loads[i+1] === '' || specChar.test(loads[i+1])|| alphaChar.test(loads[i+1])) {
        errorBool = false,
        messages.push('One or more point load distance values are incorrect');
      }
      if (loads[i+2] < 0 || loads[i+2] === '' || specChar.test(loads[i+2])|| alphaChar.test(loads[i+2])) {
        errorBool = false,
        messages.push('One or more point load force values are incorrect');
      }
      if (loads[i+3] === '' || specChar.test(loads[i+3])|| alphaChar.test(loads[i+3])) {
        errorBool = false,
        messages.push('One or more UDL force values are incorrect');
      }
    }
  }

  if (numJointLoads < 0 || numJointLoads === '' || !Number.isInteger(numJointLoads)) {
    errorBool = false,
    messages.push('The number of joint loads input is incorrect');
  }

  if (numMemLoads < 0 || numMemLoads === '' || !Number.isInteger(numMemLoads)) {
    errorBool = false,
    messages.push('The number of member loads input is incorrect');
  }

  return { error: errorBool, messageList: messages };
};


/****************************************** FUNCTIONS ******************************************************/
/***********************************************************************************************************/

function extractProperties(data) {
  if (typeof data === 'string') data = [ data ];
  const resultArr = data.map((e) => Number(e));
  return resultArr;
}
