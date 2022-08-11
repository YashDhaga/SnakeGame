var lastRenderTime = 0
var gameOver = false
const gameBoard = document.getElementById('game-board')
const EXPANSION_RATE = 1
var result = 0
var score = document.getElementById('score')
const SNAKE_SPEED = 5
const snakeBody = [{ x: 11, y: 11 }]
var newSegments = 0
var GRID_SIZE = 21
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }
// var snakeDiv = document.querySelector('.snake')
// console.log(snakeDiv)

function main(currentTime) {
  if (gameOver) {
    // if (confirm('You lost. Press OK to restart. ')) {
    //   window.location = '/'
    // }
    gameBoard.id = 'end'
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild)
    }
    var result = document.getElementById('result')
    var body = document.querySelector('body')
    body.style.backgroundColor = 'red'
    result.style.display = 'block'
    return
  }
  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return

  lastRenderTime = currentTime
  //console.log(secondsSinceLastRender)

  update()
  draw()
}
window.requestAnimationFrame(main)

var food = getRandomFoodPosition()

function update() {
  // console.log("hi");
  updateSnake()
  updateFood()
  checkDeath()
}

function draw() {
  gameBoard.innerHTML = ''
  drawSnake(gameBoard)
  drawFood(gameBoard)
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}

function updateFood() {
  if (onSnake(food)) {
    result++
    score.innerHTML = `Score: ${result}`
    expandSnake(EXPANSION_RATE)
    food = getRandomFoodPosition()
  }
}

function drawFood(gameBoard) {
  const foodElement = document.createElement('div')
  foodElement.style.gridRowStart = food.y
  foodElement.style.gridColumnStart = food.x
  foodElement.classList.add('food')
  gameBoard.appendChild(foodElement)
}

function getRandomFoodPosition() {
  let newFoodPosition
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition()
  }
  return newFoodPosition
}

// updates coordinates of snake
function updateSnake() {
  addSegments()
  const inputDirection = getInputDirection()
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] } // spread operator [== .splice()]
  }

  snakeBody[0].x += inputDirection.x
  snakeBody[0].y += inputDirection.y // y += 1 => moving down, y -= 1 => moving up
}

function drawSnake(gameBoard) {
  // snakeBody.forEach((segment) => {
  //   const snakeElement = document.createElement('div')
  //   snakeElement.style.gridRowStart = segment.y
  //   snakeElement.style.gridColumnStart = segment.x
  //   snakeElement.classList.add('snake')
  //   gameBoard.appendChild(snakeElement)
  // })

  for (var i = 0; i < snakeBody.length; i++) {
    const snakeElement = document.createElement('div')
    snakeElement.style.gridRowStart = snakeBody[i].y
    snakeElement.style.gridColumnStart = snakeBody[i].x
    if (i == 0) {
      snakeElement.classList.add('snake')
      gameBoard.appendChild(snakeElement)
    } else {
      snakeElement.classList.add('snakeBody')
      gameBoard.appendChild(snakeElement)
      window.snakeBodyDiv = document.querySelectorAll('.snakeBody')
      console.log(snakeBodyDiv)
      var flag = 1
    }
  }
  window.snakeDiv = document.querySelector('.snake')
  // window.snakeBodyDiv = document.querySelector('.snakeBody')

  if (inputDirection.x == -1) {
    window.snakeDiv.classList.add('left')
    if (flag == 1) {
      snakeBodyDiv.forEach((element) => {
        element.classList.add('left')
      })
    }
  } else if (inputDirection.x == 1) {
    window.snakeDiv.classList.add('right')
    if (flag == 1) {
      snakeBodyDiv.forEach((element) => {
        element.classList.add('right')
      })
    }
    if (inputDirection.y == -1) {
      window.snakeDiv.classList.add('up')
      if (flag == 1) {
        snakeBodyDiv.forEach((element) => {
          element.classList.add('up')
        })
      }
    } else if (inputDirection.y == 1) {
      window.snakeDiv.classList.add('down')
      if (flag == 1) {
        snakeBodyDiv.forEach((element) => {
          element.classList.add('down')
        })
      }
    }
  }
}
function expandSnake(amount) {
  newSegments += amount
}

function onSnake(position, { ignoreHead = false } = {}) {
  // console.log("hi");
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index <= 2) return false
    return equalPositions(segment, position)
  })
}

function getSnakeHead() {
  return snakeBody[0]
}

function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true })
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  }
  newSegments = 0
}

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  }
}

function outsideGrid(position) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  )
}

window.addEventListener('keydown', (e) => {
  var snakeDiv = document.querySelector('.snake')
  console.log(e)
  switch (e.key) {
    case 'ArrowUp':
      if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: -1 }
      snakeDiv.classList.add('up')
      break
    case 'ArrowDown':
      if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
      if (lastInputDirection.x !== 0) break
      inputDirection = { x: -1, y: 0 }
      snakeDiv.classList.add('left')
      break
    case 'ArrowRight':
      if (lastInputDirection.x !== 0) break
      inputDirection = { x: 1, y: 0 }
      break
  }
})

function getInputDirection() {
  lastInputDirection = inputDirection
  return inputDirection
}

window.addEventListener('keypress', (e) => {
  var key = e.key
  if (key == ' ') window.location = '/'
})
