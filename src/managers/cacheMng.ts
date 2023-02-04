/* eslint-disable class-methods-use-this */
import { isNullOrUndefined } from "@/utils/variable"

const PREFIX = '@YiQi:'

export class CacheMng {
  public setItem<T = any>(key: string, value: T): T | boolean {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
      return value
    } catch (e) {
      return false
    }
  }

  public getItem<T = any>(key: string): T | undefined;
  public getItem<T = any>(key: string, defaultValue: T): T;
  public getItem<T = any>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = localStorage.getItem(`${PREFIX}${key}`)
      const jsonValue = JSON.parse(value || '')
      return isNullOrUndefined(jsonValue) ? defaultValue : jsonValue
    } catch (e) {
      return defaultValue
    }
  }

  public removeItem(key: string): boolean {
    try {
      localStorage.removeItem(`${PREFIX}${key}`)
      return true
    } catch (e) {
      return false
    }
  }

  public clear() {
    localStorage.clear()
  }

  public setCookie(name: string, value: any, expiredays = 0): boolean {
    if (!name || /^(?:expires|max-age|path|domain|secure)$/i.test(name)) {
      return false
    }
    const expires = expiredays <= 0
      ? '; expires=Tue, 19 Jan 2038 03:14:07 GMT' // 世界末日 http://en.wikipedia.org/wiki/Year_2038_problem
      : `; max-age=${60 * 60 * 24 * expiredays}`
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}`
    return true
  }

  public getCookie<T = any>(name: string, defaultValue?: T, isRaw?: boolean): T | undefined {
    try {
      if (window.document.cookie.length > 0) {
        let begin = window.document.cookie.indexOf(`${name}=`)
        if (begin !== -1) {
          begin += name.length + 1
          let end = document.cookie.indexOf(';', begin)
          if (end === -1) end = document.cookie.length
          const value = decodeURIComponent(document.cookie.substring(begin, end))
          return !isRaw ? JSON.parse(value) : value
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('localDataManager.getCookie:', e)
    }
    return defaultValue
  }

  public removeCookie(name: string): void {
    const value = this.getCookie(name)
    if (!isNullOrUndefined(value)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  public hasCookie(name: string): boolean {
    return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(name).replace(/[-.+*]/g, '\\$&')}\\s*\\=`)).test(document.cookie)
  }

  public getCookieNames(): string[] {
    return document.cookie
      .replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:=[^;]*)?;\s*/)
      .map(name => decodeURIComponent(name))
  }

}

function cacheMngIns() {
  return new CacheMng()
}

const cacheMng = cacheMngIns()

export default cacheMng
