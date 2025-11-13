export type ExtractedImage = {
  base64Image: string;
  src: string;
  size: number;
  mimetype: string;
  buffer: Buffer<ArrayBufferLike>;
};
