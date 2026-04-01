-- Adiciona data de nascimento aos membros da família
alter table family_members
  add column if not exists birth_date date;
