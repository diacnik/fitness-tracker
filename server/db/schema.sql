CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    profile_picture VARCHAR(255),
    username VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE connections (
  id SERIAL PRIMARY KEY,
  user_low_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_high_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending','accepted','blocked')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT not_self CHECK (user_low_id <> user_high_id),
  CONSTRAINT unique_pair UNIQUE (user_low_id, user_high_id),
  CONSTRAINT requested_by_in_pair CHECK (requested_by IN (user_low_id, user_high_id))
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('run', 'climb', 'bike', 'other', 'hike')),
    distance DECIMAL(10, 2),
    duration INT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
