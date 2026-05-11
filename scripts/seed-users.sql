-- Test Users Seed Script
-- Run this in Supabase SQL Editor to create test users
-- 
-- IMPORTANT: These are test users only. Replace with real users before production.
-- 
-- Created test users:
-- 1. student1@test.uathelp.com (Student role)
-- 2. student2@test.uathelp.com (Student role)
-- 3. moderator@test.uathelp.com (Moderator role)
-- 4. admin@test.uathelp.com (Admin role)
-- 5. superadmin@test.uathelp.com (Super Admin role)

-- NOTE: You need to use the Supabase Auth Admin API to create auth users
-- This SQL only creates the profiles. Use the Node.js seed script (scripts/seed-users.ts)
-- or manually create users through Supabase Dashboard for complete setup.

-- After creating auth users via Dashboard or seed script, update their profiles:

-- Student 1
insert into public.profiles (id, email, full_name, role, is_verified, is_blocked)
values (
  (select id from auth.users where email = 'student1@test.uathelp.com' limit 1),
  'student1@test.uathelp.com',
  'Ahmed Student',
  'student',
  true,
  false
) on conflict (id) do update set role = 'student', is_verified = true, is_blocked = false;

-- Student 2
insert into public.profiles (id, email, full_name, role, is_verified, is_blocked)
values (
  (select id from auth.users where email = 'student2@test.uathelp.com' limit 1),
  'student2@test.uathelp.com',
  'Fatima Student',
  'student',
  true,
  false
) on conflict (id) do update set role = 'student', is_verified = true, is_blocked = false;

-- Moderator
insert into public.profiles (id, email, full_name, role, is_verified, is_blocked)
values (
  (select id from auth.users where email = 'moderator@test.uathelp.com' limit 1),
  'moderator@test.uathelp.com',
  'Mowgli Moderator',
  'moderator',
  true,
  false
) on conflict (id) do update set role = 'moderator', is_verified = true, is_blocked = false;

-- Admin
insert into public.profiles (id, email, full_name, role, is_verified, is_blocked)
values (
  (select id from auth.users where email = 'admin@test.uathelp.com' limit 1),
  'admin@test.uathelp.com',
  'Admin User',
  'admin',
  true,
  false
) on conflict (id) do update set role = 'admin', is_verified = true, is_blocked = false;

-- Super Admin
insert into public.profiles (id, email, full_name, role, is_verified, is_blocked)
values (
  (select id from auth.users where email = 'superadmin@test.uathelp.com' limit 1),
  'superadmin@test.uathelp.com',
  'Super Admin',
  'super_admin',
  true,
  false
) on conflict (id) do update set role = 'super_admin', is_verified = true, is_blocked = false;

-- Verify profiles were created
select id, email, full_name, role, is_verified, is_blocked, created_at 
from public.profiles 
where email like '%@test.uathelp.com'
order by created_at desc;
