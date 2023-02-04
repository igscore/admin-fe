/**
 * Created by liuzhimeng.
 * @date 2020-02-10
 * @description 事件订阅
 */

interface ListenerFn {
  (...args: any[]): void
  context?: object
  once?: boolean
}

export interface EventInstance {
  remove(): void
}

export class EventEmitter {
  private eventMap: {
    [event: string]: ListenerFn[] | null
  }

  constructor() {
    this.eventMap = Object.create(null)
  }

  private add(event: string, fn: ListenerFn, context?: object, once?: boolean): EventInstance {
    const eventPool = this.eventMap[event] || []

    // eslint-disable-next-line no-param-reassign
    fn.context = context
    // eslint-disable-next-line no-param-reassign
    fn.once = !!once
    eventPool.push(fn)
    this.eventMap[event] = eventPool

    return {
      remove: () => {
        this.removeListener(event)
      }
    }
  }

  public addListener(event: string, fn: ListenerFn, context?: object): EventInstance {
    return this.add(event, fn, context, false)
  }

  public addOnceListener(event: string, fn: ListenerFn, context?: object): EventInstance {
    return this.add(event, fn, context, true)
  }

  public removeListener(event: string, fn?: ListenerFn): EventEmitter {
    const eventPool = this.eventMap[event]

    if (eventPool) {
      // 指定要移除的回调
      if (fn) {
        this.eventMap[event] = eventPool.filter(eventFn => eventFn !== fn)
      } else {
        this.eventMap[event] = null
      }
    }

    return this
  }

  public removeAllListeners(): EventEmitter {
    const { eventMap } = this
    const events = Object.keys(eventMap)
    const { length } = events

    let i = -1
    // eslint-disable-next-line no-plusplus
    while (++i < length) {
      const event = events[i]
      this.eventMap[event] = null
    }

    return this
  }

  public emit(event: string, ...args: any[]): EventEmitter {
    const eventPool = this.eventMap[event]

    if (eventPool) {
      let status = false // 记录是否执行一次

      // eslint-disable-next-line no-restricted-syntax
      for (const fn of eventPool) {
        const { context, once } = fn
        fn.apply(context, args)
        if (once) {
          status = true
          break
        }
      }

      if (status && this.eventMap[event]) {
        delete this.eventMap[event]
      }

    }

    return this
  }

  public listeners(event: string): ListenerFn[] {
    const eventPool = this.eventMap[event]
    return !eventPool ? [] : eventPool.map(fn => fn)
  }

  public listenerCount(event: string): number {
    const eventPool = this.eventMap[event]
    return !eventPool ? 0 : eventPool.length
  }

  public eventNames(): string[] {
    return Object.keys(this.eventMap)
  }

}

function eventEmitterIns() {
  return new EventEmitter()
}

const eventEmitter = eventEmitterIns()

export default eventEmitter
