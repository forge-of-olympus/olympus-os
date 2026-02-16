-- Create table for storing social connection metadata and stats
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    handle TEXT,
    avatar_url TEXT,
    
    -- Stats
    followers_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Store raw tokens/metadata if needed (be careful with sensitive tokens)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Ensure one connection per platform per user
    UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own connections" 
    ON public.social_connections FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections" 
    ON public.social_connections FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections" 
    ON public.social_connections FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
    ON public.social_connections FOR DELETE 
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_social_connections_updated_at
    BEFORE UPDATE ON public.social_connections
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
