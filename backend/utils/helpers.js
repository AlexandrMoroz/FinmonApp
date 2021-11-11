const ResolvePath = (object, path, defaultValue) => {
  if (isEmpty(object) || !path) return object;
  return path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);
};

function isEmpty(obj) {
  for (var i in obj) return false;
  return true;
}

function OperationShoudinclude(nameOfField) {
  let answer = this.result["Operations"];
  if (answer == undefined || answer.lenght == 0) return false;
  return answer.map((item) => item.Operation == nameOfField).includes(true);
}
function ClosedQuestion(nameOfField) {
  let answer = ResolvePath(this.result, nameOfField);
  if (answer == undefined) return false;
  if (answer) return true;
  else return false;
}
function DateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

module.exports = {
  ResolvePath,
  OperationShoudinclude,
  ClosedQuestion,
  DateDiffInDays,
};
