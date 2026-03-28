ALTER TABLE "users" ADD COLUMN "password_hash" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "users" (lower("email"));