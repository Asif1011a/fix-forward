export const LEGAL_NEWS = [
  { id: 1, tag: "JUDICIAL", source: "Supreme Court", text: "New guidelines on 'Adultery' as a ground for divorce in the BNS framework clarified." },
  { id: 2, tag: "STATUTORY", source: "Min. of Law", text: "Bharatiya Nyaya Sanhita (BNS) 2023 officially replaces IPC across all Indian states." },
  { id: 3, tag: "LANDMARK", source: "Supreme Court", text: "RERA directives updated: Builders must pay 10.7% interest for possession delays." },
  { id: 4, tag: "DECODED", source: "Bar Council", text: "Standard Operating Procedures (SOP) for e-Filing in Consumer Fora updated 2025." },
  { id: 5, tag: "GOVERNANCE", source: "MeitY", text: "Digital Personal Data Protection Act (DPDPA) 2023 compliance deadline extended." },
  { id: 6, tag: "JUDICIAL", source: "Bombay HC", text: "Ruling on 'Reasonable Time' for returning security deposits by landlords established." }
];

export const getStrategicMetrics = (messageCount, lastMessage) => {
  // Now returns the metrics provided by the AI if available
  if (lastMessage?.strategic_metrics) {
    return lastMessage.strategic_metrics;
  }
  
  return {
    urgency: "INITIAL",
    merit: "0%",
    posture: "NEUTRAL",
    complexity: "LOW"
  };
};
