import { useLiveAPI } from "../hooks/use-live-api";

const TestWebSocket = () => {
  const { connect, disconnect, connected, isRecording, startRecording, stopRecording } = useLiveAPI();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Gemini Live Audio Bridge</h2>
      
      <div style={{ margin: '20px 0' }}>
        Status: 
        <span style={{ 
          color: connected ? 'green' : 'red', 
          fontWeight: 'bold', 
          marginLeft: '10px' 
        }}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!connected ? (
          <button onClick={connect} style={btnStyle}>Connect to Gemini</button>
        ) : (
          <button onClick={disconnect} style={{...btnStyle, background: '#666'}}>Disconnect</button>
        )}
      </div>

      {connected && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <p>Hold the button to talk to Gemini</p>
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            style={{
              padding: '20px 40px',
              fontSize: '1.2rem',
              borderRadius: '50px',
              border: 'none',
              background: isRecording ? '#dc2626' : '#2563eb',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isRecording ? "Listening... 🎙️" : "Push to Talk 🗣️"}
          </button>
        </div>
      )}
    </div>
  );
};

const btnStyle = {
  padding: '10px 20px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default TestWebSocket;