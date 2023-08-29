// ----------------------- Main Classes
class Point {
  constructor(x, y, locked = false) {
    this.position = new Vec2(x, y);
    this.prevPosition = this.position;
    this.locked = locked;
    this.active = true
  }
  isHovered(){
    return Math.sqrt(Math.pow(mouseX - this.position.x, 2) + Math.pow(mouseY - this.position.y, 2)) < 5
  }
}
class Stick {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.len = Math.sqrt(Math.pow(this.pointB.position.x - this.pointA.position.x, 2) + Math.pow(this.pointB.position.y - this.pointA.position.y, 2));
    this.active = true
  }
}
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other){
    return new Vec2(
      this.x + other.x,
      this.y + other.y
    )
  }
  div(other){
    return new Vec2(
      this.x / other.x,
      this.y / other.y
    )
  }
  sub(other){
    return new Vec2(
      this.x - other.x,
      this.y - other.y
    )
  }
  mult(other){
    return new Vec2(
      this.x * other.x,
      this.y * other.y
    )
  }
  normalized(){
    const len = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    return new Vec2(this.x / len, this.y / len)
  }
}

// ---------------------- Rendering
class col {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
class aARect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update();
  }

  update() {
    this.points = [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x + this.width, this.y + this.height],
      [this.x, this.y + this.height],
    ];
  }
}
function drawPoint(x, y, radius, ctx, color = new col(0, 0, 0)) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, width, ctx, color = new col(0, 0, 0)) {
  ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawPoly(points, ctx, borderWidth, color = new col(0, 0, 0), filled = false, fillCol = new col(0, 0, 0)) {
  if (!filled) {
    //Draw the edges of the polygon
    for (let i = 0; i < points.length - 1; i++) {
      drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], borderWidth, ctx, color);
    }
    drawLine(points[points.length - 1][0], points[points.length - 1][1], points[0][0], points[0][1], borderWidth, ctx, color);
  } else {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.fillStyle = `rgb(${fillCol.r}, ${fillCol.g}, ${fillCol.b}, ${fillCol.a})`;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    //Add verticies
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fill();
  }
}

