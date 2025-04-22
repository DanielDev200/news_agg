-- sql used to create the DB
-- this was executed directly via the terminal

CREATE DATABASE news_agg_main;

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    scraped BOOLEAN NOT NULL,
    api BOOLEAN NOT NULL,
    title VARCHAR(500) NOT NULL,
    url VARCHAR(255) NOT NULL,
    img VARCHAR(1000),
    category VARCHAR(255),
    sourced DATE,
    days_found INT,
    city_identifier VARCHAR(255),
    county_identifier VARCHAR(255),
    state_identifier VARCHAR(255),
    national_identifier VARCHAR(255),
    special_identifier VARCHAR(255),
    UNIQUE (url)
);

CREATE TABLE user_location (
    user_id VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE user_article_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    article_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_article_served (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    article_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_role (
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL UNIQUE,
    loads_in_iframe BOOLEAN NOT NULL,
    notes TEXT DEFAULT NULL
);

CREATE TABLE user_article_feed (
    user_id VARCHAR(255),
    article_id INT,
    placement INT UNSIGNED NOT NULL,
    tab VARCHAR(12) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    UNIQUE INDEX idx_article_placement (user_id, article_id, placement)
);
