export default class Scale {
  value: number = 1;
  constructor(v?: number) {
    this.value = v || this.value;
  }
}
