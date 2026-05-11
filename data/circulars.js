/* eslint-disable @typescript-eslint/no-require-imports */
const { universities } = require("./universities");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function circularForUniversity(university, index) {
  const title = `${university.name} Admission Circular 2026`;

  return {
    id: String(index + 1),
    universitySlug: university.slug,
    universityName: university.name,
    title,
    slug: slugify(title),
    summary: `Admission notice, eligibility, deadline, and exam information for ${university.name}.`,
    content: `${university.name} has published admission information for the 2026 session. Applicants should review eligibility, available programs, deadline, and exam schedule before applying.`,
    imageUrl: null,
    deadline: university.admissionDeadline || null,
    examDate: university.examDate || null,
    isFeatured: university.isFeatured,
    status: university.isFeatured ? "Published" : index % 5 === 0 ? "Draft" : "Published",
    createdAt: "2026-05-01",
  };
}

const circulars = universities.map(circularForUniversity);

module.exports = {
  circulars,
};
