import { useEffect, useState } from 'react';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Ingevulde usecases laden...</div>;

  if (selected) {
    return (
      <div className="form-card">
        <button className="back-link" onClick={() => setSelected(null)}>
          ← Terug naar lijst
        </button>
        <h2>Usecase #{selected.id}</h2>
        <p className="submission-meta">Aangemaakt op: {selected.created_at}</p>

        {selected.answers.map((answer) => {
          const isUnanswered = !answer.answer_text || answer.answer_text.trim() === '';
          const isSubUnanswered = answer.has_sub_question && (!answer.sub_answer_text || answer.sub_answer_text.trim() === '');

          return (
            <div className="review-item" key={`${answer.id}-${answer.question_id}`}>
              <div className="review-question">{answer.label_nl}</div>
              {isUnanswered ? (
                <div className="review-unanswered">Niet beantwoord</div>
              ) : (
                <div className="review-answer">{answer.answer_text}</div>
              )}

              {answer.has_sub_question ? (
                <>
                  <div className="review-sub-question">{answer.sub_question_label || 'Korte versie (1-2 zinnen)'}</div>
                  {isSubUnanswered ? (
                    <div className="review-unanswered">Niet beantwoord</div>
                  ) : (
                    <div className="review-answer">{answer.sub_answer_text}</div>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="form-card">
        <h2>Ingevulde usecases</h2>
        <p>Nog geen ingevulde usecases gevonden.</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2>Ingevulde usecases</h2>
      <div className="submission-list">
        {submissions.map((submission) => (
          <button
            key={submission.id}
            className="submission-item"
            onClick={() => setSelected(submission)}
          >
            <span>Usecase #{submission.id}</span>
            <span className="submission-meta">{submission.created_at}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
