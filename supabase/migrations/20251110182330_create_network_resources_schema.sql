/*
  # Network Resources Management Schema

  ## Overview
  This migration creates a comprehensive schema for managing network resources including
  pools (groups), connections, cloud routers, links, and Virtual Network Functions (VNFs).
  It supports resource isolation, relationships, and advanced VNF type management.

  ## New Tables
  
  ### `pools`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Pool name
  - `description` (text) - Pool description
  - `type` (text) - Pool type: business, department, project, team, custom
  - `status` (text) - Status: active, inactive, suspended
  - `owner_id` (uuid) - Reference to users table
  - `parent_pool_id` (uuid) - For hierarchical pools
  - `tags` (jsonb) - Metadata tags
  - `attributes` (jsonb) - Custom attributes
  - `addresses` (jsonb) - Array of addresses
  - `contacts` (jsonb) - Array of contacts
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `connections`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Connection name
  - `type` (text) - Connection type
  - `status` (text) - Status: active, inactive, pending
  - `bandwidth` (text) - Bandwidth allocation
  - `location` (text) - Primary location
  - `pool_id` (uuid) - Reference to pools table
  - `provider` (text) - Cloud provider
  - `providers` (text[]) - Multiple providers
  - `locations` (text[]) - Multiple locations
  - `configuration` (jsonb) - Configuration details
  - `performance` (jsonb) - Performance metrics
  - `features` (jsonb) - Feature flags
  - `security` (jsonb) - Security settings
  - `billing` (jsonb) - Billing information
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `cloud_routers`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Router name
  - `description` (text) - Router description
  - `status` (text) - Status: active, inactive, provisioning, error
  - `location` (text) - Primary location
  - `locations` (text[]) - Multiple locations
  - `vendor` (text) - Vendor name
  - `vendors` (text[]) - Multiple vendors
  - `connection_id` (uuid) - Reference to connections table
  - `pool_id` (uuid) - Reference to pools table
  - `ipe_id` (text) - IPE identifier
  - `ipe_name` (text) - IPE name
  - `ipe_location` (text) - IPE location
  - `configuration` (jsonb) - Router configuration (ASN, BGP, etc.)
  - `policies` (jsonb) - Routing, security, QoS policies
  - `performance` (jsonb) - Performance metrics
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `links`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Link name
  - `vlan_id` (integer) - VLAN identifier
  - `description` (text) - Link description
  - `status` (text) - Status: active, inactive
  - `type` (text) - Link type: data, voice, management, storage, guest, dmz, other
  - `connection_id` (uuid) - Reference to connections table
  - `ip_subnet` (text) - IP subnet
  - `mtu` (integer) - Maximum transmission unit
  - `qos_priority` (integer) - QoS priority level
  - `link_bandwidth` (text) - Link bandwidth
  - `ipe_id` (text) - IPE identifier
  - `ipe_name` (text) - IPE name
  - `ipe_location` (text) - IPE location
  - `tags` (text[]) - Link tags
  - `performance` (jsonb) - Performance metrics
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `vnfs` (Virtual Network Functions)
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - VNF name
  - `type` (text) - VNF type: firewall, sdwan, router, vnat, load_balancer, ids_ips, custom
  - `vendor` (text) - Vendor name
  - `model` (text) - Model name
  - `version` (text) - Software version
  - `status` (text) - Status: active, inactive, provisioning, error
  - `throughput` (text) - Throughput capacity
  - `license_expiry` (timestamptz) - License expiration date
  - `description` (text) - VNF description
  - `connection_id` (uuid) - Reference to connections table
  - `cloud_router_id` (uuid) - Reference to cloud_routers table
  - `configuration` (jsonb) - VNF configuration (interfaces, protocols, etc.)
  - `performance` (jsonb) - Performance metrics
  - `position` (jsonb) - Position for visualization (x, y coordinates)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `vnf_templates`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Template name
  - `description` (text) - Template description
  - `type` (text) - VNF type
  - `vendor` (text) - Vendor name
  - `model` (text) - Model name
  - `throughput` (text) - Throughput capacity
  - `default_configuration` (jsonb) - Default configuration
  - `recommended_use_case` (text) - Recommended use case
  - `license_required` (boolean) - License requirement flag
  - `pricing` (jsonb) - Pricing information
  - `rating` (decimal) - Average rating (0-5)
  - `rating_count` (integer) - Number of ratings
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `link_cloud_router_associations`
  - Junction table for many-to-many relationship between links and cloud routers
  - `link_id` (uuid) - Reference to links table
  - `cloud_router_id` (uuid) - Reference to cloud_routers table
  - `created_at` (timestamptz) - Creation timestamp

  ### `pool_users`
  - Junction table for pool membership
  - `pool_id` (uuid) - Reference to pools table
  - `user_id` (uuid) - Reference to auth.users
  - `permission_level` (text) - Permission: read, write, admin
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - RLS enabled on all tables
  - Policies restrict access to authenticated users
  - Users can only access pools they are members of
  - Pool admins can manage pool resources
  - Connection and router access controlled by pool membership

  ## Indexes
  - Indexes on foreign keys for performance
  - Indexes on frequently queried fields (status, type)
  - GIN indexes on JSONB columns for fast queries
*/

