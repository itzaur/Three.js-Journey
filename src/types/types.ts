import { ComponentType } from 'react';
import { BaseSketch, Disposable } from 'core/BaseSketch';

export type SketchType = 'r3f' | 'vanilla';

export type VanillaSketch = new (container: HTMLElement) => Disposable;
export type VanillaModule = {
  default: new (container: HTMLElement) => BaseSketch;
};

export type R3FSketch = React.ComponentType;
export type R3FModule = { default: ComponentType };

export interface LoadedSketchBase<M> {
  mod: M;
  meta: MetaConfig | null;
}

export type LoadedSketch =
  | (LoadedSketchBase<R3FModule> & { kind: 'r3f' })
  | (LoadedSketchBase<VanillaModule> & { kind: 'vanilla' });

export type LessonVariant = { type: SketchType; id: string; file: string };
export type Lesson = {
  sketch: string;
  title: string;
  preview?: string;
  id: string;
  variants: LessonVariant[];
};
export interface BurgerProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

export interface MetaConfig {
  camera?: {
    position: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  lights?: {
    type: 'ambient' | 'directional' | 'point' | 'spot';
    position: [number, number, number];
    intensity?: number;
    color?: string;
    castShadow?: boolean;
    distance?: number;
    decay?: number;
    angle?: number;
    penumbra?: number;
  };
  background?: string;
  environment?: {
    preset?:
      | 'apartment'
      | 'city'
      | 'dawn'
      | 'forest'
      | 'lobby'
      | 'night'
      | 'park'
      | 'studio'
      | 'sunset'
      | 'warehouse';
    background?: string | 'transparent';
    fog?: {
      color?: string;
      near?: number;
      far?: number;
    };
    environmentIntensity?: number;
    files?: String[];
  };
}

export interface CanvasWrapperProps {
  Component: R3FSketch;
  meta?: MetaConfig;
}
