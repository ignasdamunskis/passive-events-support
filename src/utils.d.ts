declare module 'passive-events-support/src/utils' {
  type Event =
    | 'touchstart'
    | 'touchmove'
    | 'touchcenter'
    | 'touchend'
    | 'touchleave'
    | 'wheel'
    | 'mousewheel'

  interface Listener {
    element: string;
    event: Event;
    prevented?: boolean;
  }

  export interface PassiveSupportOptions {
    debug?: boolean;
    events?: Event[];
    listeners?: Listener[];
  }

  export function passiveSupported(debug: boolean): boolean;
  export function passiveSupport(options?: PassiveSupportOptions): void;
}