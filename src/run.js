import meow from 'meow'
import HelloWorld from './hello-world'
import Forbidden from './403-forbidden'

const examples = new Map()

examples
  .set('hello-world', HelloWorld)
  .set('forbidden', Forbidden)

const help = `
  Usage:
    $ npm run example [-- <options>]

  Options:
    -n, --name Launch the given example (default: hello-world)

  Examples
    $ npm run example -- -n hello-world
`
const options = {
  alias: {
    n: 'name'
  },
  default: {
    name: 'hello-world'
  }
}

const flags = meow({ help }, options).flags
const Example = examples.get(flags.name)

Example.create(flags).start()
