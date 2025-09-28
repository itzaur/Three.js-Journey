import { ComponentType } from 'react';
import { BaseSketch, Disposable } from 'core/BaseSketch';

export type SketchType = 'r3f' | 'vanilla';

export type VanillaSketch = new (container: HTMLElement) => Disposable;
export type VanillaModule = {
  default: new (container: HTMLElement) => BaseSketch;
};

export type R3FSketch = React.ComponentType<unknown>;
export type R3FModule = { default: ComponentType };

export type LoadedSketch =
  | { kind: 'r3f'; mod: R3FModule }
  | { kind: 'vanilla'; mod: VanillaModule };

export type LessonVariant = { type: SketchType; id: string; file: string };
export type Lesson = {
  sketch: string;
  title: string;
  id: string;
  variants: LessonVariant[];
};
