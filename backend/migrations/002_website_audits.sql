CREATE TABLE website_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL
        REFERENCES clients(id)
        ON DELETE CASCADE,

    website_url TEXT NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    seo_score INTEGER,
    technical_score INTEGER,
    performance_score INTEGER,
    accessibility_score INTEGER,
    overall_score INTEGER,

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    error_message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);