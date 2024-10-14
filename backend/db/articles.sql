-- sql used to create the DB
-- this was executed directly via the terminal

CREATE DATABASE news_agg_main;

 CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY
    ,source VARCHAR(255) NOT NULL
    ,scraped BOOLEAN NOT NULL
    ,api BOOLEAN NOT NULL
    ,title VARCHAR(500) NOT NULL
    ,url VARCHAR(255) NOT NULL
    ,img VARCHAR(1000)
    ,category VARCHAR(255)
    ,first_scraped DATE
    ,days_found INT
    ,city_identifier VARCHAR(255)
    ,county_identifier VARCHAR(255)
    ,state_identifier VARCHAR(255)
    national_identifier VARCHAR(255)
    special_identifier VARCHAR(255)
    UNIQUE (url)
);
