//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

$(document).ready(function() {
  $('#input-numJoints').change(function() {
    $('#joints-container-1').empty();
    let num = $('#input-numJoints').val();
    for (let i = 1; i <= num; i++) {
      generateJointInput(i);
    }
  });

  $('#input-numMembers').change(function() {
    $('#members-container-1').empty();
    let num = $('#input-numMembers').val();
    for (let i = 1; i <= num; i++) {
      generateMemberInput(i);
    }
  });

  $('#input-numEMs').change(function() {
    $('#em-container').empty();
    let num = $('#input-numEMs').val();
    for (let i = 1; i <= num; i++) {
      generateEMInput(i);
    }
  });

  $('#input-numAreas').change(function() {
    $('#area-container').empty();
    let num = $('#input-numAreas').val();
    for (let i = 1; i <= num; i++) {
      generateAreaInput(i);
    }
  });

  $('#input-numMOIs').change(function() {
    $('#moi-container').empty();
    let num = $('#input-numMOIs').val();
    for (let i = 1; i <= num; i++) {
      generateMOIInput(i);
    }
  });
});
  
//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

// Generate number of input boxes based on numJoints
function generateJointInput(i) {
  // create all tags to be appended and assign the values where needed
  let $jointDiv = $('<div>').addClass('joints-container-2');
  let $jointNum = $('<label>').text(`Joint #${i}`);
  let $coordInputX = $('<input>').addClass('input-style form-control').attr('name', 'Joints')
    .attr('placeholder', 'X-coord.');
  let $coordInputY = $('<input>').addClass('input-style form-control').attr('name', 'Joints')
    .attr('placeholder', 'Y-coord.');
  let $xRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');
  let $yRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');
  let $rotRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');
  let $xRestLabel = $('<label>').text('x-rest.');
  let $yRestLabel = $('<label>').text('y-rest.');
  let $rotRestLabel = $('<label>').text('rot. rest.');

  // append all tags in reverse order (starting with furthest nested tags)
  $jointDiv
    .append($jointNum)
    .append($coordInputX)
    .append($coordInputY)
    .append($xRestLabel)
    .append($xRest)
    .append($yRestLabel)
    .append($yRest)
    .append($rotRestLabel)
    .append($rotRest);

  $('#joints-container-1')
    .append($jointDiv);

}

// Generate number of input boxes based on numMembers
function generateMemberInput(i) {
  // create all tags to be appended and assign the values where needed
  let $memberDiv = $('<div>').addClass("container-2 members-container-2");
  let $memberNum = $('<label>').text(`Member #${i}`);
  let $jointStart = $('<input>').addClass('input-style form-control').attr('name', 'members')
    .attr('placeholder', 'Joint start');
  let $jointEnd = $('<input>').addClass('input-style form-control').attr('name', 'members')
    .attr('placeholder', 'Joint end');
  let $emNo = $('<input>').addClass('input-style form-control').attr('name', 'members')
    .attr('placeholder', 'EM No.');
  let $areaNo = $('<input>').addClass('input-style form-control').attr('name', 'members')
    .attr('placeholder', 'Area No.');
  let $moiNo = $('<input>').addClass('input-style form-control').attr('name', 'members')
    .attr('placeholder', 'MoI No.');
  
  // append all tags in reverse order
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
