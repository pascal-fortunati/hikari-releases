import { faqs } from '@/lib/content';
import { Icon } from './icon';

export function FAQ({ compact = false }: { compact?: boolean }) {
  const questions = compact ? [faqs[0], faqs[1], faqs[2], faqs[5], faqs[6], faqs[9]] : faqs;
  return (
    <div className="accordion faq-list">
      {questions.map(([question, answer], i) => (
        <div className="accordion-item" key={question} id={`faq-${i}`}>
          <h3>
            <button
              type="button"
              className="accordion-toggle"
              aria-expanded="false"
              aria-controls={`answer-${i}`}
              id={`question-${i}`}
            >
              {question}
              <Icon name="add" className="accordion-item-active:rotate-45 transition-transform" />
            </button>
          </h3>
          <div
            id={`answer-${i}`}
            className="accordion-content hidden overflow-hidden transition-[height] duration-300"
            role="region"
            aria-labelledby={`question-${i}`}
          >
            <p>{answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
