CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES ('Dan Abramov', 'http://abramovurl', 'Writing Resilient Components');

INSERT INTO blogs (author, url, title) 
VALUES ('Martin Fowler', 'http://fowlerurl', 'Is High Quality Software Worth the Cost?');
