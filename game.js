const Mousetrap = require('mousetrap')

const WIDTH = 800
const HEIGHT = 600
const SPEED = 1
const DEBUG = false

let ctx
const objs = {}
const keystate = {}
const gamedata = {}

Number.prototype.pad = function(size) {
  let s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

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

function displayGameData() {
  document.getElementById('gameScore').textContent = `Score: ${gamedata.score}`

  document.getElementById('snakeSize').textContent = `Length: ${objs.snake.posx.length}`

  const timePassed = Math.round((performance.now() - gamedata.time) / 1000)
  if (timePassed < 3600) {
    document.getElementById('gameTime').textContent = 
      `${Math.floor(timePassed / 60)}:` +
      `${(timePassed % 60).pad(2)}`
  } else {
    document.getElementById('gameTime').textContent = 
      `${Math.floor(timePassed / 3600)}:` +
      `${Math.floor((timePassed % 3600) / 60).pad(2)}:` +
      `${(timePassed % 60).pad(2)}`
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
  keystate.pressed = false

  // Initialising game data
  gamedata.score = 0
  gamedata.time = performance.now()

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

    'canEat' : (cx, cy, dposx, dposy, sstep=true) => {
      if (sstep) {
        const newx = objs.snake.posx[objs.snake.posx.length - 1] + dposx * objs.snake.size
        const newy = objs.snake.posy[objs.snake.posy.length - 1] + dposy * objs.snake.size

        if (cx == newx && cy == newy) {
          return true
        }
        return false
      } else {
        if (cx == objs.snake.posx[objs.snake.posx.length - 1] && 
            cy == objs.snake.posy[objs.snake.posy.length - 1]) {
          return true
        }
        return false
      }
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

    'grow': (dposx, dposy, sstep=true) => {
      if (sstep) {
        objs.snake.posx.push(objs.snake.posx[objs.snake.posx.length - 1] + dposx * objs.snake.size)
        objs.snake.posy.push(objs.snake.posy[objs.snake.posy.length - 1] + dposy * objs.snake.size)
      } else {
        objs.snake.posx.push(dposx)
        objs.snake.posy.push(dposy)
      }
      objs.food.generate()
      gamedata.score += objs.snake.posx.length - 1
    },

    'draw': () => {
      let drawSize = objs.snake.size / 2
      for (let i = objs.snake.posx.length - 1; i >= 0; --i) {
        drawCircle(
          objs.snake.posx[i], objs.snake.posy[i], 
          drawSize, 'green', false
        )

        if (i == objs.snake.posx.length - 1)
          --drawSize
      }
    },
  }

  objs.food = {
    'posx': (Math.floor(Math.random() * (WIDTH -10) / 10) + 1) * 10,
    'posy': (Math.floor(Math.random() * (HEIGHT - 10) / 10) + 1) * 10,
    'size': 8,

    'generate': () => {
      objs.food.posx= (Math.floor(Math.random() * (WIDTH -10) / 10) + 1) * 10
      objs.food.posy= (Math.floor(Math.random() * (HEIGHT - 10) / 10) + 1) * 10
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
    if (!keystate.down && !keystate.pressed)
    {
      keystate.up = true
      keystate.down = false
      keystate.left = false
      keystate.right = false
      keystate.pressed = true
    }
  })
  Mousetrap.bind('down', () => {
    if (!keystate.up && !keystate.pressed) {
      keystate.up = false
      keystate.down = true
      keystate.left = false
      keystate.right = false
      keystate.pressed = true
    }
  })
  Mousetrap.bind('left', () => {
    if (!keystate.right && !keystate.pressed) {
      keystate.up = false
      keystate.down = false
      keystate.left = true
      keystate.right = false
      keystate.pressed = true
    }
  })
  Mousetrap.bind('right', () => {
    if (!keystate.left && !keystate.pressed) {
      keystate.up = false
      keystate.down = false
      keystate.left = false
      keystate.right = true
      keystate.pressed = true
    }
  })
  Mousetrap.bind('space', () => {
    if (!keystate.pressed)
    {
      keystate.paused = !keystate.paused
    }
  })

  if (!keystate.paused) {
    // Updating spectator object
    if (keystate.up) {
      if (objs.snake.canEat(objs.food.posx, objs.food.posy, 0, -1)) {
        objs.snake.grow(0, -1)
      } else {
        objs.snake.move(0, -1)
      }
    }
    if (keystate.down) {
      if (objs.snake.canEat(objs.food.posx, objs.food.posy, 0, 1)) {
        objs.snake.grow(0, 1)
      } else {
        objs.snake.move(0, 1)
      }
    }
    if (keystate.left) {
      if (objs.snake.canEat(objs.food.posx, objs.food.posy, -1, 0)) {
        objs.snake.grow(-1, 0)
      } else {
        objs.snake.move(-1, 0)
      }
    }
    if (keystate.right) {
      if (objs.snake.canEat(objs.food.posx, objs.food.posy, 1, 0)) {
        objs.snake.grow(1, 0)
      } else {
        objs.snake.move(1, 0)
      }
    }

    keystate.pressed = false

    // Clearing screen
    drawRectangle(0, 0, WIDTH, HEIGHT, 'white', true)

    // Drawing all objects
    for (let obj in objs) {
      objs[obj].draw()
    }

    // Updating game data
    displayGameData()
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