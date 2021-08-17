class Question {
  constructor(question, calculationCallBack) {
    this.question = question;
    this.calculationCallBack = calculationCallBack;
  }
  calcQuestion() {
    return this.calculationCallBack();
  }
}
