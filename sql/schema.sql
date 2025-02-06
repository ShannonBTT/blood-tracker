-- Drop existing table if it exists
DROP TABLE IF EXISTS blood_tests;

-- Create blood_tests table with updated schema
CREATE TABLE blood_tests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  
  -- Store the entire form data as JSONB
  form_data jsonb NOT NULL,
  
  -- Status field
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived'))
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blood_tests_updated_at
  BEFORE UPDATE ON blood_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blood_tests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own blood tests"
  ON blood_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blood tests"
  ON blood_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blood tests"
  ON blood_tests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blood tests"
  ON blood_tests FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_blood_tests_user_id ON blood_tests(user_id);
CREATE INDEX idx_blood_tests_created_at ON blood_tests(created_at);
CREATE INDEX idx_blood_tests_collection_date ON blood_tests(collection_date);
CREATE INDEX idx_blood_tests_status ON blood_tests(status);

-- Add indexes
CREATE INDEX blood_tests_user_id_idx ON blood_tests(user_id);
CREATE INDEX blood_tests_created_at_idx ON blood_tests(created_at);