-- Create pools table
CREATE TABLE IF NOT EXISTS pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'custom',
  status text NOT NULL DEFAULT 'active',
  owner_id uuid NOT NULL,
  parent_pool_id uuid REFERENCES pools(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '{}',
  attributes jsonb DEFAULT '{}',
  addresses jsonb DEFAULT '[]',
  contacts jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  bandwidth text NOT NULL,
  location text NOT NULL,
  pool_id uuid REFERENCES pools(id) ON DELETE SET NULL,
  provider text,
  providers text[],
  locations text[],
  configuration jsonb DEFAULT '{}',
  performance jsonb DEFAULT '{}',
  features jsonb DEFAULT '{}',
  security jsonb DEFAULT '{}',
  billing jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cloud_routers table
CREATE TABLE IF NOT EXISTS cloud_routers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'provisioning',
  location text NOT NULL,
  locations text[],
  vendor text,
  vendors text[],
  connection_id uuid REFERENCES connections(id) ON DELETE CASCADE,
  pool_id uuid REFERENCES pools(id) ON DELETE SET NULL,
  ipe_id text,
  ipe_name text,
  ipe_location text,
  configuration jsonb DEFAULT '{}',
  policies jsonb DEFAULT '{}',
  performance jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vlan_id integer NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  type text DEFAULT 'data',
  connection_id uuid REFERENCES connections(id) ON DELETE CASCADE,
  ip_subnet text,
  mtu integer DEFAULT 1500,
  qos_priority integer DEFAULT 0,
  link_bandwidth text,
  ipe_id text,
  ipe_name text,
  ipe_location text,
  tags text[],
  performance jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vnfs table
CREATE TABLE IF NOT EXISTS vnfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  vendor text NOT NULL,
  model text,
  version text,
  status text NOT NULL DEFAULT 'provisioning',
  throughput text,
  license_expiry timestamptz,
  description text DEFAULT '',
  connection_id uuid REFERENCES connections(id) ON DELETE CASCADE,
  cloud_router_id uuid REFERENCES cloud_routers(id) ON DELETE SET NULL,
  configuration jsonb DEFAULT '{}',
  performance jsonb DEFAULT '{}',
  position jsonb DEFAULT '{"x": 0, "y": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vnf_templates table
CREATE TABLE IF NOT EXISTS vnf_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  vendor text NOT NULL,
  model text,
  throughput text NOT NULL,
  default_configuration jsonb DEFAULT '{}',
  recommended_use_case text,
  license_required boolean DEFAULT false,
  pricing jsonb DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create link_cloud_router_associations table
CREATE TABLE IF NOT EXISTS link_cloud_router_associations (
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  cloud_router_id uuid REFERENCES cloud_routers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (link_id, cloud_router_id)
);

-- Create pool_users table
CREATE TABLE IF NOT EXISTS pool_users (
  pool_id uuid REFERENCES pools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  permission_level text NOT NULL DEFAULT 'read',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (pool_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pools_owner_id ON pools(owner_id);
CREATE INDEX IF NOT EXISTS idx_pools_parent_pool_id ON pools(parent_pool_id);
CREATE INDEX IF NOT EXISTS idx_pools_status ON pools(status);
CREATE INDEX IF NOT EXISTS idx_pools_type ON pools(type);
CREATE INDEX IF NOT EXISTS idx_pools_tags ON pools USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_connections_pool_id ON connections(pool_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_type ON connections(type);

CREATE INDEX IF NOT EXISTS idx_cloud_routers_connection_id ON cloud_routers(connection_id);
CREATE INDEX IF NOT EXISTS idx_cloud_routers_pool_id ON cloud_routers(pool_id);
CREATE INDEX IF NOT EXISTS idx_cloud_routers_status ON cloud_routers(status);

CREATE INDEX IF NOT EXISTS idx_links_connection_id ON links(connection_id);
CREATE INDEX IF NOT EXISTS idx_links_vlan_id ON links(vlan_id);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);

CREATE INDEX IF NOT EXISTS idx_vnfs_connection_id ON vnfs(connection_id);
CREATE INDEX IF NOT EXISTS idx_vnfs_cloud_router_id ON vnfs(cloud_router_id);
CREATE INDEX IF NOT EXISTS idx_vnfs_type ON vnfs(type);
CREATE INDEX IF NOT EXISTS idx_vnfs_status ON vnfs(status);

CREATE INDEX IF NOT EXISTS idx_vnf_templates_type ON vnf_templates(type);
CREATE INDEX IF NOT EXISTS idx_vnf_templates_vendor ON vnf_templates(vendor);
CREATE INDEX IF NOT EXISTS idx_vnf_templates_is_active ON vnf_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_pool_users_user_id ON pool_users(user_id);

-- Enable Row Level Security
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_routers ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE vnfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vnf_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_cloud_router_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pools
CREATE POLICY "Users can view pools they are members of"
  ON pools FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM pool_users
      WHERE pool_users.pool_id = pools.id
      AND pool_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Pool owners can update their pools"
  ON pools FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create pools"
  ON pools FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Pool owners can delete their pools"
  ON pools FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- RLS Policies for connections
CREATE POLICY "Users can view connections in their pools"
  ON connections FOR SELECT
  TO authenticated
  USING (
    pool_id IS NULL OR
    EXISTS (
      SELECT 1 FROM pool_users
      WHERE pool_users.pool_id = connections.pool_id
      AND pool_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Pool admins can manage connections"
  ON connections FOR ALL
  TO authenticated
  USING (
    pool_id IS NULL OR
    EXISTS (
      SELECT 1 FROM pool_users
      WHERE pool_users.pool_id = connections.pool_id
      AND pool_users.user_id = auth.uid()
      AND pool_users.permission_level = 'admin'
    )
  );

-- RLS Policies for cloud_routers
CREATE POLICY "Users can view cloud routers in their connections"
  ON cloud_routers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = cloud_routers.connection_id
      AND (connections.pool_id IS NULL OR pool_users.user_id = auth.uid())
    )
  );

CREATE POLICY "Pool admins can manage cloud routers"
  ON cloud_routers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = cloud_routers.connection_id
      AND (
        connections.pool_id IS NULL OR
        (pool_users.user_id = auth.uid() AND pool_users.permission_level = 'admin')
      )
    )
  );

-- RLS Policies for links
CREATE POLICY "Users can view links in their connections"
  ON links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = links.connection_id
      AND (connections.pool_id IS NULL OR pool_users.user_id = auth.uid())
    )
  );

