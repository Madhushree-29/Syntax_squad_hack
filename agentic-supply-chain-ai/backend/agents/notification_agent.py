class NotificationAgent:
    def generate_report(self, logistics_data: dict) -> dict:
        """Agent 5: The final agent that compiles a human-readable summary of the autonomous actions"""
        
        status = logistics_data.get("execution_status", "Awaiting events.")
        plan = logistics_data.get("plan_details", "No new plans.")
        
        explanation = "The system is running optimally."
        
        if "Rerouting" in plan:
            explanation = "AUTONOMOUS DECISION EXECUTED: Critical supplier failure predicted. Swapped to secondary supplier and expedited air freight. Expected loss minimized from $500,000 to $20,000."
        elif "Batching" in plan:
            explanation = "AUTONOMOUS DECISION EXECUTED: Minor delay detected. System adjusted logistics batching to optimize delivery routes without changing suppliers."
            
        return {
            "agent": "Notification",
            "action": "Reporting & Alerts",
            "alert_status": status,
            "explanation": explanation,
            "final_note": "A Multi-Agent Self-Healing Grid Operation."
        }
