/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require("pg");
const dotenv = require("dotenv");
const path = require("path");
const { universities } = require("../data/universities");
const { circulars } = require("../data/circulars");

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
});

async function seed() {
  try {
    await client.connect();
    console.log("Connected to database");

    // Create universities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        website TEXT,
        min_gpa NUMERIC,
        seat_count INTEGER,
        established_year INTEGER,
        ranking INTEGER,
        is_featured BOOLEAN DEFAULT false,
        programs JSONB DEFAULT '[]'::jsonb,
        admission_deadline DATE,
        exam_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Table 'universities' created or already exists.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS admission_circulars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        deadline DATE,
        exam_date DATE,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Table 'admission_circulars' created or already exists.");

    // Clear existing
    await client.query("DELETE FROM admission_circulars;");
    await client.query("DELETE FROM universities;");

    const universityIdsBySlug = new Map();

    // Insert data
    for (const u of universities) {
      const result = await client.query(
        `
        INSERT INTO universities (
          name, slug, type, location, description, website, min_gpa, seat_count, 
          established_year, ranking, is_featured, programs, admission_deadline, exam_date
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )
        RETURNING id, slug
      `,
        [
          u.name,
          u.slug,
          u.type,
          u.location,
          u.description,
          u.website,
          u.minGpa,
          u.seatCount,
          u.establishedYear,
          u.ranking,
          u.isFeatured,
          JSON.stringify(u.programs),
          u.admissionDeadline || null,
          u.examDate || null,
        ],
      );
      universityIdsBySlug.set(result.rows[0].slug, result.rows[0].id);
    }

    for (const circular of circulars) {
      await client.query(
        `
        INSERT INTO admission_circulars (
          university_id, title, slug, summary, content, image_url, deadline, exam_date, is_featured
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
      `,
        [
          universityIdsBySlug.get(circular.universitySlug) || null,
          circular.title,
          circular.slug,
          circular.summary,
          circular.content,
          circular.imageUrl,
          circular.deadline,
          circular.examDate,
          circular.isFeatured,
        ],
      );
    }

    console.log(
      `Seeded ${universities.length} universities and ${circulars.length} circulars successfully.`,
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seed();
