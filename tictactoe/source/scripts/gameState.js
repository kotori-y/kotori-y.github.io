/**
 * @author Kotori Y
 */

function clone(instance) {
  return Object.assign(
    Object.create(
      // Set the prototype of the new object to the prototype of the instance.
      // Used to allow new object behave like class instance.
      Object.getPrototypeOf(instance),
    ),
    // Prevent shallow copies of nested structures like arrays, etc
    JSON.parse(JSON.stringify(instance)),
  );
}


class TicTacToeState {
  constructor(board, currentPlayer) {
    this.board = board
    this.currentPlayer = currentPlayer
  }
}

TicTacToeState.prototype.takeAction = function (action) {
  let newState = clone(this)
  newState.board[action.x][action.y] = this.currentPlayer
  newState.currentPlayer = this.currentPlayer * -1
  return newState
}

TicTacToeState.prototype.isTerminal = function () {
    for (let row of this.board) {
      if (Math.abs(row.reduce((a, b) => a + b)) === 3) {
        return true
      }
    }

    for (let col = 0; col <= 2; col++) {
      let column = [];
      for (let i = 0; i <= 2; i++) {
        column.push(this.board[i][col]);
      }
      if (Math.abs(column.reduce((a, b) => a + b)) === 3) {
        return true
      }
    }

    for (let n of [0, 2]) {
      let diagonal = []
      for (let i = 0; i <= 2; i++) {
        let j = Math.abs(n - i)
        diagonal.push(this.board[i][j])
      }
      if (Math.abs(diagonal.reduce((a, b) => a + b)) === 3) {
        return true
      }
    }

    return this.board.every(arr => {
      return arr.every(num => {
        return num !== 0
      })
    })
  }

TicTacToeState.prototype.getPossibleActions = function () {
    const possibleActions = []
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        if (this.board[i][j] === 0) {
          const actions = {x: i, y: j, currentPlayer: this.currentPlayer}
          possibleActions.push(actions)
        }
      }
    }
    return possibleActions
  }

TicTacToeState.prototype.getReward = function () {
    let abs_max = 0, reward = 0

    for (let row of this.board) {
      const tmp = row.reduce((a,b) => a+b)
      if (Math.abs(tmp) > abs_max) {
        abs_max = Math.abs(tmp)
        reward = tmp
      }
    }

    for (let col = 0; col <= 2; col++) {
      let column = [];
      for (let i = 0; i <= 2; i++) {
        column.push(this.board[i][col]);
      }
      const tmp = column.reduce((a, b) => a + b)
      if (Math.abs(tmp) > abs_max) {
        abs_max = Math.abs(tmp)
        reward = tmp
      }
    }

    for (let n of [0, 2]) {
      let diagonal = []
      for (let i = 0; i <= 2; i++) {
        let j = Math.abs(n - i)
        diagonal.push(this.board[i][j])
      }
      const tmp = diagonal.reduce((a, b) => a + b)
      if (Math.abs(tmp) > abs_max) {
        abs_max = Math.abs(tmp)
        reward = tmp
      }
    }

    return reward
  }

export default TicTacToeState