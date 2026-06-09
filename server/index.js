const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { getDb, initDb } = require('./db');

initDb();

const app = express();
app.use(cors());
app.use(express.json());

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');

function ensureExportsDir() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

function formatTimestampForFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

function buildExportPayload(submission, answerRows) {
  return {
    submissionId: submission.id,
    createdAt: submission.created_at,
    status: submission.status,
    answers: answerRows.map((row) => ({
      questionId: row.question_id,
      fieldKey: row.field_key,
      label: row.label_nl,
      answer: row.answer_text,
      subQuestionLabel: row.sub_question_label,
      subAnswer: row.sub_answer_text,
    })),
  };
}

function writeJsonExport(baseName, payload) {
  const filePath = path.join(EXPORTS_DIR, `${baseName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
  return filePath;
}

function writePdfExport(baseName, payload) {
  const filePath = path.join(EXPORTS_DIR, `${baseName}.pdf`);
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('Usecase Export', { underline: true });
  doc.moveDown();
  doc.fontSize(11).text(`Submission ID: ${payload.submissionId}`);
  doc.text(`Created at: ${payload.createdAt}`);
  doc.text(`Status: ${payload.status}`);
  doc.moveDown();

  payload.answers.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item.label}`);
    const answer = item.answer && item.answer.trim() ? item.answer : 'Niet beantwoord';
    doc.fontSize(10).text(`Antwoord: ${answer}`);

    if (item.subQuestionLabel) {
      const subAnswer = item.subAnswer && item.subAnswer.trim() ? item.subAnswer : 'Niet beantwoord';
      doc.text(`${item.subQuestionLabel}: ${subAnswer}`);
    }

    doc.moveDown(0.8);
  });

  doc.end();
  return filePath;
}

function createSubmissionExports(submission, answerRows) {
  ensureExportsDir();
  const timestamp = formatTimestampForFilename();
  const baseName = `submission-${submission.id}-${timestamp}`;
  const payload = buildExportPayload(submission, answerRows);

  const jsonPath = writeJsonExport(baseName, payload);
  const pdfPath = writePdfExport(baseName, payload);

  return {
    jsonFile: jsonPath,
    pdfFile: pdfPath,
  };
}

// ─── GET all questions (ordered by step & sort) ───
app.get('/api/questions', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM questions ORDER BY step_number, sort_order').all();
  db.close();
  res.json(rows);
});

// ─── GET example use cases ───
app.get('/api/examples', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM example_usecases ORDER BY id').all();
  db.close();
  res.json(rows.map((r) => ({ ...r, data: JSON.parse(r.data_json) })));
});

// ─── POST a new submission ───
app.post('/api/submissions', (req, res) => {
  const db = getDb();
  const { answers } = req.body; // [{ question_id, answer_text, sub_answer_text? }]

  if (!Array.isArray(answers) || answers.length === 0) {
    db.close();
    return res.status(400).json({ error: 'answers array is required' });
  }

  const insertSubmission = db.prepare(
    "INSERT INTO submissions (status) VALUES ('completed')"
  );
  const insertAnswer = db.prepare(
    'INSERT INTO answers (submission_id, question_id, answer_text, sub_answer_text) VALUES (?, ?, ?, ?)'
  );

  const submit = db.transaction((answersData) => {
    const { lastInsertRowid: submissionId } = insertSubmission.run();
    for (const a of answersData) {
      insertAnswer.run(
        submissionId,
        a.question_id,
        a.answer_text || '',
        a.sub_answer_text || null
      );
    }
    return submissionId;
  });

  try {
    const submissionId = submit(answers);
    const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(submissionId);
    const answerRows = db.prepare(`
      SELECT a.question_id, a.answer_text, a.sub_answer_text, q.field_key, q.label_nl, q.sub_question_label
      FROM answers a
      JOIN questions q ON q.id = a.question_id
      WHERE a.submission_id = ?
      ORDER BY q.sort_order
    `).all(submissionId);

    const exportsResult = createSubmissionExports(submission, answerRows);
    db.close();
    res.status(201).json({
      id: submissionId,
      exportFiles: exportsResult,
    });
  } catch (err) {
    db.close();
    res.status(500).json({ error: err.message });
  }
});

// ─── GET all submissions with answers ───
app.get('/api/submissions', (_req, res) => {
  const db = getDb();
  const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
  const getAnswers = db.prepare(`
    SELECT a.*, q.field_key, q.label_nl, q.has_sub_question, q.sub_question_label
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.submission_id = ?
    ORDER BY q.sort_order
  `);
  const result = submissions.map((s) => ({
    ...s,
    answers: getAnswers.all(s.id),
  }));
  db.close();
  res.json(result);
});

// ─── GET single submission ───
app.get('/api/submissions/:id', (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    db.close();
    return res.status(400).json({ error: 'Invalid submission id' });
  }
  const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
  if (!submission) {
    db.close();
    return res.status(404).json({ error: 'Not found' });
  }
  const answers = db.prepare(`
    SELECT a.*, q.field_key, q.label_nl, q.has_sub_question, q.sub_question_label
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.submission_id = ?
    ORDER BY q.sort_order
  `).all(id);
  db.close();
  res.json({ ...submission, answers });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
