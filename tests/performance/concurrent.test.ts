import { describe, test, expect } from 'bun:test'
import app from '../../server'

describe('Concurrent Request Handling', () => {
    test('handles 100+ concurrent requests', async () => {
        const concurrentRequests = 100
        const requests = Array.from({ length: concurrentRequests }, (_, i) => app.request(`/api/image?width=100&height=100&text=Test${i}`))

        const startTime = performance.now()
        const responses = await Promise.all(requests)
        const endTime = performance.now()

        const successCount = responses.filter((r) => r.status === 200).length
        const totalTime = endTime - startTime

        expect(successCount).toBe(concurrentRequests)
        console.log(`Processed ${concurrentRequests} requests in ${totalTime.toFixed(2)}ms`)
        console.log(`Average: ${(totalTime / concurrentRequests).toFixed(2)}ms per request`)
    })
})
