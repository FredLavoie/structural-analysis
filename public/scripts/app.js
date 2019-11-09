//***************************** DOCUMENT READY ********************************/
//*****************************************************************************/

$(document).ready(function() {
	$('#input-numJoints').change(function() {
		$('#joint-container').append();
		let num = $('#input-numJoints').val();
		for (let i = 0; i < num.length; i++) {
			let j = i + 1;
			generateJointInput(j);
		}
	});
});
  
//******************************* FUNCTIONS ***********************************/
//*****************************************************************************/

// Generate number of input boxes based on numJoints
function generateJointInput(i) {
	console.log('this got called', i);
	$('#joint-container').append($('<label>').text('Joint #', i));
	$('#joint-container').append($('<input>')
			.addClass('input-style form-control')
			.attr('type', 'number')
			.attr('placeholder', 'Joint ' + i));
}