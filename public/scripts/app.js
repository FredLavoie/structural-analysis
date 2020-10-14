//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const inputNumJoints = document.querySelector('#input-numJoints');
  inputNumJoints.addEventListener('change', () => {
    document.querySelectorAll('#joints-container-1>.joints-container-2').forEach((n) => n.remove());
    const num = document.querySelector('#input-numJoints').value;
    for (let i = 1; i <= num; i++) {
      generateJointInput(i);
    }
  });


  const inputNumMembers = document.querySelector('#input-numMembers');
  inputNumMembers.addEventListener('change', () => {
    document.querySelectorAll('#members-container-1>.members-container-2').forEach((n) => n.remove());
    const num = document.querySelector('#input-numMembers').value;
    for (let i = 1; i <= num; i++) {
      generateMemberInput(i);
    }
  });

  const inputNumEMs = document.querySelector('#input-numEMs');
  inputNumEMs.addEventListener('change', () => {
    document.querySelector('#em-container').innerHTML = '';
    const num = document.querySelector('#input-numEMs').value;
    for (let i = 1; i <= num; i++) {
      generateEMInput(i);
    }
  });

  const inputNumAreas = document.querySelector('#input-numAreas');
  inputNumAreas.addEventListener('change', () => {
    document.querySelector('#area-container').innerHTML = '';
    const num = document.querySelector('#input-numAreas').value;
    for (let i = 1; i <= num; i++) {
      generateAreaInput(i);
    }
  });

  const inputNumMOIs = document.querySelector('#input-numMOIs');
  inputNumMOIs.addEventListener('change', () => {
    document.querySelector('#moi-container').innerHTML = '';
    const num = document.querySelector('#input-numMOIs').value;
    for (let i = 1; i <= num; i++) {
      generateMOIInput(i);
    }
  });

  const inputNumJointLoads = document.querySelector('#input-numJointLoads');
  inputNumJointLoads.addEventListener('change', () => {
    document.querySelector('#pl-container').innerHTML = '';
    const num = document.querySelector('#input-numJointLoads').value;
    for (let i = 1; i <= num; i++) {
      generateJointLoadsInput(i);
    }
  });

  const inputNumMemLoads = document.querySelector('#input-numMemLoads');
  inputNumMemLoads.addEventListener('change', () => {
    document.querySelector('#ml-container').innerHTML = '';
    const num = document.querySelector('#input-numMemLoads').value;
    for (let i = 1; i <= num; i++) {
      generateMemberLoadsInput(i);
    }
  });
});

//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

// Generate number of input boxes based on numJoints
function generateJointInput(i) {
  const $jointDiv = document.createElement('div');
  $jointDiv.setAttribute('class','joints-container-2');

  const $jointNum = document.createElement('label');
  $jointNum.innerHTML = `Joint #${i}`;

  const $coordInputX = document.createElement('input');
  $coordInputX.setAttribute('class','input-style form-control joint');
  $coordInputX.setAttribute('name', 'joints');
  $coordInputX.setAttribute('placeholder', 'X-coord.');

  const $coordInputY  = document.createElement('input');
  $coordInputY.setAttribute('class','input-style form-control joint');
  $coordInputY.setAttribute('name', 'joints');
  $coordInputY.setAttribute('placeholder', 'Y-coord.');

  const $xRest = document.createElement('input');
  $xRest.setAttribute('class','input-style form-control supports');
  $xRest.setAttribute('name', 'joints');
  $xRest.setAttribute('placeholder', 'x-rest.');

  const $yRest = document.createElement('input');
  $yRest.setAttribute('class','input-style form-control supports');
  $yRest.setAttribute('name', 'joints');
  $yRest.setAttribute('placeholder', 'y-rest.');

  const $rotRest = document.createElement('input');
  $rotRest.setAttribute('class','input-style form-control supports');
  $rotRest.setAttribute('name', 'joints');
  $rotRest.setAttribute('placeholder', 'rot. rest.');

  $jointDiv.appendChild($jointNum);
  $jointDiv.appendChild($coordInputX);
  $jointDiv.appendChild($coordInputY);
  $jointDiv.appendChild($xRest);
  $jointDiv.appendChild($yRest);
  $jointDiv.appendChild($rotRest);

  document.querySelector('#joints-container-1').appendChild($jointDiv);
}

// Generate number of input boxes based on numMembers
function generateMemberInput(i) {
  const $memberDiv = document.createElement('div');
  $memberDiv.setAttribute('class','container-2 members-container-2');

  const $memberNum = document.createElement('label');
  $memberNum.innerHTML = `Member #${i}`;

  const $jointStart = document.createElement('input');
  $jointStart.setAttribute('class','input-style form-control member');
  $jointStart.setAttribute('name', 'members');
  $jointStart.setAttribute('placeholder', 'Joint start');

  const $jointEnd = document.createElement('input');
  $jointEnd.setAttribute('class','input-style form-control member');
  $jointEnd.setAttribute('name', 'members');
  $jointEnd.setAttribute('placeholder', 'Joint end');

  const $emNo = document.createElement('input');
  $emNo.setAttribute('class','input-style form-control');
  $emNo.setAttribute('name', 'members');
  $emNo.setAttribute('placeholder', 'EM No.');

  const $areaNo = document.createElement('input');
  $areaNo.setAttribute('class','input-style form-control');
  $areaNo.setAttribute('name', 'members');
  $areaNo.setAttribute('placeholder', 'Area No.');

  const $moiNo = document.createElement('input');
  $moiNo.setAttribute('class','input-style form-control');
  $moiNo.setAttribute('name', 'members');
  $moiNo.setAttribute('placeholder', 'MoI No.');

  $memberDiv.appendChild($memberNum);
  $memberDiv.appendChild($jointStart);
  $memberDiv.appendChild($jointEnd);
  $memberDiv.appendChild($emNo);
  $memberDiv.appendChild($areaNo);
  $memberDiv.appendChild($moiNo);

  document.querySelector('#members-container-1').appendChild($memberDiv);
}

