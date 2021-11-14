/**
 * @author Kotori Y
 */
import TreeNode from "./treeNode.js";

Object.keys = function (obj) {
  let keys = [],
    k;
  for (k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      keys.push(k);
    }
  }
  return keys;
};

function choose(choices) {
  let index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

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


class MCTS {

  constructor(limitIter, explorationConstant = 1 / Math.sqrt(2)) {
    this.limitIter = limitIter
    this.explorationConstant = explorationConstant
  }


  getBestChild(node, explorationValue) {
    let best_score = -Number.MAX_VALUE
    let best_nodes = []

    for (const [key, child] of Object.entries(node.children)) {
      let score = node.state.currentPlayer * child.total_reward / child.n_visited + explorationValue *
        Math.sqrt(2 * Math.log(node.n_visited) / child.n_visited)
      // debugger

      if (score > best_score) {
        best_score = score
        best_nodes = [child]
      } else if (score === best_score) {
        best_nodes.push(child)
      }
    }
    // console.log(best_nodes)
    // debugger
    return choose(best_nodes)
  }

  select(node) {
    // console.log(789, node)
    while (!node.isTerminal) {
      if (!node.isFullyExpanded) {
        // console.log(456)
        const tmp = this.expand(node)
        // console.log("tmp", tmp)
        return tmp
      }
      node = this.getBestChild(node, this.explorationConstant)
    }
    return node
  }

  expand(node) {
    // console.log(node.state.board)
    // debugger
    const actions = node.state.getPossibleActions()
    for (let action of actions) {
      const {x, y} = action;
      const key = `${x}-${y}`

      if (!node.children.hasOwnProperty(key)) {
        const newNode = new TreeNode(node.state.takeAction(action), node)
        node.children[key] = newNode

        // console.log(actions.length)
        if (Object.keys(node.children).length === actions.length) {
          node.isFullyExpanded = true
        }
        // console.log("new", newNode)
        // debugger
        return newNode
      }
    }
  }

  rollout(state) {
    while (!state.isTerminal()) {
      const action = choose(state.getPossibleActions());
      state = state.takeAction(action)
    }
    return state.getReward()
  }

  backpropogate(node, reward) {
    while (node) {
      node.total_reward += reward
      node.n_visited += 1
      node = node.parent
    }
  }

  run(init_state) {
    let root = new TreeNode(init_state, null)

    for (let epoch = 0; epoch < this.limitIter; epoch++) {
      let node = this.select(root)
      // console.log("new2", node)
      // debugger

      // let _node = Object.assign(Object.create(Object.getPrototypeOf(node)), node)
      // console.log(10086, node, root)
      let _state = clone(node.state)
      // debugger
      const reward = this.rollout(_state)
      // console.log("new3")
      // debugger


      this.backpropogate(node, reward)
      // console.log("new4")
      // debugger
    }

    const bestChild = this.getBestChild(root, 0)

    for (const [action, child] of Object.entries(root.children)) {
      // debugger
      if (bestChild === child) {
        return action
      }
    }

  }

}


export default MCTS