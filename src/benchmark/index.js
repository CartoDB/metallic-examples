import meow from 'meow'
import AppSpawner from './app-spawner'
import WrkSpawner from './wrk-spawner'
import BenchPrinter from './bench-printer'

const help = `
  Usage:
    $ npm run benchmark [-- <options>]

  Options:
    --name Name of the application to perform the benchmark
    --release Save results in ./BENCHMARK.md (default: disable)

  Examples
    $ npm run benchmark -- --release
`

const { release } = meow({ help }, {
  alias: {
    r: 'release'
  },
  boolean: [
    'release'
  ],
  default: {
    release: false
  }
}).flags

const args = process.argv.slice(2)
const appSpawner = new AppSpawner({ args })
const wrkSpawner = new WrkSpawner()
const benchPrinter = new BenchPrinter(release)

async function run () {
  try {
    const port = await appSpawner.run()
    const results = await wrkSpawner.run(port)

    await benchPrinter.print(results)
    await appSpawner.stop()
    await wrkSpawner.stop()
  } catch (err) {
    console.error(err)
  }
}

run()
