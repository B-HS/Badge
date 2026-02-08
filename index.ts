import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'

const app = new Hono()

app.get('/', (c) => c.text('Hello World'))
app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default handle(app)
