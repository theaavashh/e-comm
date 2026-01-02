-- First clear all shortDescription values to NULL
UPDATE "products" SET "shortDescription" = NULL WHERE "shortDescription" IS NOT NULL;

-- Show count of updated rows
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE "products" SET "shortDescription" = NULL WHERE "shortDescription" IS NOT NULL;
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % rows with shortDescription set to NULL', updated_count;
END $$;