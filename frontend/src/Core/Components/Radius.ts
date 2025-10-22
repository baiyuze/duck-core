export class Radius {
  lt: number = 0;
  rt: number = 0;
  rb: number = 0;
  lb: number = 0;

  constructor(data?: Partial<Radius>) {
    this.lt = data?.lt || 0;
    this.rt = data?.rt || 0;
    this.rb = data?.rb || 0;
    this.lb = data?.lb || 0;
  }
}
