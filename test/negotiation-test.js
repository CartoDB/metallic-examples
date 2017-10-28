import assert from 'assert'
import fetch from 'node-fetch'
import { Negotiation } from '../src/'

describe('metallic content middleware example', function () {
  before(function () {
    this.negotiation = Negotiation.create()
  })

  beforeEach(async function () {
    const httpServersInfo = await this.negotiation.start()
    for (let pid in httpServersInfo) {
      if (httpServersInfo.hasOwnProperty(pid)) {
        this.port = httpServersInfo[pid].port
        break
      }
    }
  })

  afterEach(async function () {
    await this.negotiation.stop()
  })

  it('GET / should accept json content', async function () {
    const res = await fetch(`http://localhost:${this.port}?msg=Hello World`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const body = await res.json()
    assert.ok(res.ok)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('Content-Type'), 'application/json; charset=utf-8')

    assert.deepEqual(body, { msg: 'Hello World' })
  })

  it('GET / should accept html content', async function () {
    const res = await fetch(`http://localhost:${this.port}?msg=Hello World`, {
      headers: {
        'Accept': 'text/html'
      }
    })
    const body = await res.text()
    assert.ok(res.ok)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('Content-Type'), 'text/html; charset=utf-8')

    assert.equal(body, '<h1>Hello World</h1>')
  })

  it('GET / should not accept xml content', async function () {
    const res = await fetch(`http://localhost:${this.port}?msg=Hello World`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    const body = await res.text()
    assert.ok(!res.ok)
    assert.equal(res.status, 415)

    assert.equal(body, 'Unsupported Media Type')
  })
})
