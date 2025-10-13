import type { BaseSketch, Disposable } from './BaseSketch';
import { MetaConfig, VanillaModule } from '@/types/types';

export function createSketchFactory(
  SketchClass: VanillaModule['default'],
  meta?: MetaConfig
) {
  return (container: HTMLElement): Disposable => {
    if (container.hasChildNodes()) {
      container.replaceChildren();
    }

    const instance = new SketchClass(container, meta);
    instance.init();

    return instance;
  };
}
