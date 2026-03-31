class RiskAgent:
    def evaluate(self, event: str) -> dict:
        """Agent 1: Evaluates raw event to determine risk level"""
        risk = "Low"
        context = "Business as usual. No significant threats."
        
        if event == "flood":
            risk = "High"
            context = "Severe weather event detected at major supply node."
        elif event == "delay" or event == "strike":
            risk = "Medium"
            context = "Operational disruption reported in transit route."
            
        return {
            "agent": "Risk Monitoring",
            "action": "Threat Evaluation",
            "event": event,
            "risk_level": risk,
            "context": context
        }
