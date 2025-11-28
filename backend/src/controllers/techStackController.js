// src/controllers/techStackController.js
import { TechStack } from "../models/TechStack.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { revalidate } from "../utils/revalidate.js";
import { throwIf } from "../utils/throwIf.js";

const allowedCategories = ["Frontend", "Backend", "Database", "DevOps & Tools"];

// CREATE tech stack item
export const createTech = asyncHandler(async (req, res) => {
  const { name, tagline, icon, color, category } = req.body;

  throwIf(
    !allowedCategories.includes(category),
    new ValidationError("Invalid tech stack category")
  );

  const existingCategory = await TechStack.findOne({ category });

  if (existingCategory) {
    existingCategory.technologies.push({ name, tagline, icon, color });
    await existingCategory.save();
    return res.json(
      new ApiResponse(201, existingCategory, "Technology added to category")
    );
  }

  const newStack = await TechStack.create({
    category,
    technologies: [{ name, tagline, icon, color }],
  });

  res.json(new ApiResponse(201, newStack, "Tech stack created"));

  await revalidate("techstack");
  await revalidate("homepage");
});

// UPDATE tech item by name
export const updateTech = asyncHandler(async (req, res) => {
  const { category, name } = req.params;
  const { newName, tagline, icon, color } = req.body;

  const stack = await TechStack.findOne({ category });
  throwIf(!stack, new NotFoundError("Category not found"));

  const tech = stack.technologies.find((tech) => tech.name === name);
  throwIf(!tech, new NotFoundError("Technology not found"));

  if (newName) tech.name = newName;
  if (tagline) tech.tagline = tagline;
  if (icon) tech.icon = icon;
  if (color) tech.color = color;

  await stack.save();
  res.json(new ApiResponse(200, stack, "Technology updated"));

  await revalidate("techstack");
  await revalidate("homepage");
});

// DELETE tech item by name and category
export const deleteTech = asyncHandler(async (req, res) => {
  const { category, name } = req.params;

  const stack = await TechStack.findOne({ category });
  throwIf(!stack, new NotFoundError("Category not found"));

  const filtered = stack.technologies.filter((tech) => tech.name !== name);

  if (filtered.length === stack.technologies.length) {
    throw new NotFoundError("Technology not found in category");
  }

  stack.technologies = filtered;
  await stack.save();

  res.json(new ApiResponse(200, stack, "Technology deleted"));

  await revalidate("techstack");
  await revalidate("homepage");
});

// GET all tech stacks
export const getAllTechStacks = asyncHandler(async (req, res) => {
  const stacks = await TechStack.find();
  res.json(new ApiResponse(200, stacks, "Fetched all tech stacks"));
});
