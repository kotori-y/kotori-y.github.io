/**
 * @author Kotori Y
 */

import TicTacToeState from "./gameState.js";
import MCTS from "./mcts.js";

class Game {
  constructor() {
    this.going = true
    this.mapping = {
      1: [0, 0],
      2: [0, 1],
      3: [0, 2],
      4: [1, 0],
      5: [1, 1],
      6: [1, 2],
      7: [2, 0],
      8: [2, 1],
      9: [2, 2]
    }
    this.searcher = new MCTS(500)
    this.grids = document.querySelectorAll(".grid")
    this.cover = document.querySelector(".cover")
    this.cover.addEventListener("click", () => {
      console.log(323)
      this.startGame()
    })
  }

  computerMove () {
    const grids = document.querySelectorAll(".grid")
    const ans = this.searcher.run(this.state)
    console.log(ans)
    const [x, y] = ans.split("-")

    grids.forEach(elem => {
      const _id = parseInt(elem.id)
      if (this.mapping[_id].join("-") === ans) {
        elem.classList.add("cross")
      }
    })

    return {
      x: x,
      y: y,
      currentPlayer: this.state.currentPlayer
    }
  }

  count() {
    if (this.state.isTerminal()) {
      this.going = false
      this.cover.style.display = "inline-block"
      const score = this.state.getReward()

      switch (score) {
        case 3:
          this.cover.innerHTML = "YOU LOSS"
          break;
        case -3:
          this.cover.innerHTML = "YOU WON"
          break;
        default:
          this.cover.innerHTML = "TIE"
      }

    }
  }

  startGame() {
    console.log("start")
    this.init()

    this.grids.forEach(elem => {
      elem.addEventListener("click", (event) => {

        if (elem.classList.length !== 1) {
          return;
        }

        let _idx = parseInt(elem.id)
        let [x, y] = this.mapping[_idx];

        const action = {
          x: x,
          y: y,
          currentPlayer: this.state.currentPlayer
        }

        this.state = this.state.takeAction(action)
        elem.classList.add("circle")

        this.count()

        if (!this.going) {
          return;
        }

        this.state = this.state.takeAction(this.computerMove(this.searcher, this.state))

        this.count()

      })
    })
  }

  init() {
    this.grids.forEach(elem => {
      elem.classList.remove("circle")
      elem.classList.remove("cross")
    })
    this.going = true
    this.cover.style.display = "none"
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    this.currentPlayer = (Math.random() >= 0.5) ? 1 : -1
    this.state = new TicTacToeState(this.board, this.currentPlayer)
    if (this.currentPlayer === 1) {
      this.state = this.state.takeAction(this.computerMove())
    }
  }

}


const game = new Game()
game.startGame()

// const cover = document.querySelectorAll()