-- Crear un nuevo bucket de almacenamiento público llamado "uploads"
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- 1. Permitir que cualquiera pueda leer (ver) las imágenes del bucket "uploads"
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'uploads' );

-- 2. Permitir que cualquiera pueda subir archivos (insertar) al bucket "uploads"
create policy "Public Insert"
  on storage.objects for insert
  with check ( bucket_id = 'uploads' );

-- 3. Permitir que cualquiera pueda borrar o modificar si fuera necesario en el admin
create policy "Public Update"
  on storage.objects for update
  using ( bucket_id = 'uploads' );

create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id = 'uploads' );
