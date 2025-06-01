const cv = require('opencv4nodejs');

console.log('OpenCV version:', cv.version);

const mat = new cv.Mat(3, 3, cv.CV_8UC3, [255, 0, 0]); // Matriz 3x3 com cor azul (BGR)

console.log('Matrix data:');
console.log(mat.getDataAsArray());

console.log('hello world')