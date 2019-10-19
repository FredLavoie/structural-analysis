module.exports = function (obj) {

	let dataString = '';
	dataString += (
		obj.numJoints.toString() + ' ' +
		obj.numMembers.toString() + ' ' +
		obj.numElasticModulus.toString() + ' ' +
		obj.numAreas.toString() + ' ' +
		obj.numMomentOfInertia.toString() + ' ' +
		obj.numLoadCases.toString() + '\n'
	);
	
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
	
	console.log('dataString inside module:');
	console.log(dataString);
	
	
	// for(let i = 0; i < dataArr.length; i++){
	// 	if(i < 6) {
	// 		dataString += dataArr[i] + ' ';
	// 	} else {
	// 		dataString += '\r\n' + dataArr[i];
	// 	}
	// }

	// return dataString;

};