import type { LayerRecipe } from './aura';

/**
 * Which part of each Figma icon becomes which glowing shape.
 * Layers are drawn in order (first = back). Palettes: lavender, violet, peach,
 * butter, mint, sky, paper. `pick` splits a part into pieces (0-based index of its
 * filled shapes) so each piece is lit on its own; pieces of one part still move
 * together. details: soft marks drawn from the part's line-only shapes.
 */
export const recipes: Record<string, LayerRecipe[]> = {
  'uc-invoice': [
    { part: 'folder-back', palette: 'violet' },
    { part: 'invoice', palette: 'butter', details: 'ink' },
    { part: 'folder-front', palette: 'lavender' },
  ],
  'uc-contract': [
    { part: 'document', pick: [0], palette: 'paper', details: 'ink' },
    { part: 'document', pick: [1], palette: 'mint' }, // folded corner
    { part: 'pen', pick: [0], palette: 'peach', details: 'violet', detailWidth: 3 }, // nib
    { part: 'pen', pick: [1], palette: 'violet' }, // shaft
    { part: 'pen', pick: [2], palette: 'mint' }, // cap
    { part: 'seal', palette: 'peach', details: 'light' },
  ],
  'uc-team': [
    { part: 'person-left', pick: [0], palette: 'peach' },
    { part: 'person-left', pick: [1], palette: 'peach' },
    { part: 'person-center', pick: [0], palette: 'violet' },
    { part: 'person-center', pick: [1], palette: 'violet' },
    { part: 'person-right', pick: [0], palette: 'mint' },
    { part: 'person-right', pick: [1], palette: 'mint' },
    { part: 'slide', palette: 'lavender', details: 'light' },
    { part: 'folder', palette: 'butter' },
  ],
  'uc-photo': [
    { part: 'cloud', palette: 'sky' },
    { part: 'arrow', palette: 'mint' },
    { part: 'photo', pick: [0], palette: 'paper' }, // frame
    { part: 'photo', pick: [1], palette: 'sky' }, // picture
    { part: 'mountain', palette: 'mint' },
    { part: 'sun', palette: 'peach' },
  ],
  'uc-education': [
    { part: 'notes', palette: 'paper', details: 'ink' },
    { part: 'bottom-book', palette: 'mint', details: 'light' },
    { part: 'top-book', palette: 'peach', details: 'light' },
    { part: 'cap', pick: [0], palette: 'lavender' }, // crown
    { part: 'cap', pick: [1], palette: 'violet' }, // board
    { part: 'tassel', palette: 'butter', details: 'violet', detailWidth: 6 },
  ],
  'plan-beginner': [
    { part: 'stem', palette: 'mint', details: 'stem' },
    { part: 'left-leaf', palette: 'mint' },
    { part: 'right-leaf', palette: 'mint' },
    { part: 'pot', pick: [0], palette: 'peach' }, // body
    { part: 'pot', pick: [1], palette: 'peach' }, // rim
  ],
  'plan-essential': [
    { part: 'stem', palette: 'mint', details: 'stem' },
    { part: 'leaf-upper-left', palette: 'mint' },
    { part: 'leaf-upper-right', palette: 'mint' },
    { part: 'leaf-lower-left', palette: 'mint' },
    { part: 'leaf-lower-right', palette: 'mint' },
    { part: 'bud', palette: 'butter' },
    { part: 'pot', pick: [0], palette: 'lavender' },
    { part: 'pot', pick: [1], palette: 'lavender' },
  ],
  'plan-pro': [
    { part: 'trunk', palette: 'butter' },
    { part: 'crown', palette: 'mint' },
    { part: 'flower-left', palette: 'peach' },
    { part: 'flower-right', palette: 'peach' },
    { part: 'flower-lower', palette: 'peach' },
    { part: 'pot', palette: 'lavender' },
  ],
  'plan-custom': [
    { part: 'plant-lavender', pick: [0, 1], palette: 'mint', details: 'stem' },
    { part: 'plant-lavender', pick: [2], palette: 'lavender' },
    { part: 'plant-peach', pick: [0, 1], palette: 'mint', details: 'stem' },
    { part: 'plant-peach', pick: [2], palette: 'peach' },
    { part: 'plant-yellow', pick: [0, 1], palette: 'mint', details: 'stem' },
    { part: 'plant-yellow', pick: [2], palette: 'butter' },
  ],
  'part-envelope': [
    { part: 'envelope-back', palette: 'peach' },
    { part: 'letter', palette: 'paper' },
    { part: 'paperclip', palette: 'violet', expand: 3 },
    { part: 'envelope-front', palette: 'peach', details: 'light' },
  ],
  'part-folder': [
    { part: 'folder-back', palette: 'violet' },
    { part: 'folder-front', palette: 'lavender' },
  ],
};
