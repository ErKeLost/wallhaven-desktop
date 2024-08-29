import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function ny(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**使用JSON做深拷贝 */
export function deep_JSON<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
/**任意参数个数，任意返回值的函数 */
type anyFn = (...param: any[]) => any;
/**节流。思想是一段时间内多次触发，只执行一次  （按很多下平a只触发一次）
* @param func 要触发的函数。调用return的函数时传的参，可以在这里接收到
* @param time 时间间隔。毫秒
* @returns 返回一个函数，可以用于绑定事件。调用时可以给这个函数传参
*/
export const throttle = (func: anyFn, time: number): anyFn => {
  /**节流阀 */
  let flag = false;
  return function (this: any, ...argu) {
    if (flag) return;
    const context = this;
    flag = true;
    func.apply(context, argu); //通过剩余参数的形式传递
    setTimeout(() => {
      //指定时间间隔后关闭节流阀
      flag = false;
    }, time);
  };
};
