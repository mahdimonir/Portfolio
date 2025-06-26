import Profile from '../models/Profile.js';
import { APIError } from '../middleware/error.js';

/**
 * Get tech stack information
 */
export const getTechStack = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw new APIError('Profile not found', 404);
  }
  
  // Filter skills to only include those with category 'Technology'
  const techStack = profile.skills.filter(skill => 
    skill.category.toLowerCase() === 'technology' || 
    skill.category.toLowerCase() === 'tech'
  );
  
  res.json(techStack);
};