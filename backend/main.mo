import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";
import Runtime "mo:core/Runtime";


// Specify the data migration function in with-clause

actor {
  type Disease = {
    name : Text;
    description : Text;
    treatment : Text;
    fertilizers : [Text];
    preventionTips : [Text];
    seasonalAdvice : Text;
    severityLevel : Text;
    yieldImpact : Text;
    quickActions : [Text];
  };

  let diseaseEntries : [(Nat32, Disease)] = [
    (
      1,
      {
        name = "Bacterial Blight";
        description = "A disease characterized by water-soaked lesions on leaves, which later turn yellow and necrotic. It is caused by the bacterium Xanthomonas oryzae.";
        treatment = "Treat with copper-based fungicides.";
        fertilizers = [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use slow-release fertilizers",
        ];
        preventionTips = [
          "Maintain proper field sanitation",
          "Use resistant varieties",
          "Rotate crops to reduce pathogen buildup",
        ];
        seasonalAdvice = "Monitor fields closely during warm, wet seasons. Wet conditions favor the spread of bacterial blight.";
        severityLevel = "Moderate";
        yieldImpact = "Can cause significant yield loss if left untreated. Potential for up to 30% yield reduction.";
        quickActions = [
          "Isolate affected plants",
          "Apply copper-based fungicides",
          "Ensure proper field drainage",
        ];
      },
    ),
    (
      2,
      {
        name = "Sheath Blight";
        description = "Sheath blight is a fungal disease caused by Rhizoctonia solani. It infects the rice plant's leaf sheaths, causing lesions that can lead to plant lodging.";
        treatment = "Cultural practices and fungicides can help manage sheath blight.";
        fertilizers = [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use potassium-rich fertilizers",
        ];
        preventionTips = [
          "Maintain proper water management",
          "Practice crop rotation",
          "Use disease-free seeds",
        ];
        seasonalAdvice = "Sheath blight is more common during warm, humid seasons with prolonged wetness.";
        severityLevel = "High";
        yieldImpact = "Untreated sheath blight can cause significant losses, especially in susceptible varieties.";
        quickActions = [
          "Isolate and remove affected plants",
          "Apply recommended fungicides",
          "Ensure proper field drainage",
        ];
      },
    ),
    (
      3,
      {
        name = "Blast";
        description = "A fungal disease caused by Magnaporthe oryzae that affects all parts of the rice plant. It is characterized by distinct diamond-shaped lesions on leaves.";
        treatment = "Apply fungicides as a preventive measure and practice crop rotation.";
        fertilizers = [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use potassium-rich fertilizers",
        ];
        preventionTips = [
          "Maintain proper field sanitation",
          "Rotate crops",
          "Use resistant varieties",
        ];
        seasonalAdvice = "Rice blast is more prevalent during rainy seasons with high humidity and temperatures.";
        severityLevel = "Critical";
        yieldImpact = "Untreated rice blast can result in severe crop losses, especially in susceptible varieties.";
        quickActions = [
          "Isolate and remove affected plants",
          "Apply recommended fungicides",
          "Ensure proper field drainage",
        ];
      },
    ),
    (
      4,
      {
        name = "Tungro";
        description = "Tungro is a viral disease transmitted by leafhoppers. It causes stunted growth, yellowing leaves, and reduced yields.";
        treatment = "Control leafhopper populations and use resistant rice varieties.";
        fertilizers = [
          "Balanced NPK application",
          "Maintain healthy soil fertility",
          "Avoid excessive nitrogen",
        ];
        preventionTips = [
          "Control leafhopper populations",
          "Use resistant varieties",
          "Practice crop rotation",
        ];
        seasonalAdvice = "Tungro outbreaks are more common during seasons with high leafhopper activity, particularly during wet seasons.";
        severityLevel = "High";
        yieldImpact = "Tungro can cause substantial yield reductions, especially if left untreated.";
        quickActions = [
          "Monitor and control leafhopper populations",
          "Remove infected plants promptly",
          "Apply recommended pesticides",
        ];
      },
    ),
    (
      5,
      {
        name = "Brown Spot";
        description = "Brown spot is a fungal disease that causes brown lesions on rice leaves and grains. Severe infections can lead to yield losses and poor quality grains.";
        treatment = "Improve field drainage and apply fungicides if necessary.";
        fertilizers = [
          "Balanced NPK application",
          "Use zinc and manganese supplements",
          "Maintain proper pH levels",
        ];
        preventionTips = [
          "Maintain proper field sanitation",
          "Practice crop rotation",
          "Avoid water stress",
        ];
        seasonalAdvice = "Brown spot is more prevalent during periods of drought stress and in poorly fertilized fields.";
        severityLevel = "Moderate";
        yieldImpact = "Yield losses due to brown spot are typically moderate but can be significant in severe cases.";
        quickActions = [
          "Remove heavily infected plants or grains",
          "Adjust irrigation to avoid drought stress",
          "Apply recommended fungicides if necessary",
        ];
      },
    ),
  ];

  let diseases = Map.fromIter<Nat32, Disease>(diseaseEntries.values());

  public query ({ caller }) func getDisease(diseaseIndex : Nat32) : async Disease {
    switch (diseases.get(diseaseIndex)) {
      case (null) { Runtime.trap("Disease not found") };
      case (?disease) { disease };
    };
  };

  public query ({ caller }) func getAllDiseases() : async [(Nat32, Disease)] {
    diseases.toArray();
  };

  public query ({ caller }) func simulateDetection(_image : Text, diseaseIndex : Nat32) : async ?Nat32 {
    if (diseaseIndex >= 1 and diseaseIndex <= 5) {
      ?diseaseIndex;
    } else {
      null;
    };
  };
};
