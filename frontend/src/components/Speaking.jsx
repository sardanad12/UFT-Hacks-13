import { useState, useEffect, useRef } from 'react'
import './Speaking.css'

const Speaking = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish')
  const [selectedTopic, setSelectedTopic] = useState('Greetings')
  const [mode, setMode] = useState('Assisted') // 'Assisted' or 'Non-Assisted'
  const [conversation, setConversation] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const conversationEndRef = useRef(null)

  // Language options with flags
  const languages = [
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
    { name: 'Italian', flag: '🇮🇹' },
    { name: 'Portuguese', flag: '🇵🇹' },
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'Chinese', flag: '🇨🇳' },
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'Korean', flag: '🇰🇷' },
  ]

  // Topic options
  const topics = [
    'Greetings',
    'Shopping',
    'Travel',
    'Food & Dining',
    'Weather',
    'Hobbies',
    'Family',
    'Work & Business',
    'Health',
    'Culture',
  ]

  // Initialize conversation with greeting
  useEffect(() => {
    const greetings = {
      Spanish: '¡Hola! ¿Cómo estás? ¿De qué te gustaría hablar hoy?',
      French: 'Bonjour! Comment allez-vous? De quoi aimeriez-vous parler aujourd\'hui?',
      German: 'Hallo! Wie geht es dir? Worüber möchtest du heute sprechen?',
      Italian: 'Ciao! Come stai? Di cosa vorresti parlare oggi?',
      Portuguese: 'Olá! Como está? Sobre o que você gostaria de falar hoje?',
      Hindi: 'नमस्ते! आप कैसे हैं? आज आप किस बारे में बात करना चाहेंगे?',
      Chinese: '你好！你好吗？今天你想聊什么？',
      Japanese: 'こんにちは！元気ですか？今日は何について話したいですか？',
      Korean: '안녕하세요! 어떻게 지내세요? 오늘 무엇에 대해 이야기하고 싶으세요?',
    }

    if (conversation.length === 0) {
      setConversation([
        {
          sender: 'AI',
          text: greetings[selectedLanguage] || 'Hello! How are you? What would you like to talk about today?',
          timestamp: new Date(),
        },
      ])
    }
  }, [selectedLanguage])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Handle language change
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
    setConversation([]) // Reset conversation when language changes
  }

  // Handle topic change
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value)
  }

  // Handle mode toggle
  const handleModeToggle = () => {
    setMode(mode === 'Assisted' ? 'Non-Assisted' : 'Assisted')
  }

  // Handle help button click
  const handleHelp = () => {
    if (mode === 'Assisted') {
      const helpMessages = {
        Spanish: 'Consejos útiles: Intenta usar verbos en presente. Recuerda: yo hablo, tú hablas, él/ella habla.',
        French: 'Conseils utiles: Essayez d\'utiliser des verbes au présent. N\'oubliez pas: je parle, tu parles, il/elle parle.',
        German: 'Hilfreiche Tipps: Versuchen Sie, Verben in der Gegenwart zu verwenden. Denken Sie daran: ich spreche, du sprichst, er/sie spricht.',
        Italian: 'Suggerimenti utili: Prova a usare i verbi al presente. Ricorda: io parlo, tu parli, lui/lei parla.',
        Portuguese: 'Dicas úteis: Tente usar verbos no presente. Lembre-se: eu falo, você fala, ele/ela fala.',
        Hindi: 'उपयोगी सुझाव: वर्तमान काल की क्रियाओं का उपयोग करने का प्रयास करें। याद रखें: मैं बोलता हूँ, तुम बोलते हो, वह बोलता है।',
        Chinese: '有用的提示：尝试使用现在时态。记住：我说，你说，他/她说。',
        Japanese: '役立つヒント：現在形の動詞を使ってみてください。覚えておいてください：私は話す、あなたは話す、彼/彼女は話す。',
        Korean: '유용한 팁: 현재 시제 동사를 사용해 보세요. 기억하세요: 저는 말해요, 당신은 말해요, 그/그녀는 말해요.',
      }

      const newMessage = {
        sender: 'AI',
        text: helpMessages[selectedLanguage] || 'Helpful tips: Try to use present tense verbs. Remember the conjugations!',
        timestamp: new Date(),
        isHelp: true,
      }
      setConversation([...conversation, newMessage])
    }
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (userInput.trim() === '') return

    // Add user message
    const userMessage = {
      sender: 'User',
      text: userInput,
      timestamp: new Date(),
    }

    setConversation([...conversation, userMessage])
    setUserInput('')

    // Simulate AI response (in real implementation, this would call the backend)
    setTimeout(() => {
      const aiResponses = {
        Assisted: {
          Spanish: '¡Muy bien! Tu pronunciación está mejorando. Intenta usar más adjetivos.',
          French: 'Très bien! Votre prononciation s\'améliore. Essayez d\'utiliser plus d\'adjectifs.',
          German: 'Sehr gut! Deine Aussprache verbessert sich. Versuche mehr Adjektive zu verwenden.',
          Italian: 'Molto bene! La tua pronuncia sta migliorando. Prova a usare più aggettivi.',
          Portuguese: 'Muito bem! Sua pronúncia está melhorando. Tente usar mais adjetivos.',
          Hindi: 'बहुत अच्छा! आपका उच्चारण सुधर रहा है। अधिक विशेषणों का उपयोग करने का प्रयास करें।',
          Chinese: '很好！你的发音在进步。试着使用更多的形容词。',
          Japanese: 'とても良いです！発音が上達しています。もっと形容詞を使ってみてください。',
          Korean: '아주 좋아요! 발음이 좋아지고 있어요. 더 많은 형용사를 사용해 보세요.',
        },
        'Non-Assisted': {
          Spanish: 'Entiendo. ¿Qué más puedes decirme sobre eso?',
          French: 'Je comprends. Que pouvez-vous me dire de plus à ce sujet?',
          German: 'Ich verstehe. Was können Sie mir noch darüber erzählen?',
          Italian: 'Capisco. Cosa altro puoi dirmi al riguardo?',
          Portuguese: 'Entendo. O que mais você pode me dizer sobre isso?',
          Hindi: 'मैं समझता हूँ। आप मुझे इसके बारे में और क्या बता सकते हैं?',
          Chinese: '我明白了。你还能告诉我什么？',
          Japanese: 'わかりました。それについてもっと教えてください。',
          Korean: '이해합니다. 그것에 대해 더 말씀해 주시겠어요?',
        },
      }

      const aiMessage = {
        sender: 'AI',
        text: aiResponses[mode][selectedLanguage] || 'I understand. Please continue.',
        timestamp: new Date(),
      }
      setConversation((prev) => [...prev, aiMessage])
    }, 1000)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Toggle voice recording
  const toggleListening = () => {
    setIsListening(!isListening)
    // In real implementation, this would start/stop speech recognition
  }

  return (
    <div className="speaking-container">
      {/* Left Sidebar */}
      <div className="speaking-sidebar">
        <div className="sidebar-header">
          <h2>Speaking Practice</h2>
        </div>

        <div className="sidebar-controls">
          {/* Language Selection */}
          <div className="control-group">
            <label htmlFor="language-select">Language</label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="control-select"
            >
              {languages.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selection */}
          <div className="control-group">
            <label htmlFor="topic-select">Topic</label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={handleTopicChange}
              className="control-select"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="control-group">
            <label>Mode</label>
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'Assisted' ? 'active' : ''}`}
                onClick={handleModeToggle}
              >
                <span className="mode-icon">🎓</span>
                Assisted
              </button>
              <button
                className={`mode-btn ${mode === 'Non-Assisted' ? 'active' : ''}`}
                onClick={handleModeToggle}
              >
                <span className="mode-icon">💬</span>
                Non-Assisted
              </button>
            </div>
          </div>

          {/* Help Button */}
          <div className="control-group">
            <button
              className="help-btn"
              onClick={handleHelp}
              disabled={mode !== 'Assisted'}
            >
              <span className="help-icon">💡</span>
              Get Help
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="sidebar-info">
          <div className="info-card">
            <h4>Current Settings</h4>
            <div className="info-item">
              <span className="info-label">Language:</span>
              <span className="info-value">
                {languages.find((l) => l.name === selectedLanguage)?.flag} {selectedLanguage}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Topic:</span>
              <span className="info-value">{selectedTopic}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mode:</span>
              <span className="info-value">{mode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="speaking-main">
        {/* Audio Visualizer */}
        <div className="visualizer-container">
          <div className={`audio-visualizer ${isListening || isAISpeaking ? 'active' : ''}`}>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="visualizer-bar" style={{ animationDelay: `${i * 0.05}s` }}></div>
            ))}
          </div>
          <div className="visualizer-status">
            {isListening ? '🎤 Listening...' : isAISpeaking ? '🔊 AI Speaking...' : '💭 Ready to chat'}
          </div>
        </div>

        {/* Conversation Display */}
        <div className="conversation-container">
          <div className="conversation-display">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender.toLowerCase()} ${message.isHelp ? 'help-message' : ''}`}
              >
                <div className="message-avatar">
                  {message.sender === 'AI' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Speaking
