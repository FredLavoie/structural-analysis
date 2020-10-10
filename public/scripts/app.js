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
  let $memberDiv = $('<div>').addClass('container-2 members-container-2');
  let $memberNum = $('<label>').text(`Member #${i}`);
  let $jointStart = $('<input>').addClass('input-style form-control member')
    .attr('name', 'members').attr('placeholder', 'Joint start');
  let $jointEnd = $('<input>').addClass('input-style form-control member')
    .attr('name', 'members').attr('placeholder', 'Joint end');
  let $emNo = $('<input>').addClass('input-style form-control')
    .attr('name', 'members').attr('placeholder', 'EM No.');
  let $areaNo = $('<input>').addClass('input-style form-control')
    .attr('name', 'members').attr('placeholder', 'Area No.');
  let $moiNo = $('<input>').addClass('input-style form-control')
    .attr('name', 'members').attr('placeholder', 'MoI No.');

  $memberDiv
    .append($memberNum)
    .append($jointStart)
    .append($jointEnd)
    .append($emNo)
    .append($areaNo)
    .append($moiNo);

  $('#members-container-1')
    .append($memberDiv);

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
  let $jointLoadDiv = $('<div>').addClass('container-2 joint-load-container');
  let $jointLoadNum = $('<label>').text(`Joint Load #${i}`);
  let $jointNum = $('<input>').addClass('input-style form-control joint-loads')
    .attr('name', 'loads').attr('placeholder', 'Joint No.');
  let $xValue = $('<input>').addClass('input-style form-control joint-loads')
    .attr('name', 'loads').attr('placeholder', 'X value');
  let $yValue = $('<input>').addClass('input-style form-control joint-loads')
    .attr('name', 'loads').attr('placeholder', 'Y value');
  let $moment = $('<input>').addClass('input-style form-control joint-loads')
    .attr('name', 'loads').attr('placeholder', 'Moment');

  $jointLoadDiv
    .append($jointLoadNum)
    .append($jointNum)
    .append($xValue)
    .append($yValue)
    .append($moment);

  $('#pl-container')
    .append($jointLoadDiv);
}
// Generate member load input boxes
function generateMemberLoadsInput(i) {
  let $memberLoadDiv = $('<div>').addClass('container-2 member-load-container');
  let $memberLoadNum = $('<label>').text(`Member Load #${i}`);
  let $memberNum = $('<input>').addClass('input-style form-control member-loads')
    .attr('name', 'loads').attr('placeholder', 'Member No.');
  let $xDist = $('<input>').addClass('input-style form-control member-loads')
    .attr('name', 'loads').attr('placeholder', 'X-distance');
  let $pl = $('<input>').addClass('input-style form-control member-loads')
    .attr('name', 'loads').attr('placeholder', 'Point Load');
  let $udl = $('<input>').addClass('input-style form-control member-loads')
    .attr('name', 'loads').attr('placeholder', 'UDL');

  $memberLoadDiv
    .append($memberLoadNum)
    .append($memberNum)
    .append($xDist)
    .append($pl)
    .append($udl);

  $('#ml-container')
    .append($memberLoadDiv);

}
