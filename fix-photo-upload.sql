-- Fix photo upload by adding public_url column to customer_photos table
-- Run this in Supabase SQL Editor

ALTER TABLE customer_photos
ADD COLUMN IF NOT EXISTS public_url TEXT;

-- Update existing photos to regenerate their public URLs
-- You may need to re-upload existing photos for them to show
