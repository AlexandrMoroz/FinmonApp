const { formatters } = require("jsondiffpatch");
const Translate = require("./Translater");
const OPERATIONS = {
  add: "Додано",
  remove: "Видаленно",
  replace: "Заменінно",
  move: "Переміщено",
};

class Formater extends formatters.base.default {
  constructor(translate_arr) {
    super();
    this.translate = Translate(translate_arr);
    this.includeMoveDestinations = true;
  }

  prepareContext(context) {
    super.prepareContext(context);
    context.result = [];
    context.path = [];
    context.translate = this.translate;
    context.pushCurrentOp = function (obj) {
      //const {op, value} = obj;
      const val = {
        op: obj.op,
        path: this.currentPath(),
      };
      if (typeof obj.was !== "undefined") {
        val.was = this.translate(obj.was);
        val.became = this.translate(obj.became);
      }
      if (typeof obj.value !== "undefined") {
        val.value = this.translate(obj.value);
      }
      this.result.push(val);
    };

    context.pushMoveOp = function (to) {
      this.result.push({
        op: OPERATIONS.move,
        from: this.currentPath(),
        path: this.toPath(to),
      });
    };

    context.currentPath = function () {
      return `${this.path
        .filter((i) => i != "result")
        .map((i) => {

          return this.translate(i);
        })
        .join("/")}`;
    };

    context.toPath = function (toPath) {
      const to = this.path.slice();
      to[to.length - 1] = toPath;
      return `${to
        .filter((i) => i != "result")
        .map((i) => {
          return this.translate(i);
        })
        .join("/")}`;
    };
  }

  typeFormattterErrorFormatter(context, err) {
    context.out(`[ERROR] ${err}`);
  }

  rootBegin() {}
  rootEnd() {}

  nodeBegin({ path }, key, leftKey) {
    path.push(leftKey);
  }

  nodeEnd({ path }) {
    path.pop();
  }

  /* jshint camelcase: false */
  /* eslint-disable camelcase */

  format_unchanged() {}

  format_movedestination() {}

  format_node(context, delta, left) {
    this.formatDeltaChildren(context, delta, left);
  }

  format_added(context, delta) {
    context.pushCurrentOp({ op: OPERATIONS.add, value: delta[0] });
  }

  format_modified(context, delta) {
    context.pushCurrentOp({
      op: OPERATIONS.replace,
      was: delta[0],
      became: delta[1],
    });
  }

  format_deleted(context, delta) {
    context.pushCurrentOp({ op: OPERATIONS.remove, value: delta[0] });
  }

  format_moved(context, delta) {
    const to = delta[1];
    context.pushMoveOp(to);
  }

  format_textdiff() {
    throw new Error("Not implemented");
  }

  format(delta, left) {
    let context = {};
    this.prepareContext(context);
    this.recurse(context, delta, left);
    return context.result;
  }

  format_arr(deltaArr, left) {
    let context = {};
    this.prepareContext(context);
    deltaArr.forEach(({ diff }) => {
      this.recurse(context, diff, left);
    });
    return context.result;
  }
}

module.exports.Formater = Formater;
module.exports.OPERATIONS = OPERATIONS;
