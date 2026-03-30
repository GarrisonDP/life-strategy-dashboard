-- Dashboard settings (single row)
CREATE TABLE dashboard_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name text NOT NULL DEFAULT 'Garrison',
  current_age integer NOT NULL DEFAULT 52,
  birth_year integer NOT NULL DEFAULT 1974,
  retirement_age integer NOT NULL DEFAULT 62,
  target_net_worth bigint,
  timeline_zoom text NOT NULL DEFAULT 'comfortable',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Swim lanes
CREATE TABLE swim_lanes (
  id text PRIMARY KEY,
  label text NOT NULL,
  color text NOT NULL,
  color_light text NOT NULL,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Milestones
CREATE TABLE milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lane_id text NOT NULL REFERENCES swim_lanes(id),
  age numeric(4,1) NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('life', 'professional', 'financial')),
  icon text NOT NULL DEFAULT 'flag',
  color text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Net worth projection data points
CREATE TABLE net_worth_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer NOT NULL UNIQUE,
  net_worth bigint NOT NULL,
  retirement_savings bigint NOT NULL,
  note text,
  updated_at timestamptz DEFAULT now()
);

-- Disable RLS for MVP (single user)
ALTER TABLE dashboard_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE swim_lanes DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE net_worth_data DISABLE ROW LEVEL SECURITY;

-- Seed: swim lanes
INSERT INTO swim_lanes (id, label, color, color_light, visible, sort_order) VALUES
  ('career', 'Career', '#6366f1', '#e0e7ff', true, 0),
  ('savings', 'Savings / Investments', '#10b981', '#d1fae5', true, 1),
  ('insurance', 'Insurance', '#f59e0b', '#fef3c7', true, 2),
  ('legacy', 'Legacy / Inheritance', '#ec4899', '#fce7f3', true, 3);

-- Seed: dashboard settings
INSERT INTO dashboard_settings (owner_name, current_age, birth_year, retirement_age)
VALUES ('Garrison', 52, 1974, 62);

-- Seed: initial milestones
INSERT INTO milestones (lane_id, age, title, description, category, icon) VALUES
  ('career', 52.0, 'Communicate Retirement from Accenture', 'Formally communicate retirement decision to Accenture leadership', 'professional', 'flag'),
  ('career', 52.5, 'Communicate Intention to go to Slalom', 'Share plan to join Slalom with relevant stakeholders', 'professional', 'briefcase'),
  ('career', 54.0, 'Achieve Chief AI Officer Title', 'Reach CAIO designation at Slalom or next venture', 'professional', 'award');

-- Seed: net worth projection (placeholder growth curve)
INSERT INTO net_worth_data (age, net_worth, retirement_savings) VALUES
  (52, 1500000, 800000), (53, 1620000, 870000), (54, 1750000, 945000),
  (55, 1890000, 1025000), (56, 2040000, 1110000), (57, 2200000, 1200000),
  (58, 2370000, 1295000), (59, 2550000, 1395000), (60, 2740000, 1500000),
  (61, 2940000, 1610000), (62, 3150000, 1725000), (63, 3200000, 1760000),
  (64, 3250000, 1795000), (65, 3300000, 1830000), (66, 3350000, 1865000),
  (67, 3400000, 1900000), (68, 3450000, 1935000), (69, 3500000, 1970000),
  (70, 3550000, 2005000), (71, 3500000, 1980000), (72, 3450000, 1955000),
  (73, 3400000, 1930000), (74, 3350000, 1905000), (75, 3300000, 1880000),
  (76, 3250000, 1855000), (77, 3200000, 1830000), (78, 3150000, 1805000),
  (79, 3100000, 1780000), (80, 3050000, 1755000), (81, 3000000, 1730000),
  (82, 2950000, 1705000);
