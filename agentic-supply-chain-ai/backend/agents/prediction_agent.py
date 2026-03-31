class PredictionAgent:
    def predict(self, risk_data: dict) -> dict:
        """Agent 2: Predicts downstream impact based on evaluated risk"""
        risk = risk_data.get("risk_level", "Low")
        
        predicted_delay = 0
        confidence = "95%"
        
        if risk == "High":
            predicted_delay = 14 # days
            confidence = "90%"
        elif risk == "Medium":
            predicted_delay = 5 # days
            confidence = "85%"
            
        return {
            "agent": "Prediction",
            "action": "Impact Forecasting",
            "risk_level": risk,
            "predicted_delay_days": predicted_delay,
            "confidence": confidence,
            "forecast": f"Expect {predicted_delay} days of systemic delay." if predicted_delay > 0 else "No delays predicted."
        }
