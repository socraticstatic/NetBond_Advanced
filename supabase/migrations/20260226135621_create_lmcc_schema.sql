/*
  # LMCC (Layer 3 Managed Cloud Connectivity) Schema

  1. New Tables
    - `lmcc_sites`
      - `id` (uuid, primary key) - Unique site identifier
      - `name` (text) - Site display name
      - `address` (text) - Street address
      - `city` (text) - City name
      - `state` (text) - State code
      - `zip` (text) - ZIP/postal code
      - `country` (text) - Country code
      - `region` (text) - Geographic region
      - `latitude` (numeric) - GPS latitude
      - `longitude` (numeric) - GPS longitude
      - `availability` (text) - Site availability status
      - `created_at` (timestamptz) - Creation timestamp

    - `lmcc_configurations`
      - `id` (uuid, primary key) - Configuration identifier
      - `vnf_id` (text) - Foreign key to VNF
      - `selected_sites` (jsonb) - Array of selected site IDs
      - `bandwidth_allocations` (jsonb) - Bandwidth per site
      - `tao_config` (jsonb) - Termination and orchestration config
      - `status` (text) - Configuration status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_by` (uuid) - User who created (references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users

  3. Indexes
    - Index on vnf_id for efficient lookups
    - Index on status for filtering

  ## Important Notes
  - LMCC sites are pre-populated with US locations
  - Bandwidth allocations stored as JSONB for flexibility
  - TAO configuration includes BGP, IP, and routing settings
*/

-- Create LMCC sites table
CREATE TABLE IF NOT EXISTS lmcc_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  region text NOT NULL,
  latitude numeric,
  longitude numeric,
  availability text NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'unavailable')),
  created_at timestamptz DEFAULT now()
);

-- Create LMCC configurations table
CREATE TABLE IF NOT EXISTS lmcc_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vnf_id text NOT NULL,
  selected_sites jsonb NOT NULL DEFAULT '[]'::jsonb,
  bandwidth_allocations jsonb NOT NULL DEFAULT '[]'::jsonb,
  tao_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lmcc_configurations_vnf_id ON lmcc_configurations(vnf_id);
CREATE INDEX IF NOT EXISTS idx_lmcc_configurations_status ON lmcc_configurations(status);

-- Enable Row Level Security
ALTER TABLE lmcc_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE lmcc_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lmcc_sites (public read access)
CREATE POLICY "Anyone can view LMCC sites"
  ON lmcc_sites FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for lmcc_configurations
CREATE POLICY "Users can view all LMCC configurations"
  ON lmcc_configurations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert LMCC configurations"
  ON lmcc_configurations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update LMCC configurations"
  ON lmcc_configurations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete LMCC configurations"
  ON lmcc_configurations FOR DELETE
  TO authenticated
  USING (true);

-- Populate LMCC sites with US locations
INSERT INTO lmcc_sites (name, address, city, state, zip, country, region, latitude, longitude, availability) VALUES
  ('San Francisco Metro', '123 Market Street', 'San Francisco', 'CA', '94105', 'US', 'US-West', 37.7749, -122.4194, 'available'),
  ('New York Metro', '350 Fifth Avenue', 'New York', 'NY', '10118', 'US', 'US-East', 40.7128, -74.0060, 'available'),
  ('Chicago Metro', '233 S Wacker Drive', 'Chicago', 'IL', '60606', 'US', 'US-Central', 41.8781, -87.6298, 'available'),
  ('Dallas Metro', '2200 Ross Avenue', 'Dallas', 'TX', '75201', 'US', 'US-South', 32.7767, -96.7970, 'available'),
  ('Los Angeles Metro', '633 West Fifth Street', 'Los Angeles', 'CA', '90071', 'US', 'US-West', 34.0522, -118.2437, 'available'),
  ('Seattle Metro', '1918 Eighth Avenue', 'Seattle', 'WA', '98101', 'US', 'US-West', 47.6062, -122.3321, 'available'),
  ('Boston Metro', '185 Franklin Street', 'Boston', 'MA', '02110', 'US', 'US-East', 42.3601, -71.0589, 'available'),
  ('Atlanta Metro', '191 Peachtree Street', 'Atlanta', 'GA', '30303', 'US', 'US-South', 33.7490, -84.3880, 'available'),
  ('Denver Metro', '1801 California Street', 'Denver', 'CO', '80202', 'US', 'US-Central', 39.7392, -104.9903, 'available'),
  ('Miami Metro', '701 Brickell Avenue', 'Miami', 'FL', '33131', 'US', 'US-South', 25.7617, -80.1918, 'available'),
  ('Phoenix Metro', '100 N Central Avenue', 'Phoenix', 'AZ', '85004', 'US', 'US-West', 33.4484, -112.0740, 'available'),
  ('Portland Metro', '121 SW Salmon Street', 'Portland', 'OR', '97204', 'US', 'US-West', 45.5152, -122.6784, 'available'),
  ('Austin Metro', '300 W 6th Street', 'Austin', 'TX', '78701', 'US', 'US-South', 30.2672, -97.7431, 'available'),
  ('Charlotte Metro', '214 North Tryon Street', 'Charlotte', 'NC', '28202', 'US', 'US-East', 35.2271, -80.8431, 'available'),
  ('Minneapolis Metro', '80 South 8th Street', 'Minneapolis', 'MN', '55402', 'US', 'US-Central', 44.9778, -93.2650, 'available')
ON CONFLICT DO NOTHING;