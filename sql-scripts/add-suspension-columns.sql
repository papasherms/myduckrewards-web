-- Add suspension columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE;

-- Make sure is_active column exists and has a default
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update any NULL is_active values to true
UPDATE users 
SET is_active = true 
WHERE is_active IS NULL;