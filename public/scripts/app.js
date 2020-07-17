//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

$(document).ready(function() {
  $('#input-numJoints').change(function() {
    $('#joint-container').empty();
    let num = $('#input-numJoints').val();
    for (let i = 1; i <= num; i++) {
      generateJointInput(i);
    }
  });

  $('#input-numMembers').change(function() {
    // $('#joint-container').empty();
    // let num = $('#input-numJoints').val();
    // for (let i = 0; i < num; i++) {
    // 	let j = i + 1;
    // 	generateMemberInput(j);
    // }
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
  $('#joint-container').append($('<label>').text(`Joint # ${i} (X-coord, Y-coord, X-fixed, Y-fixed, Rot-fixed)`));
  
  // create all tags to be appended and assign the values where needed
  let $jointDiv = $('<div>').addClass('joints-container1');
  let $jointDiv2 = $('<div>').addClass('joints-container2');
  let $coordInput = $('<input>').addClass('input-style form-control').attr('name', 'Joints');
  let $xRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');
  let $yRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');
  let $rotRest = $('<input>').attr('type', 'checkbox').attr('name', 'Joints');

  // append all tags in reverse order (starting with furthest nested tags)
  $jointDiv2
    .append($coordInput)
    .append($xRest)
    .append($yRest)
    .append($rotRest);
  
  $jointDiv
    .append($jointDiv2);

  $('#joint-container')
    .append($jointDiv);

  // $('#joint-container')
  // 	.append($('<div>')
  // 		.addClass('flex-container')
  // 		.append($('<input>')
  // 			.addClass('input-style form-control')
  // 			.attr('name', 'Joints'))
  // 		.append($('<input>')
  // 			.attr('type', 'checkbox')
  // 			.attr('name', 'X-rest'))
  // 		.append($('<input>')
  // 			.attr('type', 'checkbox')
  // 			.attr('name', 'Y-rest'))
  // 		.append($('<input>')
  // 			.attr('type', 'checkbox')
  // 			.attr('name', 'Rot-rest')));
}

// Generate number of input boxes based on numMembers
// function generateMemberInput(i) {
// 	$('#joint-container').append($('<label>').text(`Joint # ${i}`));
// 	$('#joint-container').append($('<input>')
// 			.addClass('input-style form-control')
// 			.attr('name', 'Joints')
// 			.attr('placeholder', 'Joint ' + i));
// }

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
