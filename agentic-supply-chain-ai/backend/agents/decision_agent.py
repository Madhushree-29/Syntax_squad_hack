class DecisionAgent:
    def decide(self, prediction_data: dict) -> dict:
        """Agent 3: Makes an autonomous decision on how to mitigate the issue"""
        risk = prediction_data.get("risk_level", "Low")
        
        decision = "Continue operations"
        urgency = "Normal"
        
        if risk == "High":
            decision = "Switch supplier + reroute instantly"
            urgency = "Critical"
        elif risk == "Medium":
            decision = "Adjust delivery schedule"
            urgency = "Elevated"
            
        return {
            "agent": "Decision",
            "action": "Autonomous Resolution",
            "decision_made": decision,
            "urgency": urgency,
            "reason": f"Predicted {prediction_data.get('predicted_delay_days', 0)} days delay exceeded threshold." if risk != "Low" else "Metrics nominal."
        }
