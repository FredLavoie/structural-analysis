//***************************** DOCUMENT READY ********************************/
//*****************************************************************************/

$(document).ready(function() {
	$('#input-numJoints').change(function() {
		$('#joint-container').empty();
		let num = $('#input-numJoints').val();
		for (let i = 0; i < num; i++) {
			let j = i + 1;
			console.log('This is j: ', j);
			generateJointInput(j);
		}
	});
});
  
//******************************* FUNCTIONS ***********************************/
//*****************************************************************************/

// Generate number of input boxes based on numJoints
function generateJointInput(i) {
	$('#joint-container').append($('<label>').text('Joint #', i));
	$('#joint-container').append($('<input>')
			.addClass('input-style form-control')
			.attr('type', 'number')
			.attr('placeholder', 'Joint ' + i));
}