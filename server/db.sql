CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "groups" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "movie_name" VARCHAR(255),
  "showtime" VARCHAR(255),
  "owner_id" INT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "group_members" (
  "group_id" INT NOT NULL,
  "user_id" INT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "movies" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "genre" VARCHAR(50),
  "release_date" DATE,
  "director" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "showtimes" (
  "id" SERIAL PRIMARY KEY,
  "movie_id" INT NOT NULL,
  "theater_name" VARCHAR(255),
  "start_time" TIMESTAMP,
  "end_time" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "movie_id" INT NOT NULL,
  "user_id" INT NOT NULL,
  "description" TEXT NOT NULL,
  "rating" INT DEFAULT (1),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "favorites" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "movie_id" INT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "message" TEXT NOT NULL,
  "is_read" BOOLEAN DEFAULT (false),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX ON "group_members" ("group_id", "user_id");

COMMENT ON COLUMN "reviews"."rating" IS '1 to 5';

ALTER TABLE "groups" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "group_members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE;

ALTER TABLE "group_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "showtimes" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE;

ALTER TABLE "reviews" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE;

ALTER TABLE "reviews" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "favorites" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "favorites" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
