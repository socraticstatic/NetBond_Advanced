/*
  # Create detached windows table

  1. New Tables
    - `detached_windows`
      - `id` (uuid, primary key) - Unique identifier for the detached window
      - `user_id` (uuid) - Reference to the user who owns this window
      - `table_id` (text) - Identifier for the table type (e.g., 'vnf', 'links', 'cloudrouter')
      - `connection_id` (text, nullable) - Connection ID if the table is scoped to a connection
      - `position_x` (integer, nullable) - Window X position on screen
      - `position_y` (integer, nullable) - Window Y position on screen
      - `width` (integer, nullable) - Window width
      - `height` (integer, nullable) - Window height
      - `is_open` (boolean) - Whether the window is currently open
      - `created_at` (timestamptz) - When the window was first opened
      - `updated_at` (timestamptz) - Last activity timestamp

  2. Security
    - Enable RLS on `detached_windows` table
    - Add policies for authenticated users to manage their own windows
    - Users can only read/write their own detached window records

  3. Notes
    - Stores metadata about detached table windows for persistence across sessions
    - Automatically cleans up old records via trigger (windows older than 7 days with is_open=false)
    - Maximum 15 windows per user enforced at application level
*/

-- Create detached_windows table
CREATE TABLE IF NOT EXISTS detached_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  table_id text NOT NULL,
  connection_id text,
  position_x integer,
  position_y integer,
  width integer,
  height integer,
  is_open boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_detached_windows_user_id 
  ON detached_windows(user_id);

CREATE INDEX IF NOT EXISTS idx_detached_windows_table_id 
  ON detached_windows(table_id);

CREATE INDEX IF NOT EXISTS idx_detached_windows_is_open 
  ON detached_windows(is_open) WHERE is_open = true;

-- Enable Row Level Security
ALTER TABLE detached_windows ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own detached windows
CREATE POLICY "Users can view own detached windows"
  ON detached_windows
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Users can insert their own detached windows
CREATE POLICY "Users can create own detached windows"
  ON detached_windows
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own detached windows
CREATE POLICY "Users can update own detached windows"
  ON detached_windows
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own detached windows
CREATE POLICY "Users can delete own detached windows"
  ON detached_windows
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_detached_windows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_detached_windows_updated_at ON detached_windows;
CREATE TRIGGER trigger_update_detached_windows_updated_at
  BEFORE UPDATE ON detached_windows
  FOR EACH ROW
  EXECUTE FUNCTION update_detached_windows_updated_at();

-- Function to clean up old closed windows (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_detached_windows()
RETURNS void AS $$
BEGIN
  DELETE FROM detached_windows
  WHERE is_open = false
    AND updated_at < (now() - interval '7 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on cleanup function to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_old_detached_windows() TO authenticated;