import { useState } from "react";
import "./Speaking.css";

const languages = ["English", "French", "Spanish", "Hindi"];
const topics = ["Travel", "Food", "Hobbies", "Technology"];

const Speaking = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedTopic, setSelectedTopic] = useState("Travel");
  const [assistedMode, setAssistedMode] = useState(true);

  return (
    <main className="speaking-page">
      {/* Left Sidebar */}
      <aside className="speaking-sidebar">
        <div className="control-group">
          <label>Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div className="control-group toggle-mode">
          <label>Assisted Mode</label>
          <input
            type="checkbox"
            checked={assistedMode}
            onChange={() => setAssistedMode(!assistedMode)}
          />
        </div>

        {assistedMode && (
          <button className="help-btn">Help</button>
        )}
      </aside>

      {/* Main Area */}
      <section className="speaking-main">
        <div className="audio-visualizer">
          {/* Placeholder for AI + User audio visualizer */}
          <p>Audio Visualizer Here</p>
        </div>

        <div className="conversation-area">
          {/* Placeholder for conversation messages */}
          <p>Conversation will appear here...</p>
        </div>

        <button className="start-btn">Start Speaking</button>
      </section>
    </main>
  );
};

export default Speaking;
