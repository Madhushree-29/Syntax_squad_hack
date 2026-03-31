class LogisticsAgent:
    def plan_logistics(self, decision_data: dict) -> dict:
        """Agent 4: Forms a concrete logistics plan to enact the decision"""
        decision = decision_data.get("decision_made", "")
        urgency = decision_data.get("urgency", "Normal")
        
        logistics_plan = "Maintain current routes."
        cost_adjustment = "$0"
        
        if "Switch supplier" in decision:
            logistics_plan = "Rerouting via Air Freight from Backup Supplier B."
            cost_adjustment = "+$20,000 (Expedited)"
        elif "Adjust delivery" in decision:
            logistics_plan = "Batching shipments to optimized ground route via Node Alpha."
            cost_adjustment = "+$5,000 (Overtime)"
            
        return {
            "agent": "Logistics",
            "action": "Fulfillment Planning",
            "plan_details": logistics_plan,
            "cost_adjustment": cost_adjustment,
            "execution_status": "Authorizing autonomous execution..." if urgency != "Normal" else "Awaiting events."
        }
