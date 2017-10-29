import { STATUS_CODES } from 'http'
import Metallic, { SERVER } from 'metallic'

export default class Forbidden {
  static create (options) {
    const metallic = new Metallic(options)

    if (metallic.role === SERVER) {
      metallic.app.use(async ctx => ctx.throw(403, STATUS_CODES[403]))
    }

    return metallic
  }
}
