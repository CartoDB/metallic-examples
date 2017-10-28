import meow from 'meow'
import { HelloWorld, Forbidden, Negotiation } from '../'

const help = `
Usage:
  $ npm run benchmark [-- <options>]

Options:
  --name Name of the application to perform the benchmark
  --release Save results in ./BENCHMARK.md (default: disable)

Examples
  $ npm run benchmark -- --release
`

const { name, ...options } = meow({ help }, {
  default: {
    name: 'hello-world'
  }
}).flags

const examples = new Map()
  .set('hello-world', HelloWorld)
  .set('forbidden', Forbidden)
  .set('negotiation', Negotiation)

const AppFactory = examples.get(name)

async function run () {
  const app = AppFactory.create(options)

  try {
    const httpServersInfo = await app.start()
    if (typeof process.send === 'function') {
      process.send(httpServersInfo)
    }
  } catch (err) {
    app.logger.error(err)
  }
}

run()
