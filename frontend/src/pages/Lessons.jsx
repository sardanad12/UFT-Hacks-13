import "./Lessons.css";

const lessons = [
    {
        id: "english",
        name: "English",
        flag: "🇬🇧",
        description: "View your lessons",
    },
    {
        id: "french",
        name: "French",
        flag: "🇫🇷",
        description: "View your lessons",
    },
    {
        id: "hindi",
        name: "Hindi",
        flag: "🇮🇳",
        description: "View your lessons",
    },
];

// Example user stats
const userStats = {
    completedThisWeek: 3,
    streak: 5,
    nextLesson: "Hindi Lesson 5",
};

const Lessons = () => {
    return (
        <main className="lessons-page">
            {/* Quick Stats / Jump Section */}
            <h1 style={{ paddingBottom: "2.2rem" }}>
                Your Progress, You're Doing Great!
            </h1>            <section className="quick-stats">
                <div className="jump-box">
                    <p>Next Lesson</p>
                    <h2>{userStats.nextLesson}</h2>
                    <button className="lesson-btn jump-in-btn">Jump In</button>
                </div>

                <div className="stat-box completed-box">
                    <p className="completed-label">Lessons Completed</p>
                    <h1 className="completed-number">{userStats.completedThisWeek}</h1>
                </div>

                <div className="stat-box streak-box">
                    <p className="streak-label">🔥 Streak</p>
                    <h1 className="streak-number">{userStats.streak} days</h1>
                </div>

            </section>

            {/* Your Languages Section */}
            <header className="lessons-header">
                <h1>Your Languages</h1>
            </header>

            <section className="lessons-grid">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-card">
                        <div className="lesson-flag">{lesson.flag}</div>
                        <h3>{lesson.name}</h3>
                        <p>{lesson.description}</p>
                        <button className="lesson-btn">Continue</button>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Lessons;
