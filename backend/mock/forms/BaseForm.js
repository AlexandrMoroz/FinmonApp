module.exports = class BaseForm {
  constructor(template) {
    this.template = template;
  }
  toJSON() {
    return JSON.stringify(this.template);
  }
  pushToTemplate(elem) {
    this.template = { ...this.template, elem };
  }
};
