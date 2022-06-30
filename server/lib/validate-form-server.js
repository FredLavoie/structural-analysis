export function validateForm(obj) {

  if (!obj.numJoints) return { valid: false, messageList: ['Missing data: numJoints'] };
  if (!obj.numMembers) return { valid: false, messageList: ['Missing data: numMembers'] };
  if (!obj.numElasticModulus) return { valid: false, messageList: ['Missing data: numElasticModulus'] };
  if (!obj.numAreas) return { valid: false, messageList: ['Missing data: numAreas'] };
  if (!obj.numMomentOfInertia) return { valid: false, messageList: ['Missing data: numMomentOfInertia'] };
  if (!obj.ElasticMods) return { valid: false, messageList: ['Missing data: ElasticMods'] };
  if (!obj.Areas) return { valid: false, messageList: ['Missing data: Areas'] };
  if (!obj.MoI) return { valid: false, messageList: ['Missing data: MoI'] };
  if (!obj.joints) return { valid: false, messageList: ['Missing data: joints'] };
  if (!obj.members) return { valid: false, messageList: ['Missing data: members'] };
  if (!obj.loads) return { valid: false, messageList: ['Missing data: loads'] };
  if (!obj.numJointLoads) return { valid: false, messageList: ['Missing data: numJointLoads'] };
  if (!obj.numMemLoads) return { valid: false, messageList: ['Missing data: numMemLoads'] };

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

  /******************************************************* TEST ********************************************************************/
  /*********************************************************************************************************************************/

  /*************** GENERAL INFO ****************/
  if (isNotIntegerNumber(numJoints)) {
    valid = false, messages.push('The number of joints input is incorrect in the general info section');
  }

  if (isNotIntegerNumber(numMembers)) {
    valid = false, messages.push('The number of members input is incorrect in the general info section');
  }

  if (isNotIntegerNumber(numElasticModulus)) {
    valid = false, messages.push('The number of elestic moduli input is incorrect in the general info section');
  }

  if (isNotIntegerNumber(numAreas)) {
    valid = false, messages.push('The number of areas input is incorrect in the general info section');
  }

  if (isNotIntegerNumber(numMomentOfInertia)) {
    valid = false, messages.push('The number of moment of inertias input is incorrect in the general info section');
  }

  // stop validation at this point if errors exist in general info
  if (valid === false) return { valid: valid, messageList: messages };

  /************* PROPERTIES INPUT **************/
  for (const ea of elasticMods) {
    if (isNotAnyNegativeZeroNumber(ea) || elasticMods.length !== numElasticModulus) {
      valid = false, messages.push('One or more elastic modulus values are incorrect in the properties input section');
      break;
    }
  }

  for (const ea of areas) {
    if (isNotAnyNegativeZeroNumber(ea) || areas.length !== numAreas) {
      valid = false, messages.push('One or more area values are incorrect in the properties input section');
      break;
    }
  }

  for (const ea of MoIs) {
    if (isNotAnyNegativeZeroNumber(ea) || MoIs.length !== numMomentOfInertia) {
      valid = false, messages.push('One or more moment of inertia values are incorrect in the properties input section');
      break;
    }
  }

  /*************** JOINTS INPUT ****************/
  for (let i = 0; i < joints.length; i += 5) {
    if (isNotAnyTypeOfNumber(joints[i]) || isNotAnyTypeOfNumber(joints[i + 1])) {
      valid = false, messages.push('One or more joint coordinate values are incorrect in the joint input section');
    }
    if (isNotBetweenZeroAndOne(joints[i + 2]) || isNotBetweenZeroAndOne(joints[i + 3]) || isNotBetweenZeroAndOne(joints[i + 4])) {
      valid = false, messages.push('One or more joint support values are incorrect in the joint input section');
    }
  }

  /************** MEMBERS INPUT ****************/
  for (let i = 0; i < members.length; i += 5) {
    if (isNotIntegerNumber(members[i]) || isNotIntegerNumber(members[i + 1]) || members[i] > numJoints || members[i + 1] > numJoints) {
      valid = false, messages.push('One or more member number are incorrect in the member input section');
    }
    if (isNotIntegerNumber(members[i + 2]) || members[i + 2] > numElasticModulus) {
      valid = false, messages.push('One or more elastic modulus numbers are incorrect in the member input section');
    }
    if (isNotIntegerNumber(members[i + 3]) || members[i + 3] > numAreas) {
      valid = false, messages.push('One or more area numbers are incorrect in the member input section');
    }
    if (isNotIntegerNumber(members[i + 4]) || members[i + 4] > numMomentOfInertia) {
      valid = false, messages.push('One or more moment of inertia numbers are incorrect in the member input section');
    }
  }

  /************* JOINT LOAD INPUT **************/
  for (let i = 0; i < numJointLoads; i++) {
    const endIndex = numJointLoads * 4;
    for (let i = 0; i < endIndex; i += 4) {
      if (isNotIntegerNumber(loads[i])) {
        valid = false, messages.push('One or more joint number values are incorrect in the joint load input section');
      }
      if (isNotAnyTypeOfNumber(loads[i + 1])) {
        valid = false, messages.push('One or more joint x-direction force values are incorrect in the joint load input section');
      }
      if (isNotAnyTypeOfNumber(loads[i + 2])) {
        valid = false, messages.push('One or more joint x-direction force values are incorrect in the joint load input section');
      }
      if (isNotAnyTypeOfNumber(loads[i + 3])) {
        valid = false, messages.push('One or more joint moment force values are incorrect in the joint load input section');
      }
    }
  }

  /************* MEMBER LOAD INPUT *************/
  for (let i = 0; i < numMemLoads; i++) {
    const startIndex = numJointLoads * 4;
    for (let i = startIndex; i < loads.length; i += 4) {
      if (isNotIntegerNumber(loads[i])) {
        valid = false, messages.push('One or more member number values are incorrect in the member load input section');
      }
      if (isNotAnyNegativeZeroNumber(loads[i + 1])) {
        valid = false, messages.push('One or more point load distance values are incorrect in the member load input section');
      }
      if (isNotAnyTypeOfNumber(loads[i + 2])) {
        valid = false, messages.push('One or more point load force values are incorrect in the member load input section');
      }
      if (isNotAnyTypeOfNumber(loads[i + 3])) {
        valid = false, messages.push('One or more UDL force values are incorrect in the member load input section');
      }
    }
  }

  /*********** NUMBER OF LOADS INPUT ***********/
  if (isNotIntegerNumber(numJointLoads)) {
    valid = false, messages.push('The number of joint loads input is incorrect');
  }

  if (isNotIntegerNumber(numMemLoads)) {
    valid = false, messages.push('The number of member loads input is incorrect');
  }

  return { valid: valid, messageList: messages };
}


/************************************************** HELPER FUNCTIONS *************************************************************/
/*********************************************************************************************************************************/

function extractProperties(data) {
  if (typeof data === 'string') data = [data];
  const resultArr = data.map((e) => Number(e));
  return resultArr;
}

// eslint-disable-next-line no-useless-escape
const specChar = /[!@#$%^&*()_+=\[\]{};':"\\|,<>\/?]+/;
const alphaChar = /[a-zA-Z]/;

function isNotIntegerNumber(data) {
  if (data < 0 || data === '' || !Number.isInteger(data) || specChar.test(data) || alphaChar.test(data)) {
    return true;
  }
  return false;
}

function isNotAnyNegativeZeroNumber(data) {
  if (data < 0 || data === '' || specChar.test(data) || alphaChar.test(data)) {
    return true;
  }
  return false;
}

function isNotAnyTypeOfNumber(data) {
  if (data === '' || specChar.test(data) || alphaChar.test(data)) {
    return true;
  }
  return false;
}

function isNotBetweenZeroAndOne(data) {
  if (data < 0 || data > 1 || data === '' || specChar.test(data) || alphaChar.test(data)) {
    return true;
  }
  return false;
}
