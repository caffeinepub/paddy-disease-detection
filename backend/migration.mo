import Map "mo:core/Map";
import Nat32 "mo:core/Nat32";

module {
  type OldDisease = {
    name : Text;
    description : Text;
    treatment : Text;
  };

  type NewDisease = {
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

  type OldActor = {
    diseaseEntries : [(Nat32, OldDisease)];
    diseases : Map.Map<Nat32, OldDisease>;
  };

  type NewActor = {
    diseaseEntries : [(Nat32, NewDisease)];
    diseases : Map.Map<Nat32, NewDisease>;
  };

  func getDiseaseName(_oldDisease : OldDisease) : Text {
    switch (_oldDisease.name.toLower()) {
      case ("bacterial blight") { "Bacterial Blight" };
      case ("sheath blight") { "Sheath Blight" };
      case ("blast") { "Blast" };
      case ("tungro") { "Tungro" };
      case ("brown spot") { "Brown Spot" };
      case (_) { _oldDisease.name };
    };
  };

  func getFertilizers(disease : Text) : [Text] {
    switch (disease) {
      case ("Bacterial Blight") {
        [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use slow-release fertilizers",
        ];
      };
      case ("Sheath Blight") {
        [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use potassium-rich fertilizers",
        ];
      };
      case ("Blast") {
        [
          "Balanced NPK application",
          "Avoid excessive nitrogen",
          "Use potassium-rich fertilizers",
        ];
      };
      case ("Tungro") {
        [
          "Balanced NPK application",
          "Maintain healthy soil fertility",
          "Avoid excessive nitrogen",
        ];
      };
      case ("Brown Spot") {
        [
          "Balanced NPK application",
          "Use zinc and manganese supplements",
          "Maintain proper pH levels",
        ];
      };
      case (_) { [] };
    };
  };

  func getPreventionTips(disease : Text) : [Text] {
    switch (disease) {
      case ("Bacterial Blight") {
        [
          "Maintain proper field sanitation",
          "Use resistant varieties",
          "Rotate crops to reduce pathogen buildup",
        ];
      };
      case ("Sheath Blight") {
        [
          "Maintain proper water management",
          "Practice crop rotation",
          "Use disease-free seeds",
        ];
      };
      case ("Blast") {
        [
          "Maintain proper field sanitation",
          "Practice crop rotation",
          "Use resistant varieties",
        ];
      };
      case ("Tungro") {
        [
          "Control leafhopper populations",
          "Use resistant varieties",
          "Practice crop rotation",
        ];
      };
      case ("Brown Spot") {
        [
          "Maintain proper field sanitation",
          "Practice crop rotation",
          "Avoid water stress",
        ];
      };
      case (_) { [] };
    };
  };

  func getSeasonalAdvice(disease : Text) : Text {
    switch (disease) {
      case ("Bacterial Blight") {
        "Monitor fields closely during warm, wet seasons. Wet conditions favor the spread of bacterial blight.";
      };
      case ("Sheath Blight") {
        "Sheath blight is more common during warm, humid seasons with prolonged wetness.";
      };
      case ("Blast") {
        "Rice blast is more prevalent during rainy seasons with high humidity and temperatures.";
      };
      case ("Tungro") {
        "Tungro outbreaks are more common during seasons with high leafhopper activity, particularly during wet seasons.";
      };
      case ("Brown Spot") {
        "Brown spot is more prevalent during periods of drought stress and in poorly fertilized fields.";
      };
      case (_) { "" };
    };
  };

  func getSeverityLevel(disease : Text) : Text {
    switch (disease) {
      case ("Bacterial Blight") { "Moderate" };
      case ("Sheath Blight") { "High" };
      case ("Blast") { "Critical" };
      case ("Tungro") { "High" };
      case ("Brown Spot") { "Moderate" };
      case (_) { "" };
    };
  };

  func getYieldImpact(disease : Text) : Text {
    switch (disease) {
      case ("Bacterial Blight") {
        "Can cause hefty yield loss if left untreated. Potential for up to 30% yield reduction.";
      };
      case ("Sheath Blight") {
        "Untreated sheath blight can cause significant losses, especially in susceptible varieties.";
      };
      case ("Blast") {
        "Untreated rice blast can result in severe crop losses, especially in susceptible varieties.";
      };
      case ("Tungro") {
        "Tungro can cause substantial yield reductions, especially if left untreated.";
      };
      case ("Brown Spot") {
        "Yield losses due to brown spot are typically moderate but can be significant in severe cases.";
      };
      case (_) { "" };
    };
  };

  func getQuickActions(disease : Text) : [Text] {
    switch (disease) {
      case ("Bacterial Blight") {
        [
          "Isolate affected plants",
          "Apply copper-based fungicides",
          "Ensure proper field drainage",
        ];
      };
      case ("Sheath Blight") {
        [
          "Isolate and remove affected plants",
          "Apply recommended fungicides",
          "Ensure proper field drainage",
        ];
      };
      case ("Blast") {
        [
          "Isolate and remove affected plants",
          "Apply recommended fungicides",
          "Ensure proper field drainage",
        ];
      };
      case ("Tungro") {
        [
          "Monitor and control leafhopper populations",
          "Remove infected plants promptly",
          "Apply recommended pesticides",
        ];
      };
      case ("Brown Spot") {
        [
          "Remove heavily infected plants or grains",
          "Adjust irrigation to avoid drought stress",
          "Apply recommended fungicides if necessary",
        ];
      };
      case (_) { [] };
    };
  };

  public func run(old : OldActor) : NewActor {
    let newDiseaseEntries = old.diseaseEntries.map(
      func((id, oldDisease)) {
        let name = getDiseaseName(oldDisease);
        (
          id,
          {
            oldDisease with
            name;
            fertilizers = getFertilizers(name);
            preventionTips = getPreventionTips(name);
            seasonalAdvice = getSeasonalAdvice(name);
            severityLevel = getSeverityLevel(name);
            yieldImpact = getYieldImpact(name);
            quickActions = getQuickActions(name);
          }
        );
      }
    );

    let newDiseases = old.diseases.map<Nat32, OldDisease, NewDisease>(
      func(_id, oldDisease) {
        let name = getDiseaseName(oldDisease);
        {
          oldDisease with
          name;
          fertilizers = getFertilizers(name);
          preventionTips = getPreventionTips(name);
          seasonalAdvice = getSeasonalAdvice(name);
          severityLevel = getSeverityLevel(name);
          yieldImpact = getYieldImpact(name);
          quickActions = getQuickActions(name);
        };
      }
    );

    {
      diseaseEntries = newDiseaseEntries;
      diseases = newDiseases;
    };
  };
};
