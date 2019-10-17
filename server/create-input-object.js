function createInputObject(obj) {

	let inputObject = {};
	inputObject.numJoints = Number(obj.numJoints);
	inputObject.numMembers = Number(obj.numMembers);
	inputObject.numElasticModulus = Number(obj.numElasticModulus);
	inputObject.numAreas = Number(obj.numAreas);
	inputObject.numMomentOfInertia = Number(obj.numMomentOfInertia);
	inputObject.numLoadCases = Number(obj.numLoadCases);
	
	inputObject.joints = [];



	return inputObject;
}

module.exports = createInputObject;



// Joints:
// '1 0   288   1 1 1\r\n2 150 288   0 0 0\r\n3 300 288   0 0 0\r\n4 342 144   0 0 0\r\n5 384 0     1 1 1',
// ElasticMods: '1 29000',
// Areas: '1 15',
// MoI: '1 800',
// Members: '1 1 2 1 1 1\r\n2 2 3 1 1 1\r\n3 3 4 1 1 1\r\n4 4 5 1 1 1',
// Loads: '1 2\r\n3 0 0 960\r\n1 0 0 -0.1667\r\n2 0 0 -0.1667'