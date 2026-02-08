import { watch } from 'fs'
import { spawn, type Subprocess } from 'bun'

const debounce = <T extends (...args: Parameters<T>) => void>(fn: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

const buildClient = async () => {
    console.log('[build] Building client...')
    const result = await Bun.build({
        entrypoints: ['./public/client.tsx'],
        outdir: './public',
        minify: true,
    })
    if (result.success) {
        console.log('[build] Client built successfully')
    } else {
        console.error('[build] Client build failed:', result.logs)
    }
}

const buildCss = () => {
    console.log('[build] Building CSS...')
    const proc = spawn({
        cmd: ['bunx', '@tailwindcss/cli', '-i', './public/styles.css', '-o', './public/styles.built.css', '--minify'],
        stdout: 'inherit',
        stderr: 'inherit',
    })
    return proc
}

const startServer = () => {
    console.log('[server] Starting dev server...')
    return spawn({
        cmd: ['bun', '--hot', 'server.ts'],
        stdout: 'inherit',
        stderr: 'inherit',
    })
}

const main = async () => {
    await buildClient()
    const cssProc = buildCss()
    await cssProc.exited

    const serverProc = startServer()

    const debouncedBuildClient = debounce(buildClient, 100)

    const clientWatcher = watch('./public', { recursive: false }, (event, filename) => {
        if (filename === 'client.tsx') {
            debouncedBuildClient()
        }
    })

    const componentsWatcher = watch('./components', { recursive: true }, (event, filename) => {
        if (filename?.endsWith('.tsx')) {
            console.log(`[watch] Component changed: ${filename}`)
        }
    })

    const cssWatcher = spawn({
        cmd: ['bunx', '@tailwindcss/cli', '-i', './public/styles.css', '-o', './public/styles.built.css', '--minify', '--watch'],
        stdout: 'inherit',
        stderr: 'inherit',
    })

    process.on('SIGINT', () => {
        console.log('\n[dev] Shutting down...')
        clientWatcher.close()
        componentsWatcher.close()
        cssWatcher.kill()
        serverProc.kill()
        process.exit(0)
    })

    await serverProc.exited
}

main()
