export class Color {
  value: string = "#000000";
  constructor(value: string) {
    this.value = value;
  }
  setColor(value: string) {
    this.value = value;
  }
  getColor() {
    return this.value;
  }
}
