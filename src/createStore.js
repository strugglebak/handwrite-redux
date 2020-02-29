export default function createStore(reducer) {
  // 一个局部的 state，只在这里使用
  let state
  // 订阅者数组
  let listeners = []

  // 暴露给外部使用的 state，使得外部变量不能轻易修改 state
  const getState = () => state

  // 引入发布订阅模式，好处是每次 state 变化时，可以不用自己手动写 render(state 变了 1000 次，不用自己写 1000 次的 render)
  // 在 dispatch 中写 调用 render 是不可行的，因为其他应用中渲染操作未必叫 render，而且 dispatch 中也可能不只是要触发 render
  const subscribe = (listener) => {
    listener.push(listener)
    // 订阅之后也要能够取消订阅
    const unSubscribe = () => {
      listeners = listeners.filter(ln => ln !== listener)
    }
    return unSubscribe
  }

  const dispatch = (actions) => {
    // 注意这里的 reducer 就相当于
    // const reducer = (state, action)=>{
    //   if(state === undefined){
    //     return {n: 0}
    //   }else{
    //     if(action.type === 'add'){
    //       var newState = {n: state.n + action.payload}
    //       return newState
    //     }else{
    //       return state
    //     }
    //   }
    // }

    // 这里调用 reducer 返回一个新的 state
    state = reducer(state, actions)
    // 对应上面订阅，这里就是发布，本质上就是遍历 listeners 执行
    listeners.forEach(ln => ln())
  }

  // 初始化 state，因为对于 reducer 来说，在碰到不能识别的 action type 时，会返回一个旧的 state
  dispatch({})

  return {
    getState,
    subscribe,
    dispatch,
  }
}