// ---------------------- Main Funcs
function drawPoints(points) {
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    let pColor = new col(0, 255, 0)
    if(i == mouseHovered){
      if(p.locked){
        pColor = new col(255, 150, 150)
      } else {
        pColor = new col(150, 150, 150)
      }
    } else {
      if(p.locked){
        pColor = new col(255, 0, 0)
      } else {
        pColor = new col(0, 0, 0)
      }
    }
    if(p.active){
      drawPoint(p.position.x, p.position.y, 3, ctx, pColor);
    }
  }
}
function drawSticks(sticks) {
  for (let i = 0; i < sticks.length; i++) {
    const s = sticks[i];
    if(sticks[i].active){
      drawLine(s.pointA.position.x, s.pointA.position.y, s.pointB.position.x, s.pointB.position.y, 2, ctx, new col(0, 0, 0));
    }
  }
}
function startSim() {
  state = 'sim'
  simulate()
  document.querySelector('button').style.display = 'none'
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function deg2rad(x){
  return x * Math.PI / 180
}

function rad2deg(x){
  return x * 180 / Math.PI
}

function generatePoints(nodeCount, length, x, y, angle){
  let nodes = []
  for(let i = 0; i < nodeCount; i++){
    nodes.push(new Point(
      x + lerp(0, Math.cos(deg2rad(angle)), i / nodeCount) * length,
      y + lerp(0, Math.sin(deg2rad(angle)), i / nodeCount) * length,
      i == 0
    ))
  }
  return nodes
}

function generateRope(nodeCount, length, x, y, angle){
  points.push(...generatePoints(nodeCount - 1, length, x, y, angle))
  points.push(new Point(multiStartX, multiStartY, false))
  points[points.length - nodeCount].locked = false
  for(let i = points.length - nodeCount; i < points.length - 1; i++){
    sticks.push(new Stick(points[i], points[i + 1]))
  }
}

function index2coords(index, width){
  return {
    y: index % width,
    x: Math.floor(index / width - 1) + 1
  }
}

function coords2index(x, y, width){
  return y + (x * width)
}

function generateSquareCloth(x, y, nWidth, nHeight, width, height, pinInterval){
  points = []
  sticks = []
  for(let i = 0; i < nWidth; i++){
    points.push(...generatePoints(nHeight, height, x + lerp(0, width, i / nWidth), y, 90))
  }
  for(let i = 0; i < nHeight - 1; i++){
    for(let j = 0; j < nWidth; j++){
      sticks.push(new Stick(points[coords2index(j, i, nWidth)], points[coords2index(j, i + 1, nWidth)]))
    }
  }
  for(let i = 0; i < nHeight; i++){
    for(let j = 0; j < nWidth - 1; j++){
      sticks.push(new Stick(points[coords2index(j, i, nWidth)], points[coords2index(j + 1, i, nWidth)]))
    }
  }
  for(let i = 0; i < nWidth; i++){
    if(i % pinInterval != 0){
      points[coords2index(i, 0, res)].locked = false
    }
  }
}

function lerp(a, b, t){
  return a * (1 - t) + b * t
}

function updatePointHovered(){
  mouseHovered = -1
  for(let i = 0; i < points.length; i++){
    if(points[i].isHovered() && points[i].active){
      mouseHovered = i
    }
  }
}

function deletePoint(p){
  for(let i = 0; i < sticks.length; i++){
    if(sticks[i].pointA == points[p] || sticks[i].pointB == points[p]){
      sticks[i].active = false
    }
  }
  points[p].active = false
}
function deleteStick(s){
  sticks[s].active = false
}

function initEventListeners(){
  rect = canvas.getBoundingClientRect()
  document.onkeydown = evt => {
    if(evt.key == 'Delete'){
      points = []
      sticks = []
    }
    if(evt.key == ' '){
      evt.preventDefault()
      if(multiStartX == null && state == 'setup'){
        multiStartX = mouseX
        multiStartY = mouseY
      }
    }
    if(!keysDown.includes(evt.key)){
      keysDown.push(evt.key)
    }
  }
  document.onkeyup = evt => {
    if(keysDown.includes(evt.key)){
      keysDown.splice(keysDown.indexOf(evt.key), 1)
    }
    if(evt.key = ' '){
      if((multiStartX != null || multiStartX == 0) && state == 'setup'){
        const numNodes = parseInt(window.prompt("Enter number of nodes to add. Enter any non-number to cancel"))
        if(!isNaN(numNodes)){
          generateRope(
            numNodes, 
            Math.sqrt(Math.pow(multiStartX - mouseX, 2) + Math.pow(multiStartY - mouseY, 2)), 
            mouseX,
            mouseY,
            rad2deg(Math.atan2((multiStartY - mouseY), (multiStartX - mouseX)))
          )
        }
        multiStartX = null
        multiStartY = null
      }
    }
  }
  document.onblur = evt => {
    keysDown = []
  }
  canvas.addEventListener('contextmenu', evt => {
    evt.preventDefault()
  })
  document.onmouseup = evt => {
    if(state == 'sim' && evt.button == 1){
      mmbd = false
      for(let i = 0; i < sticks.length; i++){
        for(let j = 0; j < cutPath.length - 1; j++){
          if(getIntersection(cutPath[j], cutPath[j + 1], sticks[i].pointA.position, sticks[i].pointB.position)){
            deleteStick(i)
          }
        }
      }
    }
  }
  canvas.onmousedown = evt => {
    if(evt.button == 2){
      if(mouseHovered == -1 && state == 'setup'){
        points.push(new Point(evt.clientX - rect.left, evt.clientY - rect.top, true))
      }
      if(mouseHovered != -1){
        if(!points[mouseHovered].locked){
          points[mouseHovered].locked = true
        }
      }
    }
    if(evt.button == 0){
      if(mouseHovered == -1 && state == 'setup'){
        points.push(new Point(evt.clientX - rect.left, evt.clientY - rect.top, false))
      }
      if(mouseHovered != -1){
        if(points[mouseHovered].locked){
          points[mouseHovered].locked = false
        }
      }
    }
    if(evt.button == 1){
      evt.preventDefault()

      if(state == 'setup'){
        if(dragStartX == null && dragStartY == null && mouseHovered != -1){
          dragStartX = points[mouseHovered].position.x
          dragStartY = points[mouseHovered].position.y
          dragStartPoint = mouseHovered
        } else if(mouseHovered != dragStartPoint && mouseHovered != -1) {
          sticks.push(new Stick(points[dragStartPoint], points[mouseHovered]))
          dragStartPoint = null
          dragStartX = null
          dragStartY = null
        } else if(dragStartX != null){
          points.push(new Point(mouseX, mouseY, false))
          sticks.push(new Stick(points[dragStartPoint], points[points.length - 1]))
          dragStartPoint = null
          dragStartX = null
          dragStartY = null
        } else {
          dragStartPoint = null
          dragStartX = null
          dragStartY = null
        }
      }
      if(state == 'sim'){
        mmbd = true
      }
    }
    if((evt.button == 0 || evt.button == 2) && (keysDown.includes('Backspace') || keysDown.includes('x'))){
      if(mouseHovered != -1){
        deletePoint(mouseHovered)
      }
    }
  }
  document.onmousemove = evt => {
    mouseX = evt.clientX - rect.left
    mouseY = evt.clientY - rect.top
  }
}

function updateSettings(){
  numIterations = document.getElementById('rigid').value
}

function connectAll(){
  let sticksToAdd = []
  for(let i = 0; i < points.length - 1; i++){
    if(points[i].active && points[i + 1].active){
      sticksToAdd.push(new Stick(points[i], points[i + 1]))
    }
  }
  sticks = sticksToAdd
}

// ---------------------- Main Loop
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const gravity = 1
const res = 31

let numIterations = 30

let points = [];
let sticks = [];

let keysDown = []

let mouseX, mouseY = 0
let mouseHovered = -1

let dragStartX = null;
let dragStartY = null;
let dragStartPoint = null;

let multiStartX = null;
let multiStartY = null;

let cutPath = []

let wind = 0

let state = 'setup'

let mmbd = false

function setup(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePointHovered()

  drawPoints(points);
  drawSticks(sticks);

  if(dragStartX != null){
    drawLine(mouseX, mouseY, points[dragStartPoint].position.x, points[dragStartPoint].position.y, 2, ctx, new col(150, 150, 150))
  }
  if(multiStartX != null){
    drawLine(mouseX, mouseY, multiStartX, multiStartY, 2, ctx, new col(0, 0, 0))
  }

  if ((state == 'setup')) {
    requestAnimationFrame(setup);
  }
}

function simulate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if(mmbd){
    cutPath.push({x: mouseX, y: mouseY})
  } else {
    cutPath = []
  }

  for(let i = 0; i < points.length; i++){
    const p = points[i]
    if(!p.locked && p.active){
      positionBeforeUpdate = p.position
      p.position = p.position.add(p.position.sub(p.prevPosition))
      p.position.y += gravity
      p.position.x += wind
      p.prevPosition = positionBeforeUpdate
    }
  }

  for(let i = 0; i < numIterations; i++){
    for(let j = 0; j < sticks.length; j++){
      const s = sticks[j]
      if(s.active){
        stickCentre = new Vec2(s.pointA.position.x, s.pointA.position.y)
        .add(new Vec2(s.pointB.position.x, s.pointB.position.y))
        .div(new Vec2(2, 2))
        stickDir = s.pointA.position.sub(s.pointB.position).normalized()
        if(!s.pointA.locked){
          s.pointA.position = stickCentre.add(stickDir.mult(new Vec2(s.len, s.len)).div(new Vec2(2, 2)))
        }
        if(!s.pointB.locked){
          s.pointB.position = stickCentre.sub(stickDir.mult(new Vec2(s.len, s.len)).div(new Vec2(2, 2)))
        }
      }
    }
  }

  updatePointHovered()

  drawPoints(points);
  drawSticks(sticks);

  for(let i = 0; i < cutPath.length - 1; i++){
    drawLine(cutPath[i].x, cutPath[i].y, cutPath[i + 1].x, cutPath[i + 1].y, 2, ctx, new col(150, 150, 150))
  }
  if(multiStartX != null){
    drawLine(mouseX, mouseY, multiStartX, multiStartY, 2, ctx, new col(0, 0, 0))
  }
  if(state = 'sim'){
    requestAnimationFrame(simulate)
  }
}

initEventListeners();
setup();
generateSquareCloth(20, 20, res, res, 380, 300, 6)
