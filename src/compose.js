/**
 * compose 函数是利用 reduce 来合并中间件函数的
 */
export default function compose(...funcs) {
  // 如果没有中间件
  if (funcs.length === 0) {
    // 返回原来的函数
    return args => args
  }

  // 只有一个中间件
  if (funcs.length === 1) {
    // 返回第一个中间件函数即可
    return funcs[0]
  }
  // 注意这里，如果传入的是 [exception, time, logger] 中间件函数
  // 那么对于函数数组来说，reduce 是从最后一项开始处理的!!!
  // 比如上面的遍历顺序就是 logger -> time -> exception
  // 所以执行顺序是
  // 1. logger(...args)
  // 2. time(logger(...args))
  // 3. exception(time(logger(...args)))
  return funcs.reduce((acc, cur) => (...args) => acc(cur(...args)))
}
