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
  keystate.paused = false

  // Initialising snake object
  objs.snake = {
    'posx': [WIDTH/2],
    'posy': [HEIGHT/2],
    'size': 10,

    'hasCollided': (cx, cy) => {
      if (cx > WIDTH || cy > HEIGHT) {
        return true
      }
      if (cx < 0 || cy < 0) {
        return true
      }
      for (let i = 0; i < objs.snake.posx.length; ++i) {
        if (objs.snake.posx[i] == cx &&
            objs.snake.posy[i] == cy) {
          return true
        }
      }
      return false
    },

    'canEat' : (cx, cy) => {
      if (cx == objs.snake.posx[objs.snake.posx.length - 1] && 
          cy == objs.snake.posy[objs.snake.posy.length - 1]) {
        return true
      }
      return false
    },

    'move': (dposx, dposy, sstep=true) => {
      if (sstep) {
        if (dposx == dposy) {
          throw `Invalid move parameters (${dposx}, ${dposy})`
        }
        const newx = objs.snake.posx[objs.snake.posx.length - 1] + dposx * objs.snake.size
        const newy = objs.snake.posy[objs.snake.posy.length - 1] + dposy * objs.snake.size
        if (objs.snake.hasCollided(newx, newy)) {
          throw "Game Over"
        }
        objs.snake.posx.push(newx)
        objs.snake.posy.push(newy)
        objs.snake.posx.shift()
        objs.snake.posy.shift()
      } else {
        if (objs.snake.hasCollided(dposx, dposy)) {
          throw "Game Over"
        }
        objs.snake.posx.push(dposx)
        objs.snake.posy.push(dposy)
        objs.snake.posx.shift()
        objs.snake.posy.shift()
      }
    },

    'grow': (nposx, nposy, sstep=true) => {
      if (sstep) {
        objs.snake.posx.push(objs.snake.posx[objs.snake.posx.length - 1] + dposx * objs.snake.size)
        objs.snake.posy.push(objs.snake.posy[objs.snake.posy.length - 1] + dposy * objs.snake.size)
      } else {
        objs.snake.posx.push(nposx)
        objs.snake.posy.push(nposy)
      }
    },

    'draw': () => {
      for (let i = 0; i < objs.snake.posx.length; ++i) {
        drawCircle(
          objs.snake.posx[i], objs.snake.posy[i], 
          objs.snake.size / 2, 'green', false
        )
      }
    },
  }

  objs.food = {
    'posx': (Math.floor(Math.random() * (WIDTH -10) / 10) + 1) * 10,
    'posy': (Math.floor(Math.random() * (HEIGHT - 10) / 10) + 1) * 10,
    'size': 8,

    'generate': () => {
      objs.food.posx= (Math.floor(Math.random() * (WIDTH - 10)) + 10) % 10
      objs.food.posy= (Math.floor(Math.random() * (HEIGHT - 10)) + 10) % 10
    },

    'draw': () => {
      drawCircle(
        objs.food.posx, objs.food.posy,
        objs.food.size / 2, 'red', true
      )
    }
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
  Mousetrap.bind('space', () => {
    keystate.paused = !keystate.paused
  })

  if (!keystate.paused) {
    // Updating spectator object
    if (keystate.up) {
      // objs.spectator.posy -= SPEED
      objs.snake.move(0, -1)
    }
    if (keystate.down) {
      objs.snake.move(0, 1)
    }
    if (keystate.left) {
      objs.snake.move(-1, 0)
    }
    if (keystate.right) {
      objs.snake.move(1, 0)
    }

    // Clearing screen
    drawRectangle(0, 0, WIDTH, HEIGHT, 'white', true)

    // Drawing all objects
    for (let obj in objs) {
      objs[obj].draw()
    }
  }

  // Looping back
  setTimeout(gameLoop, 50)
}

function gameMain() {
  gameInit()
  gameLoop()
}

// To export variables to main.js
module.exports = { WIDTH: WIDTH, HEIGHT: HEIGHT, DEBUG: DEBUG }