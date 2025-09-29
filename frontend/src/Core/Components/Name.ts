export class Name {
  name: string = "Unnamed";
  constructor(name?: string) {
    this.name = name || this.name;
  }
}
