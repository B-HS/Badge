import type { FC, PropsWithChildren } from 'hono/jsx'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
    <html lang="ko">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Icon Generator</title>
            <link rel="stylesheet" href="/static/styles.built.css" />
            <script type="module" src="/static/client.js"></script>
        </head>
        <body class="bg-gray-100 min-h-screen">
            <div id="app" class="container mx-auto px-4 py-8">
                {children}
            </div>
        </body>
    </html>
)
