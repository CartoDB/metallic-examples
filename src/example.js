import Metallic from 'metallic'

export default class Example {
  constructor (options) {
    this.metallic = new Metallic(options)
  }

  start () {
    return this.metallic.start()
  }

  stop () {
    return this.metallic.stop()
  }
}
