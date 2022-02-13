const CalculatorRiskQuestions = require("../models/calculators/calculatorRiskQuestions");
const CalculatorReputationQuestions = require("../models/calculators/calculatorReputationQuestions");
const CalculatorFinansialRiskQuestions = require("../models/calculators/calculatorFinansialRiskQuestions");
const { getService } = require("../utils/helpers");

class CalculatorService {
  constructor() {
    if (CalculatorService._instance) {
      return CalculatorService._instance;
    }
    CalculatorService._instance = this;
  }
  async getRisk(modelType, id) {
    let service = getService(modelType);
    let FormData = await service.getFormDataById(id);
    let calculator = new CalculatorRiskQuestions(FormData, modelType);
    return await calculator.calcGroups();
  }
  async getFinRisk(modelType, id) {
    let service = getService(modelType);
    let FormData = await service.getFormDataById(id);
    let calculator = new CalculatorFinansialRiskQuestions(FormData, modelType);
    return await calculator.calcGroups();
  }
  async getReputation(modelType, id) {
    let service = getService(modelType);
    let FormData = await service.getFormDataById(id);
    let calculator = new CalculatorReputationQuestions(FormData, modelType);
    return await calculator.calcGroups();
  }
}

module.exports = new CalculatorService();
