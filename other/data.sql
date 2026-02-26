CREATE TABLE participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_submit_id VARCHAR(12) NOT NULL, -- nouvel identifiant généré côté client
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age_category ENUM('adult', 'child', 'toddler', 'baby') NOT NULL,
    contribution VARCHAR(255),
    medical_issues ENUM('no', 'yes', 'private') NOT NULL DEFAULT 'no',
    medical_details TEXT,
    is_driver BOOLEAN NOT NULL,
    has_space BOOLEAN,
    capacity INT DEFAULT 0,
    vehicle VARCHAR(255),
    phone VARCHAR(50),
    accompagnant_is_driver BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accompagnants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age_category ENUM('adult', 'child', 'toddler', 'baby') NOT NULL,
    contribution VARCHAR(255),
    allergies ENUM('no', 'yes', 'private') NOT NULL DEFAULT 'no',
    medical_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_participant
        FOREIGN KEY (participant_id)
        REFERENCES participants(id)
        ON DELETE CASCADE
);
