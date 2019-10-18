function createInputObject(obj) {

	let inputObject = {};
	inputObject.numJoints = Number(obj.numJoints);
	inputObject.numMembers = Number(obj.numMembers);
	inputObject.numElasticModulus = Number(obj.numElasticModulus);
	inputObject.numAreas = Number(obj.numAreas);
	inputObject.numMomentOfInertia = Number(obj.numMomentOfInertia);
	inputObject.numLoadCases = Number(obj.numLoadCases);
	inputObject.joints = extractJoints(obj.Joints);
	inputObject.elasticMods = extractProperties(obj.ElasticMods);
	inputObject.areas = extractProperties(obj.Areas);
	inputObject.MoI = extractProperties(obj.MoI);
	inputObject.loads = extractLoads(obj.Loads);

	return inputObject;
}

function extractJoints(data) {
	let resultArr = [];
	let tempArr = data.split('\r\n').map(e => e.split(' '));
	for (let joint of tempArr) {
		let arr = [];
		for (let i = 1; i < joint.length; i++) {
			if (joint[i] === '') {
				continue;
			} else {
				arr.push(Number(joint[i]));
			}
		}
		resultArr.push(arr);
	}
	return resultArr;
}

function extractProperties(data) {
	let resultArr = [];
	let tempArr = data.split('\r\n').map(e => e.split(' '));
	for (let item of tempArr) {
		resultArr.push(Number(item[1]));
	}
	return resultArr;
}

function extractLoads(data) {
	let tempArr = data.split('\r\n').map(e => e.split(' '));
	for (let item of tempArr) {
		for (let i = 0; i < item.length; i++) {
			item[i] = Number(item[i]);
		}
	}
	return tempArr;
}


module.exports = createInputObject;

// Loads: '1 2\r\n3 0 0 960\r\n1 0 0 -0.1667\r\n2 0 0 -0.1667\r\n2 1\r\n2 0 -45 0\r\n3 0 0 550\r\n2 0 0 -0.505'

// [ 
//	[ '1', '2' ],
//	[ '3', '0', '0', '960' ],
//	[ '1', '0', '0', '-0.1667' ],
//	[ '2', '0', '0', '-0.1667' ],
//	[ '2', '1' ],
//	[ '2', '0', '-45', '0' ],
//	[ '3', '0', '0', '550' ],
//	[ '2', '0', '0', '-0.505' ]
// ]