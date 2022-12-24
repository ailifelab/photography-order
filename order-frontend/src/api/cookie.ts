import Cookies from 'js-cookie'

export function getCookie(CookieName: string) {
  return Cookies.get(CookieName)
}

export function setCookie(CookieName: string, CookieValue: any) {
  return Cookies.set(CookieName, CookieValue)
}

export function removeCookie(CookieName: string,) {
  return Cookies.remove(CookieName)
}