export class Selected {
  value?: boolean = false;
  hovered?: boolean = false;
  constructor(data: { value?: boolean; hovered?: boolean } = {}) {
    this.value = data.value || false;
    this.hovered = data.hovered || false;
  }
}
