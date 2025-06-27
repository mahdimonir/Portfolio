import Article from '../models/Article.js';
import { APIError } from '../middleware/error.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

/**
 * Get all articles
 */
export const getArticles = async (req, res) => {
  const { status, tag, category, limit = 10, page = 1 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (tag) query.tags = tag;
  if (category) query.category = category;

  const articles = await Article.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip((page - 1) * limit)
    .select('-content'); // Exclude content for list view

  const total = await Article.countDocuments(query);

  res.json({
    articles,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    total
  });
};

/**
 * Get article by slug
 */
export const getArticleBySlug = async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) {
    throw new APIError('Article not found', 404);
  }
  res.json(article);
};

/**
 * Create new article
 */
export const createArticle = async (req, res) => {
  const {
    title,
    content,
    excerpt,
    tags,
    category,
    status,
    seoTitle,
    seoDescription,
    author
  } = req.body;

  // Handle cover image upload if provided
  let coverImageUrl;
  if (req.body.coverImage) {
    const uploadResult = await uploadImage(req.body.coverImage, 'portfolio/articles');
    coverImageUrl = uploadResult.url;
  }

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const article = new Article({
    title,
    content,
    excerpt,
    coverImage: coverImageUrl,
    tags,
    category,
    status,
    readingTime,
    seoTitle: seoTitle || title,
    seoDescription: seoDescription || excerpt,
    author
  });

  await article.save();
  res.status(201).json(article);
};

/**
 * Update article
 */
export const updateArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    throw new APIError('Article not found', 404);
  }

  const updates = { ...req.body };

  // Handle cover image update
  if (req.body.coverImage && req.body.coverImage !== article.coverImage) {
    const uploadResult = await uploadImage(req.body.coverImage, 'portfolio/articles');
    updates.coverImage = uploadResult.url;

    // Delete old cover image if exists
    if (article.coverImage) {
      const oldImageId = article.coverImage.split('/').slice(-2).join('/');
      await deleteImage(oldImageId);
    }
  }

  // Recalculate reading time if content changed
  if (updates.content) {
    const wordCount = updates.content.trim().split(/\s+/).length;
    updates.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (updates.status === 'published' && article.status !== 'published') {
    updates.publishedAt = new Date();
  }

  Object.assign(article, updates);
  await article.save();

  res.json(article);
};

/**
 * Delete article
 */
export const deleteArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    throw new APIError('Article not found', 404);
  }

  // Delete cover image from Cloudinary if exists
  if (article.coverImage) {
    const imageId = article.coverImage.split('/').slice(-2).join('/');
    await deleteImage(imageId);
  }

  await article.remove();
  res.json({ message: 'Article deleted successfully' });
};

/**
 * Get article categories
 */
export const getCategories = async (req, res) => {
  const categories = await Article.distinct('category');
  res.json(categories);
};

/**
 * Get article tags
 */
export const getTags = async (req, res) => {
  const tags = await Article.distinct('tags');
  res.json(tags);
};