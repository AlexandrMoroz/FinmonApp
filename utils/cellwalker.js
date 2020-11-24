class CellWalker {
  constructor() {
    this.startCellCode = "A1";
    this.currentRow = this.startCellCode;
    this.currentCellCode = this.startCellCode;
  }
  getRigthCell() {
    let col =  this.currentCellCode.match(/(\D+)/g);
    let row =  this.currentCellCode.match(/(\d+)/g);

    col = col.toString().charCodeAt(0);
    col = String.fromCharCode(++col);
    return `${col}${row}`;
  }
  getDownCell() {
    let col =  this.currentCellCode.match(/(\D+)/g);
    let row =  this.currentCellCode.match(/(\d+)/g);

    row = parseInt(row);
    row = ++row
    this.currentCellCode = `${col}${row}`;
    this.currentRow = `A${row}`;
    return this.currentCellCode;
  }
  getCurrentRow() {
    return this.currentRow;
  }
}
module.exports = CellWalker;