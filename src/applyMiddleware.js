/**
 *
 * 中间件 middleware 是对 dispatch 的拓展(重写)，目的是增强 dispatch 的功能
 * 你可以将这个 dispatch 理解为 redux 定义的中间件的一种
 * 所以在下面的代码中你可以看到 next，这个 next 就是改造过后的 dispatch，也就是所谓的中间件
 * 总体来说，一个 redux 中间件的写法是
 const xxxMiddleware = (store) => (next) => (action) => {
   // 一堆该中间件的逻辑
   ...

   // 执行完该中间件的逻辑之后再去执行下一个中间件的逻辑
   next(action)
 }
 既然最终需要改变的是 dispatch，那么就需要重写 store，返回修改了 dispatch 方法之后的 store

 期望用法如下

 接受旧的 createStore, 返回新的 createStore

 const newCreateStore =
  applyMiddleware(
    exceptionMiddleware,
    timeMiddleware,
    loggerMiddleware
  )(createStore)

  返回一个 dispatch 被重写过的新 store

  const newStore = newCreateStore(reducer)
 */
export default function applyMiddleware(...middlewares) {
  // 对于 applyMiddleware 这个函数来说，返回的是一个 newCreateStore 函数
  // 接受的参数是旧的 createStore 函数
  return (oldCreateStore) =>
    // 对于上面的 newCreateStore 函数来说，返回的是一个 newStore 对象
    // 接受的参数是 reducer 函数 以及 initState 对象
    (reducer) => {
      // 生成 store
      const store = oldCreateStore(reducer)
      // 给每个中间件传 store
      // middlewaresChain = [exception, time, logger]
      const middlewaresChain = middlewares.map(middleware => middleware(store))


      // 实现 exception(time(logger(dispatch))) 这样的调用
      // 所以数组这里需要 reverse
      // 不然调用关系就会变成 logger(time(exception(dispatch)))
      let { dispatch } = store
      middlewaresChain.reverse().map(middleware => {
        dispatch = middleware(dispatch)
      })

      // 重写 dispatch
      store.dispatch = dispatch

      // 返回被改造后的新的 store(这里我们可以看到主要是改造了 store 中的 dispatch 部分)
      return store
    }
}
