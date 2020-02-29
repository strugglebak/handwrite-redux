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
    // 每次都会返回一个新的对象，要是数据没有变化，那么这个渲染就没有意义
    // 所以需要加一个 [数据有没有变化] 的判断，只要数据没有变化，则返回原来的 state 即可
    let hasChanged = false
    for (const key in reducers) {
      // 注意这里 key 就是 reducer 的名字，reducers[key] 就拿到了对应的 reducer 函数
      // state[key] 就拿到了每个 reducer 中传入的 state 数据
      // 注意看我最上面写的注释例子
      const previousStateForKey = state[key]
      const nextStateForKey = reducers[key](previousStateForKey, action)
      newState[key] = nextStateForKey
      // 只要有一个 nextStateForKey 与 previousStateForKey 不相等了说明 state 就变了
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 只有 state 变化了这种情况才需要返回一个新的 state，否则返回旧的 state
    return hasChanged ? newState : state
  }
}
