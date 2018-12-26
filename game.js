const Mousetrap = require('mousetrap')

const WIDTH = 800
const HEIGHT = 600
const SPEED = 1
const DEBUG = true

let ctx
const objs = {}
const keystate = {}

function drawCircle(x, y, radius, color='black', isfill=false) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, false)
  
  if (isfill) {
    ctx.fillStyle = color
    ctx.fill()
  } else {
    ctx.strokeStyle = color
    ctx.stroke()
  }
}

function drawLine(xi, yi, xf, yf, color='black') {
  ctx.beginPath()
  ctx.moveTo(xi, yi)
  ctx.lineTo(xf, yf)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawRectangle(x, y, w, h, color='black', isfill=false) {
  if (isfill) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  } else {
    ctx.strokeStyle = color
    ctx.strokeRect(x, y, w, h)
  }
}

function gameInit() {
  // Getting context from canvas element
  ctx = document.getElementById('gameScreen').getContext('2d')
  
  // Initialising control state flags
  keystate.ver  = 0
  keystate.hor  = 0

  // Initialising player object
  objs.player = {
    'shape': 'circle',
    'draw': drawCircle,
    'drawArgs': [WIDTH/2, HEIGHT/2, 5, 'blue', true],
  }
}

function gameLoop() {
  // Main game loop
  const timer = process.hrtime()

  // Handling user input
  Mousetrap.bind('up', () => { keystate.ver-- })
  Mousetrap.bind('down', () => { keystate.ver++ })
  Mousetrap.bind('left', () => { keystate.hor-- })
  Mousetrap.bind('right', () => { keystate.hor++ })
  
  // Applying signum function to keystates
  for (let dir in keystate) {
    if (keystate[dir] != 0) {
      keystate[dir] = Math.sign(keystate[dir])
    }
  }

  // Updating player object
  objs.player.drawArgs[0] += (SPEED * keystate.hor)
  objs.player.drawArgs[1] += (SPEED * keystate.ver)

  // TODO: Update game objects

  // Clearing screen
  drawRectangle(0, 0, WIDTH, HEIGHT, 'black', true)

  // Drawing all objects
  for (let obj in objs) {
    objs[obj].draw(...objs[obj].drawArgs)
  }

  // Looping back
  const elapsed = process.hrtime(timer)[1] / 1000000
  setTimeout(gameLoop, 16 - elapsed)
}

function gameMain() {
  gameInit()
  gameLoop()
}

// To export variables to main.js
module.exports = { WIDTH: WIDTH, HEIGHT: HEIGHT, DEBUG: DEBUG }