import { useAuth } from "../context/AuthContext";
import "./Lessons.css";

const Lessons = () => {
    const { user } = useAuth();

    // Safety check - don't render if user is null
    if (!user) return null;

    // Get language flag emoji
    const getLanguageFlag = (language) => {
        const flags = {
            Spanish: "🇪🇸",
            French: "🇫🇷",
            German: "🇩🇪",
            Italian: "🇮🇹",
            Portuguese: "🇵🇹",
            Hindi: "🇮🇳",
            Chinese: "🇨🇳",
            Japanese: "🇯🇵",
            Korean: "🇰🇷",
            English: "🇬🇧",
        };
        return flags[language] || "🌍";
    };

    // Build lessons array from user's languages_studied
    const lessons = (user.languages_studied || []).map((lang) => ({
        id: lang.language.toLowerCase(),
        name: lang.language,
        flag: getLanguageFlag(lang.language),
        description: `Level: ${lang.level || "Beginner"}`,
        level: lang.level,
        completedLessons: lang.completed_lessons?.length || 0,
    }));

    // Get next lesson info
    const getNextLesson = () => {
        if (user.last_lesson_language) {
            return `${user.last_lesson_language} - Continue Learning`;
        }
        if (lessons.length > 0) {
            return `${lessons[0].name} - Start Learning`;
        }
        return "Start Your First Lesson";
    };
    return (
        <main className="lessons-page">
            {/* Quick Stats / Jump Section */}
            <h1 style={{ paddingBottom: "2.2rem" }}>
                Your Progress, You're Doing Great!
            </h1>            <section className="quick-stats">
                <div className="jump-box">
                    <p>Next Lesson</p>
                    <h2>{getNextLesson()}</h2>
                    <button className="lesson-btn jump-in-btn">Jump In</button>
                </div>

                <div className="stat-box completed-box">
                    <p className="completed-label">Lessons Completed</p>
                    <h1 className="completed-number">{user.total_lessons_completed || 0}</h1>
                </div>

                <div className="stat-box streak-box">
                    <p className="streak-label">🔥 Streak</p>
                    <h1 className="streak-number">{user.daily_streak || 0} days</h1>
                </div>

            </section>

            {/* Your Languages Section */}
            <header className="lessons-header">
                <h1>Your Languages</h1>
            </header>

            <section className="lessons-grid">
                {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <div key={lesson.id} className="lesson-card">
                            <div className="lesson-flag">{lesson.flag}</div>
                            <h3>{lesson.name}</h3>
                            <p>{lesson.description}</p>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                {lesson.completedLessons} lessons completed
                            </p>
                            <button className="lesson-btn">Continue</button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>
                            No languages yet. Start your learning journey!
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Lessons;
