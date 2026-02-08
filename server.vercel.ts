import { Hono } from 'hono'
import { healthRoute } from './routes/health'
import { imageRoute } from './routes/image'
import { fontsRoute } from './routes/fonts'
import { pageRoute } from './routes/page'

const app = new Hono()

app.route('/api/health', healthRoute)
app.route('/api/image', imageRoute)
app.route('/api/fonts', fontsRoute)
app.route('/', pageRoute)

export default app
