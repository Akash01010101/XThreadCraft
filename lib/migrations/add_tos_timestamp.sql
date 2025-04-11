-- Add tos_timestamp column to chat_usage table
ALTER TABLE chat_usage
ADD COLUMN IF NOT EXISTS tos_timestamp TIMESTAMP WITH TIME ZONE;

-- Add comment to column
COMMENT ON COLUMN chat_usage.tos_timestamp IS 'Timestamp when user accepted terms of service';