//************************************** DOCUMENT READY ******************************************/
//************************************************************************************************/

$(document).ready(function() {

  const ns = 'http://www.w3.org/2000/svg';
  const node = document.createElementNS(ns, 'circle');
  node.setAttributeNS(null, "id","joint");
  node.setAttributeNS(null, "r", "5");

  let box = $('#structure-window');
  node.setAttributeNS(null, "cx", "300");
  node.setAttributeNS(null, "cy","300");
  box.append(node);

});

$(document).change(function() {

  $('.joint').change(function() {
    let windowWidth = $('#structure-window').width();
    let windowHeight = $('#structure-window').height();
    let jointArray = $('.joint').map(function() {
      return Number(this.value);
    }).get();

    console.log('jointArray: ', jointArray);
    displayJoints(jointArray, windowWidth, windowHeight);
  });

  // $('.member').change(function() {
  //   let memberArray = $('.member').map(function() {
  //     return Number(this.value);
  //   }).get();
  //   console.log('member array: ', memberArray);
  // });
});

//**************************************** FUNCTIONS *********************************************/
//************************************************************************************************/

function displayJoints(arr, windowWidth, windowHeight) {
  const verticalPadding = 0.1 * windowHeight;
  const horizontalPadding = 0.1 * windowWidth;
  console.log('windowWidth: ', windowWidth);
  console.log('windowHeight: ', windowHeight);
  let max = Math.max(...arr);
  let min = Math.min(...arr);
  console.log('max: ', max);
  console.log('min: ', min);
  for(let i = 1; i <= arr.length; i += 2){
    console.log(arr[i]);
  }

}




// var ns = 'http://www.w3.org/2000/svg';
// var div = document.getElementById('drawing');
// var svg = document.createElementNS(ns, 'svg');
// svg.setAttributeNS(null, 'width', '100%');
// svg.setAttributeNS(null, 'height', '100%');
// div.appendChild(svg);
// var rect = document.createElementNS(ns, 'rect');
// rect.setAttributeNS(null, 'width', 100);
// rect.setAttributeNS(null, 'height', 100);
// rect.setAttributeNS(null, 'fill', '#f06');
// svg.appendChild(rect);

