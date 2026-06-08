import { setCookie as tanstackSetCookie, getCookie as tanstackGetCookie, deleteCookie as tanstackDeleteCookie } from "@tanstack/react-start/server"

function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME || "ff_session"
}

export function setSessionCookie(sessionToken: string, expiresAt: Date) {
  const cookieName = getSessionCookieName()
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000)

  tanstackSetCookie(cookieName, sessionToken, {
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export function getSessionCookie(): string | undefined {
  const cookieName = getSessionCookieName()
  return tanstackGetCookie(cookieName)
}

export function deleteSessionCookie() {
  const cookieName = getSessionCookieName()
  tanstackDeleteCookie(cookieName, {
    path: "/",
  })
}
