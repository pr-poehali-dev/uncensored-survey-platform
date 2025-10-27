CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,
    profile_type VARCHAR(100) NOT NULL,
    question_1 TEXT NOT NULL,
    question_2 TEXT NOT NULL,
    question_3 TEXT NOT NULL,
    question_4 TEXT NOT NULL,
    question_5 TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_survey_profile ON survey_responses(profile_type);
CREATE INDEX idx_survey_created ON survey_responses(created_at);