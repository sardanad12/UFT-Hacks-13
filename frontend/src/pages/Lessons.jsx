import "./Lessons.css";

const lessons = [
  {
    id: "english",
    name: "English",
    flag: "🇬🇧",
    description: "Improve grammar, vocabulary, and fluency",
  },
  {
    id: "french",
    name: "French",
    flag: "🇫🇷",
    description: "Learn conversational and academic French",
  },
  {
    id: "hindi",
    name: "Hindi",
    flag: "🇮🇳",
    description: "Master spoken and written Hindi",
  },
];

const Lessons = () => {
  return (
    <main className="lessons-page">
      <header className="lessons-header">
        <h1>Lessons</h1>
        <p>Select a language to start learning</p>
      </header>

      <section className="lessons-grid">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-flag">{lesson.flag}</div>

            <h3>{lesson.name}</h3>
            <p>{lesson.description}</p>

            <button className="lesson-btn">
              Start Learning
            </button>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Lessons;
