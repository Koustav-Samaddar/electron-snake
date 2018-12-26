const Mousetrap = require('mousetrap')

const W = 800
const H = 600
const DEBUG = true

let ctx

function drawCircle(x, y, radius, color='black') {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, false)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawLine(xi, yi, xf, yf, color='black') {
  ctx.beginPath()
  ctx.moveTo(xi, yi)
  ctx.lineTo(xf, yf)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawRectangle(x, y, w, h, color='black') {
  ctx.strokeStyle = color
  ctx.strokeRect(x, y, w, h)
}

function gameInit() {
  // Testing basic shape drawing functionality
  drawCircle(W / 2, H / 2, 50, 'blue')
  drawLine(0, 0, 800, 600, 'orange')
  drawRectangle(80, 60, 40, 30, 'green')
}

function gameLoop() {
  // Main game loop
  Mousetrap.bind('up', () => {
      drawCircle(100, 75, 10)
  })
  setTimeout(gameLoop, 1000)
}

function gameMain() {
  ctx = document.getElementById('gameScreen').getContext('2d')

  gameInit()
  gameLoop()
}

// To export variables to main.js
module.exports = { WIDTH: W, HEIGHT: H, DEBUG: DEBUG }