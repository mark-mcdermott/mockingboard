// The board island renders its header controls into this node with a portal:
// the header is prerendered Astro, the controls need the island's state, and
// this keeps the id from drifting between the two.
export const BOARD_ACTIONS_ID = 'board-actions'
