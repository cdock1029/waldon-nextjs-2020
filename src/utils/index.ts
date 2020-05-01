const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  // hour: 'numeric',
  // minute: 'numeric',
  // second: 'numeric',
  // hour12: false,
  timeZone: 'America/New_York',
}
const formatter = new Intl.DateTimeFormat('en-US', options)
export function format(str: string) {
  let d = Date.parse(str)
  return formatter.format(d)
}
