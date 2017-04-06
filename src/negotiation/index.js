import Metallic, { SERVER } from 'metallic'

export default class Negotiation {
  static create (options) {
    const metallic = new Metallic(options)
    const { app, role } = metallic

    if (role === SERVER) {
      app.context.parser = new Parser()

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

        ctx.body = await ctx.parser.json(ctx.query.msg)
      })

      app.use(async (ctx, next) => {
        if (!ctx.accepts('html')) {
          return await next()
        }

        ctx.type = 'html'
        ctx.body = await ctx.parser.html(ctx.query.msg)
      })

      app.use(ctx => ctx.throw(415))
    }

    return metallic
  }
}

class Parser {
  json (msg) {
    return new Promise(resolve => resolve({ msg }))
  }

  html (msg) {
    return new Promise(resolve => resolve(`<h1>${msg}</h1>`))
  }
}
