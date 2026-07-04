const JAKARTA_TIME_ZONE = "Asia/Jakarta"

export function formatJakartaDateTime(value: Date | string | number) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: JAKARTA_TIME_ZONE,
  }).format(new Date(value))
}

export function formatJakartaDate(value: Date | string | number) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: JAKARTA_TIME_ZONE,
  }).format(new Date(value))
}
