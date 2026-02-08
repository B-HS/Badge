import { Hono } from 'hono'
import { Layout } from '@components/layout'
import { IconGenerator } from '@components/icon-generator'

export const pageRoute = new Hono()

pageRoute.get('/', (c) =>
    c.html(
        <Layout>
            <IconGenerator />
        </Layout>
    )
)
