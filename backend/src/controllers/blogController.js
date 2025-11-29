import Blog from "../models/Blog.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { revalidate } from "../utils/revalidate.js";
import { throwIf } from "../utils/throwIf.js";

export const getBlogs = asyncHandler(async (req, res) => {
  const {
    status = "published",
    tag,
    category,
    featured,
    limit = 10,
    page = 1,
    sort = "-publishedAt,-createdAt",
  } = req.query;

  const query = { status };
  if (tag) query.tags = tag;
  if (category) query.category = category;
  if (featured) query.featured = featured === "true";

  const blogs = await Blog.find(query)
    .populate("author", "name avatar")
    .sort(sort.replace(/,/g, " "))
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Blog.countDocuments(query);

  res.json(
    ApiResponse.paginated(
      blogs,
      parseInt(page),
      parseInt(limit),
      total,
      "Blogs fetched successfully"
    )
  );
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const {
    tag,
    category,
    featured,
    limit = 10,
    page = 1,
    sort = "-publishedAt,-createdAt",
  } = req.query;

  const query = {};
  if (tag) query.tags = tag;
  if (category) query.category = category;
  if (featured) query.featured = featured === "true";

  const blogs = await Blog.find(query)
    .populate("author", "name avatar")
    .sort(sort.replace(/,/g, " "))
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Blog.countDocuments(query);

  res.json(
    ApiResponse.paginated(
      blogs,
      parseInt(page),
      parseInt(limit),
      total,
      "All blogs fetched successfully"
    )
  );
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate(
    "author",
    "name avatar"
  );
  throwIf(!blog, new NotFoundError("Blog not found"));
  res.json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export const createBlog = asyncHandler(async (req, res) => {
  let {
    title,
    content,
    excerpt,
    tags,
    category,
    status,
    seoTitle,
    seoDescription,
    featured,
  } = req.body;

  let tagsArray = [];
  if (tags && typeof tags === "string") {
    tagsArray = tags.split(",").map((tag) => tag.trim());
  } else if (Array.isArray(tags)) {
    tagsArray = tags;
  }

  let coverImage;
  if (req.files?.image) {
    const uploaded = await uploadImage(
      req.files.image.tempFilePath,
      "portfolio/blogs"
    );
    coverImage = {
      url: uploaded.url,
      public_id: uploaded.publicId,
    };
  }

  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const blogData = {
    title,
    content,
    excerpt,
    tags: tagsArray,
    category,
    status: status || "draft",
    readingTime,
    seoTitle: seoTitle || title,
    seoDescription: seoDescription || excerpt,
    author: req.user._id,
    featured: typeof featured === "string" ? featured === "true" : !!featured,
  };
  if (coverImage) {
    blogData.coverImage = coverImage;
  }

  const blog = new Blog(blogData);

  await blog.save();
  const createdBlog = await Blog.findById(blog._id).populate(
    "author",
    "name avatar"
  );

  res
    .status(201)
    .json(ApiResponse.created(createdBlog, "Blog created successfully"));

  await revalidate("blogs");
  await revalidate("homepage");
  if (createdBlog.slug) await revalidate(`blog-${createdBlog.slug}`);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  throwIf(!blog, new NotFoundError("Blog not found"));
  const updates = { ...req.body };

  if (updates.tags) {
    if (typeof updates.tags === "string") {
      updates.tags = updates.tags.split(",").map((tag) => tag.trim());
    } else if (!Array.isArray(updates.tags)) {
      updates.tags = [];
    }
  }

  if (req.files?.image) {
    if (blog.coverImage?.public_id) {
      await deleteImage(blog.coverImage.public_id);
    }
    const uploaded = await uploadImage(
      req.files.image.tempFilePath,
      "portfolio/blogs"
    );
    updates.coverImage = {
      url: uploaded.url,
      public_id: uploaded.publicId,
    };
  }

  if (updates.coverImage && typeof updates.coverImage === "string") {
    try {
      updates.coverImage = JSON.parse(updates.coverImage);
    } catch (e) {
      delete updates.coverImage;
    }
  }

  if (updates.coverImage === null || updates.coverImage === undefined) {
    delete updates.coverImage;
  }

  if (updates.content) {
    const wordCount = updates.content.trim().split(/\s+/).length;
    updates.readingTime = Math.ceil(wordCount / 200);
  }

  Object.assign(blog, updates);
  await blog.save();
  const updatedBlog = await Blog.findById(blog._id).populate(
    "author",
    "name avatar"
  );

  res.json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));

  await revalidate("blogs");
  await revalidate("homepage");
  if (updatedBlog.slug) await revalidate(`blog-${updatedBlog.slug}`);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  throwIf(!blog, new NotFoundError("Blog not found"));

  if (blog.coverImage?.public_id) {
    await deleteImage(blog.coverImage.public_id);
  }
  await blog.deleteOne();
  res.json(new ApiResponse(200, null, "Blog deleted successfully"));

  await revalidate("blogs");
  await revalidate("homepage");
  if (blog.slug) await revalidate(`blog-${blog.slug}`);
});

export const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await Blog.distinct("category");
  res.json(
    new ApiResponse(200, categories, "Blog categories fetched successfully")
  );
});

export const getBlogTags = asyncHandler(async (req, res) => {
  const tags = await Blog.distinct("tags");
  res.json(new ApiResponse(200, tags, "Blog tags fetched successfully"));
});
