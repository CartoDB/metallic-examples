import { STATUS_CODES } from 'http'
import Metallic, { SERVER } from 'metallic'

export default class Forbidden {
  static create (options) {
    const metallic = new Metallic(options)

    if (metallic.role === SERVER) {
      metallic.app.use(ctx => {
        try {
          ctx.throw(403, STATUS_CODES[403])
        } catch (err) {
          ctx.status = err.status || 500
          ctx.type = 'text/plain; charset=utf-8'
          ctx.body = 'Something exploded'
        }
      })
    }

    return metallic
  }
}
