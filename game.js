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
  keystate.up = false
  keystate.down = false
  keystate.left = false
  keystate.right = false

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
    'posx': [WIDTH/2],
    'posy': [HEIGHT/2],
    'size': 5,

    'move': (dposx, dposy, sstep=true) => {
      if (sstep) {
        if (dposx ^ dposy == 0) {
          throw "Invalid move parameters"
        }
        objs.snake.posx.shift()
        objs.snake.posx.push(objs.snake.posx[objs.snake.posx.length - 1] + dposx * size)
        objs.snake.posy.shift()
        objs.snake.posy.push(objs.snake.posy[objs.snake.posy.length - 1] + dposy * size)
      } else {
        objs.snake.posx.shift()
        objs.snake.posx.push(dposx)
        objs.snake.posy.shift()
        objs.snake.posy.push(dposy)
      }
    },

    'grow': (nposx, nposy, sstep=true) => {
      if (sstep) {
        objs.snake.posx.push(objs.snake.posx[objs.snake.posx.length - 1] + dposx * size)
        objs.snake.posy.push(objs.snake.posy[objs.snake.posy.length - 1] + dposy * size)
      } else {
        objs.snake.posx.push(nposx)
        objs.snake.posy.push(nposy)
      }
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
  Mousetrap.bind('up', () => {
    keystate.up = true
    keystate.down = false
    keystate.left = false
    keystate.right = false
  })
  Mousetrap.bind('down', () => {
    keystate.up = false
    keystate.down = true
    keystate.left = false
    keystate.right = false
  })
  Mousetrap.bind('left', () => {
    keystate.up = false
    keystate.down = false
    keystate.left = true
    keystate.right = false
  })
  Mousetrap.bind('right', () => {
    keystate.up = false
    keystate.down = false
    keystate.left = false
    keystate.right = true
  })

  // Updating spectator object
  if (keystate.up) {
    objs.spectator.posy -= SPEED
  }
  if (keystate.down) {
    objs.spectator.posy += SPEED
  }
  if (keystate.left) {
    objs.spectator.posx -= SPEED
  }
  if (keystate.right) {
    objs.spectator.posx += SPEED
  }

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