//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

// $(document).ready(function() {
document.addEventListener("DOMContentLoaded", function() {
  const inputNumJoints = document.querySelector('#input-numJoints');
  inputNumJoints.addEventListener('change', function() {
    document.querySelectorAll('#joints-container-1>.joints-container-2').forEach(n => n.remove());
    let num = document.querySelector('#input-numJoints').value;
    console.log('num: ', num);
    for (let i = 1; i <= num; i++) {
      generateJointInput(i);
    }
  });


  const inputNumMembers = document.querySelector('#input-numMembers');
  inputNumMembers.addEventListener('change', function() {
    document.querySelectorAll('#members-container-1>.members-container-2').forEach(n => n.remove());
    let num = document.querySelector('#input-numMembers').value;
    for (let i = 1; i <= num; i++) {
      generateMemberInput(i);
    }
  });

  const inputNumEMs = document.querySelector('#input-numEMs');
  inputNumEMs.addEventListener('change', function() {
    document.querySelector('#em-container').innerHTML = '';
    let num = document.querySelector('#input-numEMs').value;
    for (let i = 1; i <= num; i++) {
      generateEMInput(i);
    }
  });

  const inputNumAreas = document.querySelector('#input-numAreas');
  inputNumAreas.addEventListener('change', function() {
    document.querySelector('#area-container').innerHTML = '';
    let num = document.querySelector('#input-numAreas').value;
    for (let i = 1; i <= num; i++) {
      generateAreaInput(i);
    }
  });

  const inputNumMOIs = document.querySelector('#input-numMOIs');
  inputNumMOIs.addEventListener('change', function() {
    document.querySelector('#moi-container').innerHTML = '';
    let num = document.querySelector('#input-numMOIs').value;
    for (let i = 1; i <= num; i++) {
      generateMOIInput(i);
    }
  });

  const inputNumJointLoads = document.querySelector('#input-numJointLoads');
  inputNumJointLoads.addEventListener('change', function() {
    document.querySelectorAll('#pl-container').innerHTML = '';
    let num = document.querySelector('#input-numJointLoads').value;
    for (let i = 1; i <= num; i++) {
      generateJointLoadsInput(i);
    }
  });

  const inputNumMemLoads = document.querySelector('#input-numMemLoads');
  inputNumMemLoads.addEventListener('change', function() {
    document.querySelectorAll('#ml-container').innerHTML = '';
    let num = document.querySelector('#input-numMemLoads').value;
    for (let i = 1; i <= num; i++) {
      generateMemberLoadsInput(i);
    }
  });
});

//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

// Generate number of input boxes based on numJoints
function generateJointInput(i) {
  let $jointDiv = document.createElement('div');
  $jointDiv.setAttribute('class','joints-container-2');

  let $jointNum = document.createElement('label');
  $jointNum.innerHTML = `Joint #${i}`;

  let $coordInputX = document.createElement('input');
  $coordInputX.setAttribute('class','input-style form-control supports');
  $coordInputX.setAttribute('name', 'joints');
  $coordInputX.setAttribute('placeholder', 'X-coord.');

  let $coordInputY  = document.createElement('input');
  $coordInputY.setAttribute('class','input-style form-control supports');
  $coordInputY.setAttribute('name', 'joints');
  $coordInputY.setAttribute('placeholder', 'Y-coord.');

  let $xRest = document.createElement('input');
  $xRest.setAttribute('class','input-style form-control supports');
  $xRest.setAttribute('name', 'joints');
  $xRest.setAttribute('placeholder', 'x-rest.');

  let $yRest = document.createElement('input');
  $yRest.setAttribute('class','input-style form-control supports');
  $yRest.setAttribute('name', 'joints');
  $yRest.setAttribute('placeholder', 'y-rest.');

  let $rotRest = document.createElement('input');
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
  let $memberDiv = document.createElement('div');
  $memberDiv.setAttribute('class','container-2 members-container-2');

  let $memberNum = document.createElement('label');
  $memberNum.innerHTML = `Member #${i}`;

  let $jointStart = document.createElement('input');
  $jointStart.setAttribute('class','input-style form-control member');
  $jointStart.setAttribute('name', 'members');
  $jointStart.setAttribute('placeholder', 'Joint start');

  let $jointEnd = document.createElement('input');
  $jointEnd.setAttribute('class','input-style form-control member');
  $jointEnd.setAttribute('name', 'members');
  $jointEnd.setAttribute('placeholder', 'Joint end');

  let $emNo = document.createElement('input');
  $emNo.setAttribute('class','input-style form-control');
  $emNo.setAttribute('name', 'members');
  $emNo.setAttribute('placeholder', 'EM No.');

  let $areaNo = document.createElement('input');
  $areaNo.setAttribute('class','input-style form-control');
  $areaNo.setAttribute('name', 'members');
  $areaNo.setAttribute('placeholder', 'Area No.');

  let $moiNo = document.createElement('input');
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
  $('#em-container').append($('<label>').text(`Elastic Modulus # ${i}`));
  $('#em-container').append($('<input>')

    .addClass('input-style form-control')
    .attr('name', 'ElasticMods'));
}

