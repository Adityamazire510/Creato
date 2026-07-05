// ============================================
// CREATO — Template Data & Search Provider
// ============================================

export const DESIGN_TYPES = [
  {
    id: 'instagram-post',
    label: 'Instagram Post',
    width: 1080,
    height: 1080,
    icon: 'square',
    color: 'pink',
    category: 'Social Media',
    tags: ['instagram', 'social', 'post', 'square'],
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    width: 1080,
    height: 1920,
    icon: 'smartphone',
    color: 'purple',
    category: 'Social Media',
    tags: ['instagram', 'story', 'vertical', 'social'],
  },
  {
    id: 'facebook-post',
    label: 'Facebook Post',
    width: 1200,
    height: 630,
    icon: 'image',
    color: 'blue',
    category: 'Social Media',
    tags: ['facebook', 'social', 'post'],
  },
  {
    id: 'youtube-thumbnail',
    label: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    icon: 'play-circle',
    color: 'red',
    category: 'Video',
    tags: ['youtube', 'thumbnail', 'video', '16:9'],
  },
  {
    id: 'presentation',
    label: 'Presentation',
    width: 1920,
    height: 1080,
    icon: 'monitor',
    color: 'orange',
    category: 'Business',
    tags: ['presentation', 'slides', 'deck', '16:9', 'business'],
  },
  {
    id: 'logo',
    label: 'Logo',
    width: 500,
    height: 500,
    icon: 'hexagon',
    color: 'cyan',
    category: 'Branding',
    tags: ['logo', 'brand', 'identity', 'icon'],
  },
  {
    id: 'poster',
    label: 'Poster',
    width: 1587,
    height: 2245,
    icon: 'layout',
    color: 'green',
    category: 'Print',
    tags: ['poster', 'print', 'a3', 'flyer'],
  },
  {
    id: 'animated-video',
    label: 'Video / Animation',
    width: 1920,
    height: 1080,
    icon: 'film',
    color: 'teal',
    category: 'Video',
    tags: ['video', 'animation', 'motion', 'mp4'],
  },
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Social Media',
  'Video',
  'Business',
  'Branding',
  'Print',
  'Marketing',
];

// Pre-built starter templates with gradient backgrounds
export const STARTER_TEMPLATES = [
  {
    id: 'tmpl-1',
    title: 'Gradient Wave Post',
    category: 'Social Media',
    typeId: 'instagram-post',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['abstract', 'gradient', 'modern'],
  },
  {
    id: 'tmpl-2',
    title: 'Sunset Story',
    category: 'Social Media',
    typeId: 'instagram-story',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['warm', 'sunset', 'story'],
  },
  {
    id: 'tmpl-3',
    title: 'Ocean Breeze Thumbnail',
    category: 'Video',
    typeId: 'youtube-thumbnail',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tags: ['blue', 'ocean', 'fresh'],
  },
  {
    id: 'tmpl-4',
    title: 'Midnight Presentation',
    category: 'Business',
    typeId: 'presentation',
    gradient: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b69 100%)',
    tags: ['dark', 'elegant', 'business'],
  },
  {
    id: 'tmpl-5',
    title: 'Neon Glow Logo',
    category: 'Branding',
    typeId: 'logo',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    tags: ['neon', 'glow', 'branding'],
  },
  {
    id: 'tmpl-6',
    title: 'Spring Fresh Poster',
    category: 'Print',
    typeId: 'poster',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    tags: ['green', 'fresh', 'spring', 'nature'],
  },
  {
    id: 'tmpl-7',
    title: 'Fire Motion Intro',
    category: 'Video',
    typeId: 'animated-video',
    gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    tags: ['fire', 'hot', 'animation', 'intro'],
  },
  {
    id: 'tmpl-8',
    title: 'Corporate Blue Post',
    category: 'Business',
    typeId: 'facebook-post',
    gradient: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
    tags: ['corporate', 'blue', 'professional'],
  },
  {
    id: 'tmpl-9',
    title: 'Aurora Borealis',
    category: 'Social Media',
    typeId: 'instagram-post',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    tags: ['aurora', 'dark', 'atmospheric'],
  },
  {
    id: 'tmpl-10',
    title: 'Candy Pop Story',
    category: 'Social Media',
    typeId: 'instagram-story',
    gradient: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #fcb69f 100%)',
    tags: ['candy', 'pop', 'playful'],
  },
  {
    id: 'tmpl-11',
    title: 'Marketing Banner',
    category: 'Marketing',
    typeId: 'facebook-post',
    gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    tags: ['marketing', 'banner', 'promo'],
  },
  {
    id: 'tmpl-12',
    title: 'Dark Tech Poster',
    category: 'Print',
    typeId: 'poster',
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
    tags: ['dark', 'tech', 'futuristic'],
  },
];

/**
 * Search templates by query
 */
export function searchTemplates(query) {
  const q = query.toLowerCase().trim();
  if (!q) return STARTER_TEMPLATES;

  return STARTER_TEMPLATES.filter(t => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  });
}

/**
 * Filter templates by category
 */
export function filterTemplatesByCategory(category) {
  if (category === 'All') return STARTER_TEMPLATES;
  return STARTER_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get design type by ID
 */
export function getDesignType(id) {
  return DESIGN_TYPES.find(t => t.id === id);
}
