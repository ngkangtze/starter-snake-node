// ngrok http 3000

const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'ngkangtze',
    color: '#888888',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body
  //console.log('handleStart: ' + JSON.stringify(gameData, null, 2))

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body

  const head = gameData.you.body[0];
  const neck = gameData.you.body[1];
  //console.log('handleMove: ' + JSON.stringify(gameData, null, 2))

  var possibleMoves = ['up', 'down', 'left', 'right'];
  var thisMove = 'up';
  console.log('CURR X: ' + head.x + ' CURR Y: ' + head.y);

  for (const move of possibleMoves) {
    var coord = moveAsCoord(move, head);
    if (!coordEqual(coord, neck) &&
        !offBoard(gameData, coord)) {
      thisMove = move;
      console.log('TURN: ' + request.body.turn);
      console.log('MOVE: ' + thisMove);
      break;
    }
  }

  response.status(200).send({
    move: thisMove
  })
}

function moveAsCoord(move, head) {
  switch (move) {
    case 'up':
      return {x: head.x, y: head.y+1};
    case 'down':
      return {x: head.x, y: head.y-1};
    case 'left':
      return {x: head.x-1, y: head.y};
    case 'right':
      return {x: head.x+1, y: head.y};
  }
}

function offBoard(state, coord) {
  if (coord.x < 0) return true;
  if (coord.y < 0) return true;
  if (coord.y >= state.board.height) return true;
  if (coord.x >= state.board.height) return true;
  console.log('x: ' + coord.x + ', y: ' + coord.y)
  return false; // If it makes it here we are ok.
}

function coordEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function handleEnd(request, response) {
  var gameData = request.body
  //console.log('handleEnd: ' + JSON.stringify(gameData, null, 2))

  console.log('END')
  response.status(200).send('ok')
}
