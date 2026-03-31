from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import time

from agents.risk_agent import RiskAgent
from agents.prediction_agent import PredictionAgent
from agents.decision_agent import DecisionAgent
from agents.logistics_agent import LogisticsAgent
from agents.notification_agent import NotificationAgent

app = FastAPI(title="Agentic Supply Chain AI")

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EventRequest(BaseModel):
    event: str  # e.g., "flood", "delay", "strike", "normal"

# Initialize our specialized AI agents
risk_agent = RiskAgent()
prediction_agent = PredictionAgent()
decision_agent = DecisionAgent()
logistics_agent = LogisticsAgent()
notification_agent = NotificationAgent()

@app.post("/simulate-event")
async def simulate_event(req: EventRequest):
    event = req.event.lower()
    
    # Initialize the timeline to track the autonomous process
    timeline = []
    
    start_time = time.time()
    
    # --- Multi-Agent Autonomous Workflow ---
    
    # 1. Risk Monitoring Agent
    risk_data = risk_agent.evaluate(event)
    timeline.append(risk_data)
    
    # 2. Prediction Agent
    prediction_data = prediction_agent.predict(risk_data)
    timeline.append(prediction_data)
    
    # 3. Decision Agent
    decision_data = decision_agent.decide(prediction_data)
    timeline.append(decision_data)
    
    # 4. Logistics Agent
    logistics_data = logistics_agent.plan_logistics(decision_data)
    timeline.append(logistics_data)
    
    # 5. Notification Agent
    final_report = notification_agent.generate_report(logistics_data)
    timeline.append(final_report)
    
    processing_time = round((time.time() - start_time) * 1000, 2)
    
    # Calculate Impact (Without AI vs With AI)
    # This simulates how much money/time is saved by the autonomous system resolving the issue instantly.
    impact = calculate_impact(risk_data["risk_level"])
    
    return {
        "event_triggered": event,
        "processing_time_ms": processing_time,
        "risk_level": risk_data["risk_level"],
        "timeline": timeline,
        "summary": final_report["explanation"],
        "impact_comparison": impact
    }

def calculate_impact(risk_level: str):
    if risk_level == "High":
        return {"without_ai_loss": 500000, "with_ai_loss": 20000, "metric": "$"}
    elif risk_level == "Medium":
        return {"without_ai_loss": 150000, "with_ai_loss": 5000, "metric": "$"}
    else:
        return {"without_ai_loss": 0, "with_ai_loss": 0, "metric": "$"}

@app.get("/status")
async def get_status():
    return {"status": "Online", "agents_active": 5, "system": "Autonomous Supply Chain Grid"}
