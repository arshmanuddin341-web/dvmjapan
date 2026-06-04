/**
 * SiteSettings Model
 * Stores all editable website content - site config, hero, sections, FAQ, etc.
 */

const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    description: {
      type: String,
      trim: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Default keys for the website
siteSettingsSchema.statics.DEFAULT_KEYS = {
  SITE_CONFIG: 'site_config',
  HERO: 'hero',
  WHY_CHOOSE_US: 'why_choose_us',
  HOW_IT_WORKS: 'how_it_works',
  TRUST_STATS: 'trust_stats',
  FAQ: 'faq',
  TESTIMONIALS: 'testimonials',
  CTA: 'cta',
  SEO_PAGES: 'seo_pages',
  SOCIAL: 'social',
  FOOTER: 'footer',
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
