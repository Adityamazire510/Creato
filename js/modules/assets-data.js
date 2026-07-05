// ============================================
// CREATO — Assets & Templates Dataset (Picsart Style)
// ============================================

export const STOCK_PHOTOS = [
  { id: 'img-1', title: 'Neon Cyberpunk City', category: 'Neon', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-2', title: 'Tropical Palm Leaves', category: 'Nature', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-3', title: 'Minimalist Architecture', category: 'Minimal', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-4', title: 'Fluid Color Waves', category: 'Abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-5', title: 'Deep Space Galaxy', category: 'Abstract', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-6', title: 'Urban Street Lights', category: 'Urban', url: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-7', title: 'Golden Hour Sunset', category: 'Nature', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80' },
  { id: 'img-8', title: 'Vibrant Hologram Smoke', category: 'Neon', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80' },
];

export const FONT_PRESETS = [
  { id: 'f-1', name: 'Heading Bold', fontSize: 52, font: 'Outfit', fontWeight: '800', fill: '#FFFFFF', text: 'ADD A HEADING' },
  { id: 'f-2', name: 'Subheading Medium', fontSize: 32, font: 'Inter', fontWeight: '600', fill: '#E2E8F0', text: 'Add a subheading' },
  { id: 'f-3', name: 'Body Regular', fontSize: 20, font: 'Inter', fontWeight: '400', fill: '#94A3B8', text: 'Add body text here for your design description' },
  { id: 'f-4', name: 'Neon Cyber Glow', fontSize: 44, font: 'Outfit', fontWeight: '800', fill: '#06B6D4', stroke: '#7C3AED', text: 'NEON CREATIVE' },
  { id: 'f-5', name: 'Minimal Luxury', fontSize: 38, font: 'Outfit', fontWeight: '300', fill: '#F8FAFC', text: 'LUXURY EDITION' },
];

export const SHAPES_LIBRARY = [
  { id: 's-rect', name: 'Rectangle', type: 'rect', fill: '#7C3AED', width: 200, height: 150 },
  { id: 's-circle', name: 'Circle', type: 'circle', fill: '#3B82F6', width: 180, height: 180 },
  { id: 's-triangle', name: 'Triangle', type: 'triangle', fill: '#EC4899', width: 200, height: 180 },
  { id: 's-star', name: 'Star', type: 'star', fill: '#F59E0B', width: 180, height: 180 },
  { id: 's-badge', name: 'Badge', type: 'rect', fill: '#10B981', width: 240, height: 80, rx: 40 },
];

export const BACKGROUND_PRESETS = [
  { id: 'bg-1', name: 'Solid Midnight', type: 'solid', value: '#080811' },
  { id: 'bg-2', name: 'Solid White', type: 'solid', value: '#FFFFFF' },
  { id: 'bg-3', name: 'Purple Dream', type: 'gradient', value: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)' },
  { id: 'bg-4', name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)' },
  { id: 'bg-5', name: 'Cyber Neon', type: 'gradient', value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #7c3aed 100%)' },
  { id: 'bg-6', name: 'Emerald Forest', type: 'gradient', value: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
];

export const PICSART_TEMPLATES = [
  {
    id: 'tmpl-square-1',
    title: 'Neon Social Offer',
    category: 'Square',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
    elements: [
      { type: 'rect', x: 80, y: 80, width: 920, height: 920, fill: 'rgba(0,0,0,0.3)', rx: 24 },
      { type: 'text', x: 140, y: 220, text: 'SPECIAL OFFER', fontSize: 56, font: 'Outfit', fill: '#F59E0B' },
      { type: 'text', x: 140, y: 320, text: '50% OFF TODAY', fontSize: 72, font: 'Outfit', fill: '#FFFFFF' },
      { type: 'rect', x: 140, y: 440, width: 320, height: 80, fill: '#EC4899', rx: 40 },
      { type: 'text', x: 180, y: 460, text: 'SHOP NOW', fontSize: 28, font: 'Outfit', fill: '#FFFFFF' },
    ]
  },
  {
    id: 'tmpl-story-1',
    title: 'Minimal Story Vibe',
    category: 'Story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #18181b 0%, #27272a 100%)',
    elements: [
      { type: 'rect', x: 100, y: 200, width: 880, height: 1100, fill: '#3f3f46', rx: 32 },
      { type: 'text', x: 140, y: 1360, text: 'CREATO DESIGNS', fontSize: 64, font: 'Outfit', fill: '#FFFFFF' },
      { type: 'text', x: 140, y: 1460, text: 'Swipe up for story templates', fontSize: 32, font: 'Inter', fill: '#A1A1AA' },
    ]
  },
  {
    id: 'tmpl-banner-1',
    title: 'YouTube Gaming Thumbnail',
    category: 'Banner',
    width: 1280,
    height: 720,
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1e1b4b 100%)',
    elements: [
      { type: 'text', x: 80, y: 180, text: 'EPIC GAMING', fontSize: 76, font: 'Outfit', fill: '#F59E0B' },
      { type: 'text', x: 80, y: 280, text: 'LIVE STREAM', fontSize: 96, font: 'Outfit', fill: '#FFFFFF' },
      { type: 'rect', x: 80, y: 430, width: 280, height: 70, fill: '#EF4444', rx: 35 },
      { type: 'text', x: 120, y: 450, text: 'WATCH NOW', fontSize: 24, font: 'Outfit', fill: '#FFFFFF' },
    ]
  }
];
