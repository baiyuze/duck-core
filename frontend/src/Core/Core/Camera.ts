export class Camera {
  scale: boolean = true;
  zoom = 1;
  minZoom = 0.05;
  maxZoom = 30;
  isZooming = false;
  translateX = 0;
  translateY = 0;
  minX: number | null = null;
  maxX: number | null = null;
  minY: number | null = null;
  maxY: number | null = null;
}
