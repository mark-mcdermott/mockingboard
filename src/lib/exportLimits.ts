export const IOS_CANVAS_LIMIT = 4096

export function computeMaxSafeScale(width: number, height: number): number {
  if (width * 3 <= IOS_CANVAS_LIMIT && height * 3 <= IOS_CANVAS_LIMIT) {
    return 3
  }
  if (width * 2 <= IOS_CANVAS_LIMIT && height * 2 <= IOS_CANVAS_LIMIT) {
    return 2
  }
  return 1
}