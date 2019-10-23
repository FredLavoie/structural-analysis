module.exports = function (obj) {

	let dataString = '';

	// write first line of input file
	dataString += (
		obj.numJoints.toString() + ' ' +
		obj.numMembers.toString() + ' ' +
		obj.numElasticModulus.toString() + ' ' +
		obj.numAreas.toString() + ' ' +
		obj.numMomentOfInertia.toString() + ' ' +
		obj.numLoadCases.toString() + '\n'
	);
	
	// write joint data block of input file
	let count = 1;
	for (const joint of obj.joints) {
		let num = count.toString();
		dataString += num + ' ';
		dataString += joint[0] + ' ';
		dataString += joint[1] + ' ';
		dataString += joint[2] + ' ';
		dataString += joint[3] + ' ';
		dataString += joint[4] + '\n';
		count += 1;
	}

	// write properties block of input file


	// write member data block of input file

	
	// write loads block of input file


	return dataString;

};