import Metallic, { SERVER } from 'metallic'

export default class HelloWorld {
  static create (options) {
    const metallic = new Metallic(options)

    if (metallic.role === SERVER) {
      const body = Buffer.from('Hello World\n')
      const message = body.toString('utf8')

      metallic.app.use(async (ctx, next) => {
        ctx.log.info(message)
        await next()
        // ctx.metrics.increment('hello_world')
        ctx.body = body
      })
    }

    return metallic
  }
}
