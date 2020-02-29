/**
 *
 * 当应用的业务变得复杂，action 的类型变得很多，会导致 reducer 函数变得很长，不利于代码维护
 * 如果将这些 reducer 模块化的话，没有对其进行合并，redux 是不能用的，所以需要一个 combineReducers 函数
 * 来进行整合
 * 最终该函数会返回一个对象, 类似这样的
 *
   import counter from './counterReducer';
   import theme from './themeReducer';

   export default function appReducer(state={}, action) {
     return {
       theme: theme(state.theme, action),
       counter: counter(state.counter, action)
     }
   }

   appReducer 即为合并后的 reducer，而 combineReducers 就是生成这样一个 reducer 的函数
 */
export default function combineReducers(reducers) {
  // 对于 combineReducers 这个函数来说它返回的是一个新的 reducer 函数
  return (state = {}, action) => {
    let newState = {}
    for (const key in reducers) {
      // 注意这里 key 就是 reducer 的名字，reducers[key] 就拿到了对应的 reducer 函数
      // state[key] 就拿到了每个 reducer 中传入的 state 数据
      // 注意看我最上面写的注释例子
      newState[key] = reducers[key](state[key], action)
    }
    // 对于一个新的 reducer 函数来说它返回的是一个新的 state
    return newState
  }
}
