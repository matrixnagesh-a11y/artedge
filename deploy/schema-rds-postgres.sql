-- ArtEDGE / OmniPulse AI Database Schema & Multi-Tenant RLS Policies
-- Native AWS RDS PostgreSQL / Aurora Serverless Compatible (pgvector + RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'professional',
    mode VARCHAR(50) NOT NULL DEFAULT 'company',
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'analyst',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Monitored Entities
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'company',
    website_url TEXT,
    social_urls JSONB DEFAULT '{}'::jsonb,
    industry VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Malaysia',
    state VARCHAR(100),
    city VARCHAR(100),
    aliases TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Content Items (Normalized Stream)
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    source_url TEXT NOT NULL,
    author_name VARCHAR(255),
    author_handle VARCHAR(255),
    author_avatar TEXT,
    author_influence_score INT DEFAULT 50,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    collection_method VARCHAR(50) NOT NULL,
    access_classification VARCHAR(50) NOT NULL,
    provider_used VARCHAR(100),
    confidence_score INT DEFAULT 90,
    sentiment VARCHAR(50) NOT NULL,
    sentiment_traffic_light VARCHAR(20) NOT NULL,
    emotions TEXT[] DEFAULT '{}',
    aspects JSONB DEFAULT '[]'::jsonb,
    credibility_score INT DEFAULT 85,
    manipulation_risk_score INT DEFAULT 15,
    credibility_classification VARCHAR(100),
    is_human_reviewed BOOLEAN DEFAULT FALSE,
    lead_intent_category VARCHAR(100),
    lead_intent_score INT,
    language VARCHAR(50) DEFAULT 'English',
    location VARCHAR(255),
    ip_address VARCHAR(45),
    geo_position JSONB DEFAULT '{}'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    assigned_analyst VARCHAR(255),
    internal_note TEXT
);

-- 5. IPSCAN Nodes Table
CREATE TABLE IF NOT EXISTS ipscan_nodes (
    id VARCHAR(50) PRIMARY KEY,
    ip_range VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    isp VARCHAR(150),
    asn VARCHAR(50),
    latency_ms INT DEFAULT 15,
    active_probes INT DEFAULT 10,
    threat_level VARCHAR(20) DEFAULT 'low'
);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
CREATE POLICY tenant_isolation_profiles ON profiles
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = CURRENT_USER::UUID));

CREATE POLICY tenant_isolation_entities ON entities
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = CURRENT_USER::UUID));

CREATE POLICY tenant_isolation_content_items ON content_items
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = CURRENT_USER::UUID));
