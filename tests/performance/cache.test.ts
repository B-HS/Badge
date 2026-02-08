import { describe, test, expect } from 'bun:test'
import app from '../../server'

describe('Cache Performance', () => {
    test('cache hit responds under 100ms', async () => {
        const url = '/api/image?width=100&height=100&text=CachePerformanceTest'

        const warmupResponse = await app.request(url)
        expect(warmupResponse.status).toBe(200)
        expect(warmupResponse.headers.get('x-cache')).toBe('MISS')

        const iterations = 10
        const times: number[] = []

        for (let i = 0; i < iterations; i++) {
            const start = performance.now()
            const response = await app.request(url)
            const end = performance.now()

            expect(response.status).toBe(200)
            expect(response.headers.get('x-cache')).toBe('HIT')
            times.push(end - start)
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length
        const maxTime = Math.max(...times)

        console.log(`Average cache hit time: ${avgTime.toFixed(2)}ms`)
        console.log(`Max cache hit time: ${maxTime.toFixed(2)}ms`)

        expect(avgTime).toBeLessThan(100)
    })

    test('achieves high cache hit rate with repeated requests', async () => {
        const uniqueParams = 5
        const requestsPerParam = 10
        const totalRequests = uniqueParams * requestsPerParam

        let hitCount = 0
        let missCount = 0

        for (let param = 0; param < uniqueParams; param++) {
            for (let req = 0; req < requestsPerParam; req++) {
                const response = await app.request(`/api/image?width=100&height=100&text=HitRateTest${param}`)
                expect(response.status).toBe(200)

                const cacheHeader = response.headers.get('x-cache')
                if (cacheHeader === 'HIT') {
                    hitCount++
                } else {
                    missCount++
                }
            }
        }

        const hitRate = (hitCount / totalRequests) * 100
        console.log(`Cache hit rate: ${hitRate.toFixed(1)}% (${hitCount}/${totalRequests})`)

        expect(hitRate).toBeGreaterThanOrEqual(80)
    })
})
