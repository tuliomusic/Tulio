-- Resumable uploads fail with 413 when file_size_limit is still 100 MB in production.
update storage.buckets
set file_size_limit = 2147483648
where id = 'site-media';
