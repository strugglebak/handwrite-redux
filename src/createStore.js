export default function createStore(reducer) {
  // 一个局部的 state，只在这里使用
  let state

  // 暴露给外部使用的 state，使得外部变量不能轻易修改 state
  const getState = () => state

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

    // 这里调用 reducer 返回一个新的状态
    state = reducer(state, actions)
  }

  return {
    getState, dispatch
  }
}
