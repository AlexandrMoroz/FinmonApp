class CellWalker {
  constructor(startCol = "A", startRow = "1") {
    this.startCol = startCol;
    this.startRow = startRow;
    this.currentCol = startCol;
    this.currentRow = startRow;
    this.startCellCode = this.currentCol + this.currentRow;
    this.currentCellCode = this.startCellCode;
  }

  goRight() {
    //Ошибка если код столбца будет из 2 букв AA AB ...
    let col = this.currentCol.toString().charCodeAt(0);
    col++;
    col = String.fromCharCode(col);

    this.currentCol = col;
    this.currentCellCode = `${this.currentCol}${this.currentRow}`;
  }

  goDown() {
    let row = parseInt(this.currentRow);
    row++;
    row = row.toString();

    this.currentRow = row;
    this.currentCellCode = `${this.currentCol}${this.currentRow}`;
  }

  getCurrentRow() {
    return this.currentRow;
  }
  getCurrentCol() {
    return this.currentCol;
  }
  setCurrentRow(row) {
    this.currentRow = row;
  }
  setCurrentCol(col) {
    this.currentCol = col;
  }
  getCurrentCell() {
    return `${this.currentCol}${this.currentRow}`;
  }
  getFirstColCodeCurrentRow() {
    return this.startCol + this.getCurrentRow();
  }
  setCurrentColToFirst() {
    this.currentCol = this.startCol;
    this.currentCellCode = this.getFirstColCodeCurrentRow();
  }
  copy() {
    let newWalker = new CellWalker();
    newWalker.currentCol = this.currentCol;
    newWalker.currentRow = this.currentRow;
    newWalker.startCellCode = this.startCellCode;
    newWalker.currentCellCode = this.startCellCode;
    return newWalker;
  }
}

module.exports = CellWalker;