// Generate number of input boxes based on numAreas
function generateAreaInput(i) {
  $('#area-container').append($('<label>').text(`Area # ${i}`));
  $('#area-container').append($('<input>')

    .addClass('input-style form-control')
    .attr('name', 'Areas'));
}

// Generate number of input boxes based on numMOIs
function generateMOIInput(i) {
  $('#moi-container').append($('<label>').text(`Moment of Inertia # ${i}`));
  $('#moi-container').append($('<input>')

    .addClass('input-style form-control')
    .attr('name', 'MoI'));
}

// Generate joint load input boxes
function generateJointLoadsInput(i) {
  let $jointLoadDiv = document.createElement('div');
  $jointLoadDiv.setAttribute('class','container-2 joint-load-container');

  let $jointLoadNum = document.createElement('label');
  $jointLoadNum.innerHTML = `Joint Load #${i}`;

  let $jointNum = document.createElement('input');
  $jointNum.setAttribute('class','input-style form-control joint-loads');
  $jointNum.setAttribute('name', 'loads');
  $jointNum.setAttribute('placeholder', 'Joint No.');

  let $xValue = document.createElement('input');
  $xValue.setAttribute('class','input-style form-control joint-loads');
  $xValue.setAttribute('name', 'loads');
  $xValue.setAttribute('placeholder', 'X value');

  let $yValue = document.createElement('input');
  $yValue.setAttribute('class','input-style form-control joint-loads');
  $yValue.setAttribute('name', 'loads');
  $yValue.setAttribute('placeholder', 'Y value');

  let $moment = document.createElement('input');
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
  let $memberLoadDiv = document.createElement('div');
  $memberLoadDiv.setAttribute('class','container-2 member-load-container');

  let $memberLoadNum = document.createElement('label');
  $memberLoadNum.innerHTML = `Member Load #${i}`;

  let $memberNum = document.createElement('input');
  $memberNum.setAttribute('class','input-style form-control member-loads');
  $memberNum.setAttribute('name', 'loads');
  $memberNum.setAttribute('placeholder', 'Member No.');

  let $xDist = document.createElement('input');
  $xDist.setAttribute('class','input-style form-control member-loads');
  $xDist.setAttribute('name', 'loads');
  $xDist.setAttribute('placeholder', 'X-distance');

  let $pl = document.createElement('input');
  $pl.setAttribute('class','input-style form-control member-loads');
  $pl.setAttribute('name', 'loads');
  $pl.setAttribute('placeholder', 'Point Load');

  let $udl = document.createElement('input');
  $udl.setAttribute('class','input-style form-control member-loads');
  $udl.setAttribute('name', 'loads');
  $udl.setAttribute('placeholder', 'UDL');

  $memberLoadDiv.append($memberLoadNum);
  $memberLoadDiv.append($memberNum);
  $memberLoadDiv.append($xDist);
  $memberLoadDiv.append($pl);
  $memberLoadDiv.append($udl);

  document.querySelector('#ml-container').appendChild($memberLoadDiv);
}