// Generate number of input boxes based on numEMs
function generateEMInput(i) {
  const $label = document.createElement('label');
  $label.innerHTML = `Elastic Modulus # ${i}`;
  const $input = document.createElement('input');
  $input.setAttribute('class','input-style form-control');
  $input.setAttribute('name', 'ElasticMods');

  const $container = document.querySelector('#em-container');
  $container.appendChild($label);
  $container.appendChild($input);
}

// Generate number of input boxes based on numAreas
function generateAreaInput(i) {
  const $label = document.createElement('label');
  $label.innerHTML = `Area # ${i}`;
  const $input = document.createElement('input');
  $input.setAttribute('class','input-style form-control');
  $input.setAttribute('name', 'Areas');

  const $container = document.querySelector('#area-container');
  $container.appendChild($label);
  $container.appendChild($input);
}

// Generate number of input boxes based on numMOIs
function generateMOIInput(i) {
  const $label = document.createElement('label');
  $label.innerHTML = `Moment of Inertia # ${i}`;
  const $input = document.createElement('input');
  $input.setAttribute('class','input-style form-control');
  $input.setAttribute('name', 'MoI');

  const $container = document.querySelector('#moi-container');
  $container.appendChild($label);
  $container.appendChild($input);
}

// Generate joint load input boxes
function generateJointLoadsInput(i) {
  const $jointLoadDiv = document.createElement('div');
  $jointLoadDiv.setAttribute('class','container-2 joint-load-container');

  const $jointLoadNum = document.createElement('label');
  $jointLoadNum.innerHTML = `Joint Load #${i}`;

  const $jointNum = document.createElement('input');
  $jointNum.setAttribute('class','input-style form-control joint-loads');
  $jointNum.setAttribute('name', 'loads');
  $jointNum.setAttribute('placeholder', 'Joint No.');

  const $xValue = document.createElement('input');
  $xValue.setAttribute('class','input-style form-control joint-loads');
  $xValue.setAttribute('name', 'loads');
  $xValue.setAttribute('placeholder', 'X value');

  const $yValue = document.createElement('input');
  $yValue.setAttribute('class','input-style form-control joint-loads');
  $yValue.setAttribute('name', 'loads');
  $yValue.setAttribute('placeholder', 'Y value');

  const $moment = document.createElement('input');
  $moment.setAttribute('class','input-style form-control joint-loads');
  $moment.setAttribute('name', 'loads');
  $moment.setAttribute('placeholder', 'Moment');

  $jointLoadDiv.appendChild($jointLoadNum);
  $jointLoadDiv.appendChild($jointNum);
  $jointLoadDiv.appendChild($xValue);
  $jointLoadDiv.appendChild($yValue);
  $jointLoadDiv.appendChild($moment);

  document.querySelector('#pl-container').appendChild($jointLoadDiv);
}

// Generate member load input boxes
function generateMemberLoadsInput(i) {
  const $memberLoadDiv = document.createElement('div');
  $memberLoadDiv.setAttribute('class','container-2 member-load-container');

  const $memberLoadNum = document.createElement('label');
  $memberLoadNum.innerHTML = `Member Load #${i}`;

  const $memberNum = document.createElement('input');
  $memberNum.setAttribute('class','input-style form-control member-loads');
  $memberNum.setAttribute('name', 'loads');
  $memberNum.setAttribute('placeholder', 'Member No.');

  const $xDist = document.createElement('input');
  $xDist.setAttribute('class','input-style form-control member-loads');
  $xDist.setAttribute('name', 'loads');
  $xDist.setAttribute('placeholder', 'X-distance');

  const $pl = document.createElement('input');
  $pl.setAttribute('class','input-style form-control member-loads');
  $pl.setAttribute('name', 'loads');
  $pl.setAttribute('placeholder', 'Point Load');

  const $udl = document.createElement('input');
  $udl.setAttribute('class','input-style form-control member-loads');
  $udl.setAttribute('name', 'loads');
  $udl.setAttribute('placeholder', 'UDL');

  $memberLoadDiv.appendChild($memberLoadNum);
  $memberLoadDiv.appendChild($memberNum);
  $memberLoadDiv.appendChild($xDist);
  $memberLoadDiv.appendChild($pl);
  $memberLoadDiv.appendChild($udl);

  document.querySelector('#ml-container').appendChild($memberLoadDiv);
}
