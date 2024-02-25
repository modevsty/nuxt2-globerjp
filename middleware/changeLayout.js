export default function (ctx) {
  if (process. browser) {
    ctx.isBrowser = true
  } else {
    ctx.isBrowser = false
  }
  
}