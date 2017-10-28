import assert from 'assert'
import fetch from 'node-fetch'
import { HelloWorld } from '../src/'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('metallic hello world example', function () {
  before(function () {
    this.helloWorld = HelloWorld.create()
  })

  beforeEach(async function () {
    const httpServersInfo = await this.helloWorld.start()
    for (let pid in httpServersInfo) {
      if (httpServersInfo.hasOwnProperty(pid)) {
        this.port = httpServersInfo[pid].port
        break
      }
    }
  })

  afterEach(async function () {
    await this.helloWorld.stop()
  })

  it('GET / should response 200 ok', async function () {
    const res = await fetch(`http://localhost:${this.port}/`)
    const body = await res.text()
    assert.ok(res.ok)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'application/octet-stream')

    assert.equal(body, 'Hello World\n')
  })

  it('GET / should response with the given x-request-id header', async function () {
    const res = await fetch(`http://localhost:${this.port}/`, {
      headers: { 'x-request-id': 'wadus' }
    })

    assert.ok(res.ok)
    assert.equal(res.headers.get('x-request-id'), 'wadus')
  })

  it('GET / should response with x-request-id header', async function () {
    const res = await fetch(`http://localhost:${this.port}/`)

    assert.ok(res.ok)
    assert.ok(res.headers.get('x-request-id').match(UUID_REGEX))
  })
})
