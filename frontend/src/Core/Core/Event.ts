import mitt from "mitt";
const emitter = mitt();

export class Event {
  on = emitter.on;
  emit = emitter.emit;
  off = emitter.off;
  clear() {
    emitter.all.clear();
  }
}
