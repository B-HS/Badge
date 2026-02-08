import { mkdir, cp, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { spawn } from 'bun'

const OUTPUT_DIR = '.vercel/output'
const FUNC_DIR = join(OUTPUT_DIR, 'functions/api.func')
const STATIC_DIR = join(OUTPUT_DIR, 'static')

const buildClient = async () => {
    console.log('[build] Building client...')
    const result = await Bun.build({
        entrypoints: ['./public/client.tsx'],
        outdir: './public',
        minify: true,
    })
    if (!result.success) {
        throw new Error('Client build failed')
    }
}

const buildCss = async () => {
    console.log('[build] Building CSS...')
    const proc = spawn({
        cmd: ['bunx', '@tailwindcss/cli', '-i', './public/styles.css', '-o', './public/styles.built.css', '--minify'],
        stdout: 'inherit',
        stderr: 'inherit',
    })
    await proc.exited
    if (proc.exitCode !== 0) {
        throw new Error('CSS build failed')
    }
}

const buildServer = async () => {
    console.log('[build] Building server...')
    const result = await Bun.build({
        entrypoints: ['./server.vercel.ts'],
        outdir: FUNC_DIR,
        target: 'node',
        format: 'esm',
        external: ['@resvg/resvg-js'],
        naming: '[dir]/index.[ext]',
    })
    if (!result.success) {
        throw new Error('Server build failed')
    }
}

const createVercelOutput = async () => {
    console.log('[build] Creating Vercel output files...')

    const config = {
        version: 3,
        routes: [
            { src: '/static/(.*)', dest: '/static/$1' },
            { handle: 'filesystem' },
            { src: '/(.*)', dest: '/api' },
        ],
    }
    await writeFile(join(OUTPUT_DIR, 'config.json'), JSON.stringify(config, null, 2))

    const vcConfig = {
        runtime: 'nodejs20.x',
        handler: 'index.js',
        launcherType: 'Nodejs',
    }
    await writeFile(join(FUNC_DIR, '.vc-config.json'), JSON.stringify(vcConfig, null, 2))

    await mkdir(join(STATIC_DIR, 'static'), { recursive: true })
    const publicFiles = ['client.js', 'styles.built.css']
    for (const file of publicFiles) {
        await cp(join('./public', file), join(STATIC_DIR, 'static', file))
    }

    await cp('./node_modules/@resvg', join(FUNC_DIR, 'node_modules/@resvg'), { recursive: true })
    await cp('./node_modules/@fontsource', join(FUNC_DIR, 'node_modules/@fontsource'), { recursive: true })
}

const createDirectories = async () => {
    console.log('[build] Creating Vercel output directories...')
    await rm(OUTPUT_DIR, { recursive: true, force: true })
    await mkdir(FUNC_DIR, { recursive: true })
    await mkdir(join(STATIC_DIR, 'static'), { recursive: true })
}

const main = async () => {
    try {
        await buildClient()
        await buildCss()
        await createDirectories()
        await buildServer()
        await createVercelOutput()
        console.log('[build] Vercel build completed successfully!')
    } catch (error) {
        console.error('[build] Build failed:', error)
        process.exit(1)
    }
}

main()
