const W = 800
const H = 600
const DEBUG = false

function drawCircle(ctx, x, y, radius, color='black') {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, false)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawLine(ctx, xi, yi, xf, yf, color='black') {
  ctx.beginPath()
  ctx.moveTo(xi, yi)
  ctx.lineTo(xf, yf)
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawRectangle(ctx, x, y, w, h, color='black') {
  ctx.strokeStyle = color
  ctx.strokeRect(x, y, w, h)
}

function gameInit(ctx) {
  // Testing basic shape drawing functionality
  drawCircle(ctx, W / 2, H / 2, 50, 'blue')
  drawLine(ctx, 0, 0, 800, 600, 'orange')
  drawRectangle(ctx, 80, 60, 40, 30, 'green')
}

function gameLoop(ctx) {
  // Main game loop
  setTimeout(gameLoop, 1000)
}

function gameMain() {
  const ctx = document.getElementById('gameScreen').getContext('2d')

  gameInit(ctx)
  gameLoop(ctx)
}

// To export variables to main.js
module.exports = { WIDTH: W, HEIGHT: H, DEBUG: DEBUG }