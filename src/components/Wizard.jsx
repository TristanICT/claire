import { useEffect, useState } from 'react';

const STEP_LABELS = [
  'Basis',
  'Vraag',
  'Antwoord',
  'Contact',
  'Labels',
  'Logica',
  'SLA & Team',
  'Overig',
];

export default function Wizard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [subAnswers, setSubAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isReviewing, setIsReviewing] = useState(false);

  const totalSteps = STEP_LABELS.length;

  useEffect(() => {
    fetch('/api/questions')
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stepQuestions = questions.filter((q) => q.step_number === currentStep);

  function handleChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubChange(questionId, value) {
    setSubAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleTagToggle(questionId, tag, options) {
    const current = answers[questionId] || [];
    const arr = Array.isArray(current) ? current : [];
    if (arr.includes(tag)) {
      handleChange(questionId, arr.filter((t) => t !== tag));
    } else {
      handleChange(questionId, [...arr, tag]);
    }
  }

  function handleRadioSelect(questionId, value) {
    handleChange(questionId, value);
  }

  function isEmptyAnswer(value) {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateQuestions(questionList) {
    const newErrors = {};

    for (const q of questionList) {
      const val = answers[q.id];
      const requiredMissing = q.required && isEmptyAnswer(val);

      if (requiredMissing) {
        newErrors[q.id] = 'Dit veld is verplicht';
      } else if (q.input_type === 'email' && !isEmptyAnswer(val) && !isValidEmail(String(val).trim())) {
        newErrors[q.id] = 'Voer een geldig e-mailadres in';
      }

      if (q.has_sub_question && q.required) {
        const subVal = subAnswers[q.id];
        if (!subVal || String(subVal).trim() === '') {
          newErrors[`${q.id}_sub`] = 'Dit veld is verplicht';
        }
      }
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errorsMap: newErrors,
    };
  }

  function validateStep() {
    return validateQuestions(stepQuestions).isValid;
  }

  function handleNext() {
    if (validateStep()) {
      setCurrentStep((s) => s + 1);
    }
  }

  function goToReview() {
    if (validateStep()) {
      setIsReviewing(true);
    }
  }

  function handleSubmitClick() {
    const result = validateQuestions(questions);
    if (result.isValid) {
      handleSubmit();
      return;
    }

    const firstErrorQuestion = questions.find((q) => result.errorsMap[q.id] || result.errorsMap[`${q.id}_sub`]);
    if (firstErrorQuestion) {
      setCurrentStep(firstErrorQuestion.step_number);
      setIsReviewing(false);
    }
  }

  async function handleSubmit() {
    const payload = questions.map((q) => ({
      question_id: q.id,
      answer_text: Array.isArray(answers[q.id])
        ? answers[q.id].join(', ')
        : answers[q.id] || '',
      sub_answer_text: subAnswers[q.id] || null,
    }));

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      setSubmissionId(data.id);
      setSubmitted(true);
    } catch {
      alert('Er ging iets mis bij het opslaan. Probeer het opnieuw.');
    }
  }

  if (loading) return <div className="loading">Vragen laden...</div>;

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="checkmark">✅</div>
        <h2>Use case opgeslagen!</h2>
        <p>Submission #{submissionId} is succesvol opgeslagen in de database.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Nieuwe use case
        </button>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="form-card">
        <h2>Overzicht vóór opslaan</h2>
        <div className="review-list">
          {questions.map((q) => {
            const rawAnswer = answers[q.id];
            const answerText = Array.isArray(rawAnswer) ? rawAnswer.join(', ') : (rawAnswer || '');
            const isUnanswered = String(answerText).trim() === '';
            const subText = subAnswers[q.id] || '';
            const subUnanswered = q.has_sub_question === 1 && String(subText).trim() === '';

            return (
              <div className="review-item" key={q.id}>
                <div className="review-question">{q.label_nl}</div>
                {isUnanswered ? (
                  <div className="review-unanswered">Niet beantwoord</div>
                ) : (
                  <div className="review-answer">{answerText}</div>
                )}

                {q.has_sub_question === 1 ? (
                  <>
                    <div className="review-sub-question">{q.sub_question_label || 'Korte versie (1-2 zinnen)'}</div>
                    {subUnanswered ? (
                      <div className="review-unanswered">Niet beantwoord</div>
                    ) : (
                      <div className="review-answer">{subText}</div>
                    )}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="btn-row">
          <button className="btn btn-secondary" onClick={() => setIsReviewing(false)}>
            ← Terug naar bewerken
          </button>
          <button className="btn btn-success" onClick={handleSubmitClick}>
            ✓ Definitief opslaan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="progress-bar">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          return (
            <div
              key={stepNum}
              className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-circle">{isCompleted ? '✓' : stepNum}</div>
              <span className="step-label">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div className="form-card">
        <h2>
          Stap {currentStep}: {STEP_LABELS[currentStep - 1]}
        </h2>

        {stepQuestions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            value={answers[q.id] || (q.input_type === 'tags' ? [] : '')}
            subValue={subAnswers[q.id] || ''}
            errorMessage={errors[q.id] || ''}
            subErrorMessage={errors[`${q.id}_sub`] || ''}
            onChange={(v) => { handleChange(q.id, v); setErrors((e) => { const copy = { ...e }; delete copy[q.id]; return copy; }); }}
            onSubChange={(v) => { handleSubChange(q.id, v); setErrors((e) => { const copy = { ...e }; delete copy[`${q.id}_sub`]; return copy; }); }}
            onTagToggle={(tag) => {
              handleTagToggle(q.id, tag, JSON.parse(q.options || '[]'));
              setErrors((e) => { const copy = { ...e }; delete copy[q.id]; return copy; });
            }}
            onRadioSelect={(v) => { handleRadioSelect(q.id, v); setErrors((e) => { const copy = { ...e }; delete copy[q.id]; return copy; }); }}
          />
        ))}

        <div className="btn-row">
          <button
            className="btn btn-secondary"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            ← Vorige
          </button>

          {currentStep < totalSteps ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Volgende →
            </button>
          ) : (
            <button className="btn btn-success" onClick={goToReview}>
              Overzicht →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionField({
  question,
  value,
  subValue,
  errorMessage,
  subErrorMessage,
  onChange,
  onSubChange,
  onTagToggle,
  onRadioSelect,
}) {
  const q = question;
  const options = q.options ? JSON.parse(q.options) : [];

  return (
    <div className={`form-group ${errorMessage ? 'has-error' : ''}`}>
      <label>
        {q.label_nl}
        {q.required ? <span className="required-star">*</span> : null}
      </label>
      {q.description_nl && <div className="description">{q.description_nl}</div>}
      {errorMessage && <div className="error-msg">{errorMessage}</div>}

      {q.input_type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.label_nl}
        />
      )}

      {q.input_type === 'date' && (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {q.input_type === 'email' && (
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="email@voorbeeld.nl"
        />
      )}

      {q.input_type === 'textarea' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.label_nl}
        />
      )}

      {q.input_type === 'radio' && (
        <div className="radio-group">
          {options.map((opt) => (
            <div
              key={opt}
              className={`radio-option ${value === opt ? 'selected' : ''}`}
              onClick={() => onRadioSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {q.input_type === 'tags' && (
        <div className="tags-group">
          {options.map((tag) => (
            <div
              key={tag}
              className={`tag-option ${Array.isArray(value) && value.includes(tag) ? 'selected' : ''}`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Sub-question (e.g. the "korte versie" for the antwoord field) */}
      {q.has_sub_question === 1 && (
        <div className={`sub-question ${subErrorMessage ? 'has-error' : ''}`}>
          <label>{q.sub_question_label}</label>
          {q.sub_question_description && (
            <div className="description">{q.sub_question_description}</div>
          )}
          {subErrorMessage && <div className="error-msg">{subErrorMessage}</div>}
          <textarea
            value={subValue}
            onChange={(e) => onSubChange(e.target.value)}
            placeholder={q.sub_question_label}
            style={{ minHeight: '60px' }}
          />
        </div>
      )}
    </div>
  );
}
