import Metallic, { SERVER } from 'metallic'

export default class Negotiation {
  static create (options) {
    const metallic = new Metallic(options)
    const { app, role } = metallic

    if (role === SERVER) {
      app.use(async (ctx, next) => {
        try {
          await next()
        } catch (err) {
          ctx.status = err.status || 500
          ctx.body = err.message || 'Something exploded'
        }
      })

      app.use(async (ctx, next) => {
        if (!ctx.accepts('json')) {
          return await next()
        }

        ctx.body = { msg: ctx.query.msg }
      })

      app.use(async (ctx, next) => {
        if (!ctx.accepts('html')) {
          return await next()
        }

        ctx.type = 'html'
        ctx.body = `<h1>${ctx.query.msg}</h1>`
      })

      app.use(ctx => ctx.throw(415))
    }

    return metallic
  }
}
