import type { BaseSketch, Disposable } from './BaseSketch';
import { VanillaModule } from '@/types/types';

export function createSketchFactory(SketchClass: VanillaModule['default']) {
  return (container: HTMLElement): Disposable => {
    if (container.hasChildNodes()) {
      container.replaceChildren();
    }

    const instance = new SketchClass(container);
    instance.init();

    return instance;
  };
}
