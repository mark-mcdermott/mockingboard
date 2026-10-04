import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { cleanupBoardFixture } from './utils'

afterEach(() => {
  cleanup()
  cleanupBoardFixture()
  localStorage.clear()
})
