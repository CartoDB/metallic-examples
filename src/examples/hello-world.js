import Metallic, { SERVER } from 'metallic'

export default class HelloWorld {
  static create (options) {
    const metallic = new Metallic(options)

    if (metallic.role === SERVER) {
      const body = Buffer.from('Hello World\n')
      const message = body.toString('utf8')

      metallic.app.use(async (ctx, next) => {
        await next()
        ctx.body = body
      })
    }

    return metallic
  }
}
