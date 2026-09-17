import { describe, expect, it } from 'vitest'
import { IOS_CANVAS_LIMIT, computeMaxSafeScale } from './exportLimits'

describe('computeMaxSafeScale', () => {
  it('picks 3x while both dimensions still fit the canvas limit', () => {
    expect(computeMaxSafeScale(1000, 800)).toBe(3)
  })

  it('picks 3x exactly at the boundary', () => {
    const edge = IOS_CANVAS_LIMIT / 3
    expect(computeMaxSafeScale(edge, edge)).toBe(3)
  })

  it('drops to 2x as soon as 3x would overflow', () => {
    const overflow = IOS_CANVAS_LIMIT / 3 + 1
    expect(computeMaxSafeScale(overflow, 100)).toBe(2)
  })

  it('picks 2x exactly at the boundary', () => {
    const edge = IOS_CANVAS_LIMIT / 2
    expect(computeMaxSafeScale(edge, edge)).toBe(2)
  })

  it('falls back to 1x as soon as 2x would overflow', () => {
    const overflow = IOS_CANVAS_LIMIT / 2 + 1
    expect(computeMaxSafeScale(overflow, 100)).toBe(1)
  })

  it('constrains on height alone, not just width', () => {
    expect(computeMaxSafeScale(100, IOS_CANVAS_LIMIT / 3 + 1)).toBe(2)
    expect(computeMaxSafeScale(100, IOS_CANVAS_LIMIT / 2 + 1)).toBe(1)
  })

  it('constrains on the worse of the two dimensions', () => {
    expect(computeMaxSafeScale(IOS_CANVAS_LIMIT / 2, IOS_CANVAS_LIMIT / 3)).toBe(2)
  })

  it('never returns a scale that would exceed the limit', () => {
    const sizes = [1, 500, 1365, 1366, 2047, 2048, 2049, 4096, 9000]
    for (const width of sizes) {
      for (const height of sizes) {
        const scale = computeMaxSafeScale(width, height)
        if (scale > 1) {
          expect(width * scale).toBeLessThanOrEqual(IOS_CANVAS_LIMIT)
          expect(height * scale).toBeLessThanOrEqual(IOS_CANVAS_LIMIT)
        }
      }
    }
  })
})
