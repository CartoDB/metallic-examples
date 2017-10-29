import assert from 'assert'
import fetch from 'node-fetch'
import { Forbidden } from '../src/'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('metallic 503 forbidden example', function () {
  before(function () {
    this.forbidden = Forbidden.create()
  })

  beforeEach(async function () {
    const httpServersInfo = await this.forbidden.start()
    for (let pid in httpServersInfo) {
      if (httpServersInfo.hasOwnProperty(pid)) {
        this.port = httpServersInfo[pid].port
        break
      }
    }
  })

  afterEach(async function () {
    await this.forbidden.stop()
  })

  it('GET / should response 403 forbidden', async function () {
    const res = await fetch(`http://localhost:${this.port}/`)
    const body = await res.text()

    assert.ok(!res.ok)
    assert.equal(res.status, 403)
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')

    assert.equal(body, 'Forbidden')
  })

  it('GET / should response with the given x-request-id header', async function () {
    const res = await fetch(`http://localhost:${this.port}/`, {
      headers: { 'x-request-id': 'wadus' }
    })

    assert.ok(!res.ok)
    assert.equal(res.headers.get('x-request-id'), 'wadus')
  })

  it('GET / should response with x-request-id header', async function () {
    const res = await fetch(`http://localhost:${this.port}/`)

    assert.ok(!res.ok)
    assert.ok(res.headers.get('x-request-id').match(UUID_REGEX))
  })
})
