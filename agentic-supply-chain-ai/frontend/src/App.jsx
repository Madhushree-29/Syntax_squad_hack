import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  const simulateEvent = async (event) => {
    setActiveEvent(event);
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/simulate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event }),
      });
      const data = await response.json();
      
      // Artificial delay to make the loader visible and feel authentic
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
      alert("Failed to connect to backend. Is uvicorn running tightly?");
    }
  };

  const calculateWidth = (val) => {
    if (!val) return '0%';
    const max = 500000;
    return `${Math.min((val / max) * 100, 100)}%`;
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Autonomous Supply Chain AI</h1>
        <p className="subtitle">Multi-Agent Self-Healing Simulation Grid</p>
      </header>

      <section className="controls-section">
        <button 
          className={`btn-flood ${activeEvent === 'flood' ? 'active' : ''}`}
          onClick={() => simulateEvent('flood')}
          disabled={loading}
        >
          Simulate Flood (High Risk)
        </button>
        <button 
          className={`btn-delay ${activeEvent === 'delay' ? 'active' : ''}`}
          onClick={() => simulateEvent('delay')}
          disabled={loading}
        >
          Simulate Delay (Medium Risk)
        </button>
        <button 
          className={`btn-strike ${activeEvent === 'strike' ? 'active' : ''}`}
          onClick={() => simulateEvent('strike')}
          disabled={loading}
        >
          Simulate Strike (Medium Risk)
        </button>
      </section>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Processing Multi-Agent Grid...</p>
        </div>
      )}

      {result && !loading && (
        <div className="results-grid">
          {/* Timeline Column */}
          <div className="card timeline-card">
            <h2>
              <span>⚡</span> Live Agent Execution
              <span className={`risk-badge risk-${result.risk_level}`} style={{marginLeft: 'auto'}}>
                {result.risk_level} RISK
              </span>
            </h2>
            <div className="timeline">
              {result.timeline.map((item, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot">{index + 1}</div>
                  <div className="timeline-content">
                    <div className="agent-name">{item.agent} Agent</div>
                    <div className="agent-action">{item.action}</div>
                    
                    {/* Dynamic details based on agent type */}
                    {item.event && <div className="agent-detail">Detected: {item.event}</div>}
                    {item.predicted_delay_days !== undefined && <div className="agent-detail">Forecast: {item.forecast}</div>}
                    {item.decision_made && <div className="agent-detail">Decision: {item.decision_made}</div>}
                    {item.plan_details && <div className="agent-detail">Action: {item.plan_details}</div>}
                    {item.explanation && <div className="agent-detail">{item.explanation}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Column */}
          <div className="card impact-card">
            <h2><span>📊</span> Commercial Impact Assessment</h2>
            
            {result.impact_comparison.without_ai_loss > 0 ? (
              <div className="chart-container">
                <div className="bar-group">
                  <div className="bar-label">
                    <span>Without AI (Manual)</span>
                    <span>${result.impact_comparison.without_ai_loss.toLocaleString()}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill bar-without" 
                      style={{width: calculateWidth(result.impact_comparison.without_ai_loss)}}
                    ></div>
                  </div>
                </div>

                <div className="bar-group">
                  <div className="bar-label">
                    <span>With Agentic AI (Auto)</span>
                    <span>${result.impact_comparison.with_ai_loss.toLocaleString()}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill bar-with" 
                      style={{width: calculateWidth(result.impact_comparison.with_ai_loss)}}
                    ></div>
                  </div>
                </div>

                <div className="summary-box">
                  <strong>System Report:</strong>
                  <p>{result.summary}</p>
                  <p style={{marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                    Processed in {result.processing_time_ms}ms
                  </p>
                </div>
              </div>
            ) : (
              <div className="summary-box">
                <p>System operating normally. No impact projected.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
