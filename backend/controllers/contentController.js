/**
 * Content Controller
 * Manages site settings and editable content
 */

const SiteSettings = require('../models/SiteSettings');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * @desc    Get all site settings (Admin)
 * @route   GET /api/content
 * @access  Admin
 */
exports.getAllSettings = asyncHandler(async (req, res, next) => {
  const settings = await SiteSettings.find().sort('key').lean();
  const map = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  res.status(200).json({ success: true, data: map });
});

/**
 * @desc    Get single setting by key (Public for non-sensitive keys)
 * @route   GET /api/content/:key
 * @access  Public (for site_config, hero, faq, testimonials, etc.)
 */
exports.getByKey = asyncHandler(async (req, res, next) => {
  const doc = await SiteSettings.findOne({ key: req.params.key }).lean();
  if (!doc) {
    return next(new AppError('Setting not found', 404));
  }
  res.status(200).json({ success: true, data: doc.value });
});

/**
 * @desc    Get single setting (alias for consistency)
 * @route   GET /api/content/get/:key
 * @access  Public
 */
exports.getSetting = exports.getByKey;

/**
 * @desc    Get public site config (for header, footer, etc.)
 * @route   GET /api/content/public/config
 * @access  Public
 */
exports.getPublicConfig = asyncHandler(async (req, res, next) => {
  const doc = await SiteSettings.findOne({ key: 'site_config' }).lean();
  const fallback = {
    name: 'DVM JAPAN',
    description: "World's #1 Japanese Car Import Marketplace",
    contact: {
      phone: '+447426109211',
      emails: ['info@DVM JAPANgroup.com'],
      email: 'info@DVM JAPANgroup.com',
      address: 'Yokohama, Japan',
      whatsapp: '+447426109211',
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
    stats: { vehicles: '50,000+', customers: '10,000+', countries: '50+' },
  };
  res.status(200).json({
    success: true,
    data: doc ? doc.value : fallback,
  });
});

/**
 * @desc    Update or create setting
 * @route   PUT /api/content/:key
 * @access  Admin
 */
exports.upsert = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { value } = req.body;

  if (!value) {
    return next(new AppError('Value is required', 400));
  }

  const doc = await SiteSettings.findOneAndUpdate(
    { key },
    {
      value,
      lastUpdatedBy: req.user.id,
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Content updated successfully',
    data: doc.value,
  });
});

/**
 * @desc    Seed default settings
 * @route   POST /api/content/seed
 * @access  Admin
 */
exports.seedDefaults = asyncHandler(async (req, res, next) => {
  const defaults = [
    {
      key: 'site_config',
      value: {
        name: 'DVM JAPAN',
        description: "World's #1 Japanese Car Import Marketplace",
        contact: {
          phone: '+447426109211',
          emails: ['info@DVM JAPANgroup.com'],
          email: 'info@DVM JAPANgroup.com',
          address: 'Yokohama, Japan',
          whatsapp: '+447426109211',
        },
        social: {
          facebook: 'https://facebook.com/DVM JAPAN',
          instagram: 'https://instagram.com/DVM JAPAN',
          twitter: 'https://twitter.com/DVM JAPAN',
          linkedin: 'https://linkedin.com/company/DVM JAPAN',
        },
        stats: { vehicles: '50,000+', customers: '10,000+', countries: '50+' },
      },
      description: 'Site name, contact, social links, stats',
    },
    {
      key: 'hero',
      value: {
        eyebrow: 'Premium Japanese Imports',
        title: 'Drive Your Dream Car Home',
        subtitle: 'From Japan\'s finest auctions to your driveway. Quality-checked, hassle-free.',
        ctaPrimary: 'Browse Inventory',
        ctaSecondary: 'How It Works',
      },
      description: 'Homepage hero section',
    },
    {
      key: 'seo_pages',
      value: {
        home: {
          metaTitle: 'DVM JAPAN - Premium Japanese Car Import Marketplace',
          metaDesc: 'Import high-quality used Japanese vehicles from Japan auctions.',
        },
        inventory: {
          metaTitle: 'Vehicle Inventory - Browse Japanese Cars',
          metaDesc: 'Browse our extensive inventory of Japanese vehicles.',
        },
      },
      description: 'SEO meta per page',
    },
    {
      key: 'faq',
      value: [
        { question: 'How does the import process work?', answer: 'We handle everything from auction to delivery.' },
        { question: 'What payment methods do you accept?', answer: 'We accept bank transfer,信用证, and more.' },
      ],
      description: 'FAQ items',
    },
    {
      key: 'testimonials',
      value: [
        { name: 'Ahmed', role: 'Customer', text: 'Great service!', rating: 5 },
      ],
      description: 'Customer testimonials',
    },
  ];

  for (const item of defaults) {
    await SiteSettings.findOneAndUpdate(
      { key: item.key },
      { $setOnInsert: item },
      { upsert: true }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Default content seeded',
    data: { count: defaults.length },
  });
});
