const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

const htmlStripExtension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'htmlStrip.invalid': '{{#label}} should not contain HTML tags.',
  },
  rules: {
    htmlStrip: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error('htmlStrip.invalid');
        }
        return clean;
      },
    },
  },
});

const customJoi = Joi.extend(htmlStripExtension);

module.exports.campgroundSchema = customJoi.object({
  campground: customJoi.object({
    title: customJoi.string().required().htmlStrip(),
    price: customJoi.number().required().min(0),
    location: customJoi.string().required().htmlStrip(),
    description: customJoi.string().required().htmlStrip(),
  }).required(),
  deleteImages: customJoi.array().items(customJoi.string().uri()),
});

module.exports.reviewSchema = customJoi.object({
  review: customJoi.object({
    rating: customJoi.number().required().min(0).max(5),
    body: customJoi.string().required().htmlStrip(),
  }).required(),
});
