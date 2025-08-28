-- Check if suspension columns exist in users table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('is_active', 'suspension_reason', 'suspended_at')
ORDER BY column_name;