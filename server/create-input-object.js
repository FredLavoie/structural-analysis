module.exports = function (obj) {

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
};

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
