ALTER TABLE "posts" RENAME COLUMN "type" TO "category";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "tag" SET DATA TYPE text[]
USING CASE
  WHEN "tag" IS NULL THEN NULL
  ELSE string_to_array("tag", ',')
END;