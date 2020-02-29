/**
 * 这个工具函数主要是在 react-redux 中用到
 * 如果不用 accumulator, 派发一般是这么写
 1. 写 actionCreator
 import { INCREMENT } from './actionTypes'
 const counter = {
   add(number) {
     return {
       type: INCREMENT,
       number
     }
   }
 }
 export default counter

 2. dispatch 时这么写
 import counter from './actions/counter'
 import store from './store'

 store.dispatch(counter.add(1))

 * 还可以这么用
 1. 写 actionCreator
 import { INCREMENT } from './actionTypes'
 export default function add(number) {
    return {
      type: INCREMENT,
      number
    }
 }

 2. dispatch 时这么写
 import { add } from './actions/counter'
 import store from './store'

 store.dispatch(add(1))

 * 所以 bindActionCreator 的作用就是将 store.dispatch 跟 actionCreator 绑定起来
 * 其用法就是如下
 *
 import counter from './actions/counter'
 import store from './store'

 let counter = bindActionCreators(counter, store.dispatch)

 // dispatch 直接调用 counter 的方法就行，不用 store.dispatch 这种方式去派发了
 counter.add(1)

 * 或者这样用
 import { add } from './actions/counter'
 import store from './store'

 let counter = bindActionCreators(add, store.dispatch)
 counter.add(1)
 */
export default function bindActionCreators(actionCreator, dispatch) {
  let typeOfActionCreator = typeof actionCreator
  // 优先简单判断是否是函数
  if (typeOfActionCreator === 'function') {
    // 调用时 dispatch 这个函数的返回值
    bindActionCreator(actionCreator, dispatch)
  } else if (typeOfActionCreator === 'object') { // 然后判断是否是个对象
    // 对象的每一项都要返回 bindActionCreator
    const bondActionCreators = {}
    for (const key in actionCreator) {
      bondActionCreators[key] = bindActionCreator(actionCreator[key], dispatch)
    }
    return bondActionCreators
  }
}

function bindActionCreator(actionCreator, dispatch) {
  // 这个就是核心代码，通过闭包隐藏了 actionCreator 和 dispatch
  // 本质上就是将函数 add 变成
  /**
   * counter = {
   *    add: function() {
   *      return store.dispatch(add.apply(this, arguments))
   *    }
   * }
   */
  return (...args) => dispatch(actionCreator(...args))
}
