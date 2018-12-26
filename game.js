const Mousetrap = require('mousetrap')

const WIDTH = 800
const HEIGHT = 600
const SPEED = 1
const DEBUG = false

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
  objs.spectator = {
    'posx': WIDTH / 2,
    'posy': HEIGHT / 2,
    'size': 5,

    'draw': () => {
      drawCircle(
        objs.spectator.posx, objs.spectator.posy, 
        objs.spectator.size, 'grey', false
      )
    },
  }

  // TODO: Make snake object
  objs.snake = {
    'posx': [50],
    'posy': [50],
    'size': 5,

    'tick': (nposx, nposy) => {
      objs.snake.posx.shift()
      objs.snake.posx.push(nposx)
      objs.snake.posy.shift()
      objs.snake.posy.push(nposy)
    },

    'grow': (nposx, nposy) => {
      objs.snake.posx.push(nposx)
      objs.snake.posy.push(nposy)
    },

    'draw': () => {
      for (let i = 0; i < objs.snake.posx.length; ++i) {
        drawCircle(
          objs.snake.posx[i], objs.snake.posy[i], 
          objs.snake.size, 'green', false
        )
      }
    },
  }
}

function gameLoop() {
  // Main game loop

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
  objs.spectator.posx += (SPEED * keystate.hor)
  objs.spectator.posy += (SPEED * keystate.ver)

  // TODO: Update game objects

  // Clearing screen
  drawRectangle(0, 0, WIDTH, HEIGHT, 'white', true)

  // Drawing all objects
  for (let obj in objs) {
    objs[obj].draw()
  }

  // Looping back
  setTimeout(gameLoop, 10)
}

function gameMain() {
  gameInit()
  gameLoop()
}

// To export variables to main.js
module.exports = { WIDTH: WIDTH, HEIGHT: HEIGHT, DEBUG: DEBUG }