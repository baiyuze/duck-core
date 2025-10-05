export default class Scale {
  value: number = 1;
  constructor(data?: Partial<Scale>) {
    this.value = data?.value || this.value;
  }
}
