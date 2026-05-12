import type { Mockup } from '../types'

const DEMO_FILENAMES = [
  'homepage_v2.png',
  'onboarding_screen.png',
  'pricing_page.png',
  'mobile_dashboard.png',
  'product_detail.png',
  'analytics_overview.png',
  'feature_grid.png',
  'landing_hero_dark.png',
  'empty_state.png',
  'checkout_page.png',
]

export const DEMO_IMAGES: Mockup[] = DEMO_FILENAMES.map((filename) =>
  ({
    id: `demo-${filename}`,
    src: `/demo-images/${filename}`,
    name: filename,
  }))