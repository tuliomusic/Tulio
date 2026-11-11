-- Resumable uploads fail with 413 when file_size_limit is still 100 MB (0011) in production.
UPDATE storage.buckets
SET file_size_limit = 2147483648
WHERE id = 'site-media';
