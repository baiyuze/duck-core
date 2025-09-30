export class Image {
  url?: string;
  constructor(data?: Partial<Image>) {
    this.url = data?.url;
  }
}
