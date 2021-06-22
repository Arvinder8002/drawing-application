const canvas = document.querySelector("canvas");
const clearBtn = document.querySelector(".clear-btn");
const undoBtn = document.querySelector(".undo-btn");
const drawingArray = [];
let index = -1;
const c = canvas.getContext("2d");
let isDrawing;
let lastX;
let lastY;
let value;
let lwidth = 5;
let scrollTop;
const color = document.querySelector("#color");
const background = document.querySelector("#background");
const canvasBackground = "#fff";
canvas.style.backgroundColor = canvasBackground;
const range = document.querySelector('[type="range"]');
const checkbox = document.querySelector('[type="checkbox"]');
if (checkbox.checked) checkbox.click();

//removing intro screen 
const intro = document.querySelector('.intro')
setTimeout(() => {
  intro.remove();
}, 5000)

function init() {
  canvas.width = innerWidth - 40;
  canvas.height = innerHeight - 40;
}
//resizing the  canvas
function resize() {
  let W = canvas.width,
    H = canvas.height;
  let temp = c.getImageData(0, 0, W, H);
  c.canvas.width = window.innerWidth - 40;
  c.canvas.height = window.innerHeight - 60;
  W = canvas.width;
  H = canvas.height;
  c.putImageData(temp, 0, 0);
}

init();
addEventListener("resize", resize);

const html = document.querySelector('html');
function getCoordinates(e) {
  if (e.type.includes('mouse')) {
    return {
      x: e.offsetX + 0.5,
      y: e.offsetY + 0.5
    }
  }
  else {
    return {
      x: (e.touches[0].clientX - e.target.offsetLeft) + 0.5,
      y: e.touches[0].clientY - e.target.offsetTop + html.scrollTop + 0.5
    }
  }
}

//event listeners
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const coordinates = getCoordinates(e);
  lastX = coordinates.x;
  lastY = coordinates.y;
  draw(e);
});
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  index += 1;
  drawingArray.push(c.getImageData(0, 0, canvas.width, canvas.height));
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDrawing = true;
  const coordinates = getCoordinates(e);
  lastX = coordinates.x;
  lastY = coordinates.y;
  draw(e);
  console.log(e)
});
canvas.addEventListener("touchmove", draw);

canvas.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  isDrawing = false;
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  isDrawing = false;
  index += 1;
  drawingArray.push(c.getImageData(0, 0, canvas.width, canvas.height));
});

//colorfull line
const colorfulcheckbox = document.querySelector("#colorful");
if (colorfulcheckbox.checked) colorfulcheckbox.click();
let change = 1;
function selectColorful() {
  if (colorfulcheckbox.checked) {
    if (checkbox.checked) checkbox.click();
  }
}

//draw function
function draw(e) {
  e.preventDefault();
  //c.save();
  if (!isDrawing) return;
  c.beginPath();
  c.moveTo(lastX, lastY);
  const coordinates = getCoordinates(e);
  c.lineTo(coordinates.x, coordinates.y);
  if (colorfulcheckbox.checked) {
    c.strokeStyle = `hsl(${change},50%,50%)`;
  } else {
    c.strokeStyle = value;
  }
  c.lineWidth = lwidth;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.stroke();
  lastX = coordinates.x;
  lastY = coordinates.y;
  change += 2;
  //c.restore();
}

//erasing the content
function erase() {
  if (checkbox.checked) {
    if (colorfulcheckbox.checked) colorfulcheckbox.click();
    value = canvasBackground;
  } else {
    changeColor();
  }
}

//changing color of the lines
function changeColor() {
  value = color.value;
}
changeColor();

const h4 = document.querySelector("h4");
//changing width of the line
function changeWidth() {
  lwidth = range.value;
  h4.innerText = range.value;
}
changeWidth();

//saving the contents of the canvas
const sbutton = document.querySelector(".saveButton");
sbutton.addEventListener("click", save);
function save() {
  c.fillStyle = canvasBackground;
  c.globalCompositeOperation = "destination-over";
  c.fillRect(0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/png");
  sbutton.href = url;
}

clearBtn.addEventListener("click", () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
});

undoBtn.addEventListener("click", () => {
  if (index <= 0) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  index -= 1;
  drawingArray.pop();
  c.putImageData(drawingArray[index], 0, 0);
});

if (window.innerWidth < 450) {
  window.removeEventListener('resize', resize)
  canvas.height = innerHeight - 60;
  canvas.width = innerWidth - 20;
}
