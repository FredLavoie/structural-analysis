export async function validateForm() {
  const NumJ = document.querySelector('#input-numJoints');
  const NumM = document.querySelector('#input-numMembers');
  const NumEMs = document.querySelector('#input-numEMs');
  const NumA = document.querySelector('#input-numAreas');
  const NumMoI = document.querySelector('#input-numMOIs');

  const allEM = document.querySelectorAll('.input-EM');
  const allAreas = document.querySelectorAll('.input-Area');
  const allMoI = document.querySelectorAll('.input-MoI');

  const allJointsClasses = document.querySelectorAll('.joint');
  const allMembersClasses = document.querySelectorAll('.member');
  const allSupportsClasses = document.querySelectorAll('.supports');
  const allNumPropClasses = document.querySelectorAll('.num-prop');
  const allJLJ = document.querySelectorAll('.jl-j');
  const allJLX = document.querySelectorAll('.jl-x');
  const allJLY = document.querySelectorAll('.jl-y');
  const allJLM = document.querySelectorAll('.jl-m');
  const allMLM = document.querySelectorAll('.ml-m');
  const allMLXD = document.querySelectorAll('.ml-xd');
  const allMLPL = document.querySelectorAll('.ml-pl');
  const allMLUDL = document.querySelectorAll('.ml-udl');

  // eslint-disable-next-line no-useless-escape
  const specChar = /[!@#$%^&*()_+=\[\]{};':"\\|,<>\/?]+/;
  const alphaChar = /[a-zA-Z]/;
  let errorBool = true;


  if (Number(NumJ.value) < 0 || NumJ.value === '' || !Number.isInteger(Number(NumJ.value))) {
    NumJ.className = 'input-style form-control error';
    errorBool = false;
  } else if (NumJ.classList.contains('error')) {
    NumJ.className = 'input-style form-control';
  }

  if (Number(NumM.value) < 0 || NumM.value === '' || !Number.isInteger(Number(NumM.value))) {
    NumM.className = 'input-style form-control error';
    errorBool = false;
  } else if (NumM.classList.contains('error')) {
    NumM.className = 'input-style form-control';
  }

  if (Number(NumEMs.value) < 0 || NumEMs.value === '' || !Number.isInteger(Number(NumEMs.value))) {
    NumEMs.className = 'input-style form-control error';
    errorBool = false;
  } else if (NumEMs.classList.contains('error')) {
    NumEMs.className = 'input-style form-control';
  }

  if (Number(NumA.value) < 0 || NumA.value === '' || !Number.isInteger(Number(NumA.value))) {
    NumA.className = 'input-style form-control error';
    errorBool = false;
  } else if (NumA.classList.contains('error')) {
    NumA.className = 'input-style form-control';
  }

  if (Number(NumMoI.value) < 0 || NumMoI.value === '' || !Number.isInteger(Number(NumMoI.value))) {
    NumMoI.className = 'input-style form-control error';
    errorBool = false;
  } else if (NumMoI.classList.contains('error')) {
    NumMoI.className = 'input-style form-control';
  }

  allEM.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control input-EM error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control input-EM';
    }
  });

  allAreas.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control input-Area error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control input-Area';
    }
  });

  allMoI.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control input-MoI error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control input-MoI';
    }
  });

  allJointsClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e')) {
      ea.className = 'input-style form-control joint error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint';
    }
  });

  allMembersClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control member error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member';
    }
  });

  allSupportsClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value)) || Number(ea.value) > 1) {
      ea.className = 'input-style form-control supports error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control supports';
    }
  });

  allNumPropClasses.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control num-prop error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control num-prop';
    }
  });

  allJLJ.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control joint-loads jl-j error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-j';
    }
  });

  allJLX.forEach((ea) => {
    if (ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control joint-loads jl-x error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-x';
    }
  });

  allJLY.forEach((ea) => {
    if (ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control joint-loads jl-y error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-y';
    }
  });

  allJLM.forEach((ea) => {
    if (ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control joint-loads jl-m error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control joint-loads jl-m';
    }
  });

  allMLM.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || ea.value.includes('e') || !Number.isInteger(Number(ea.value))) {
      ea.className = 'input-style form-control member-loads ml-m error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads ml-m';
    }
  });

  allMLXD.forEach((ea) => {
    if (Number(ea.value) < 0 || ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control member-loads ml-xd error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mlxd';
    }
  });

  allMLPL.forEach((ea) => {
    if (ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control member-loads ml-pl error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mlpl';
    }
  });

  allMLUDL.forEach((ea) => {
    if (ea.value === '' || specChar.test(ea.value) || alphaChar.test(ea.value)) {
      ea.className = 'input-style form-control member-loads ml-udl error';
      errorBool = false;
    } else if (ea.classList.contains('error')) {
      ea.className = 'input-style form-control member-loads mludl';
    }
  });

  return errorBool;
}