CREATE POLICY "Pool admins can manage links"
  ON links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = links.connection_id
      AND (
        connections.pool_id IS NULL OR
        (pool_users.user_id = auth.uid() AND pool_users.permission_level = 'admin')
      )
    )
  );

-- RLS Policies for vnfs
CREATE POLICY "Users can view VNFs in their connections"
  ON vnfs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = vnfs.connection_id
      AND (connections.pool_id IS NULL OR pool_users.user_id = auth.uid())
    )
  );

CREATE POLICY "Pool admins can manage VNFs"
  ON vnfs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE connections.id = vnfs.connection_id
      AND (
        connections.pool_id IS NULL OR
        (pool_users.user_id = auth.uid() AND pool_users.permission_level = 'admin')
      )
    )
  );

-- RLS Policies for vnf_templates
CREATE POLICY "Authenticated users can view active VNF templates"
  ON vnf_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can create VNF templates"
  ON vnf_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for link_cloud_router_associations
CREATE POLICY "Users can view associations for their resources"
  ON link_cloud_router_associations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM links
      JOIN connections ON connections.id = links.connection_id
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE links.id = link_cloud_router_associations.link_id
      AND (connections.pool_id IS NULL OR pool_users.user_id = auth.uid())
    )
  );

CREATE POLICY "Pool admins can manage associations"
  ON link_cloud_router_associations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM links
      JOIN connections ON connections.id = links.connection_id
      LEFT JOIN pool_users ON pool_users.pool_id = connections.pool_id
      WHERE links.id = link_cloud_router_associations.link_id
      AND (
        connections.pool_id IS NULL OR
        (pool_users.user_id = auth.uid() AND pool_users.permission_level = 'admin')
      )
    )
  );

-- RLS Policies for pool_users
CREATE POLICY "Users can view pool memberships"
  ON pool_users FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM pool_users pu2
      WHERE pu2.pool_id = pool_users.pool_id
      AND pu2.user_id = auth.uid()
      AND pu2.permission_level = 'admin'
    )
  );

CREATE POLICY "Pool admins can manage memberships"
  ON pool_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pool_users pu2
      WHERE pu2.pool_id = pool_users.pool_id
      AND pu2.user_id = auth.uid()
      AND pu2.permission_level = 'admin'
    )
  );