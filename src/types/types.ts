import { Color } from 'three';
import { ComponentType } from 'react';
import { BaseSketch, Disposable } from 'core/BaseSketch';

export type SketchType = 'r3f' | 'vanilla';

export type VanillaSketch = new (container: HTMLElement) => Disposable;
export type VanillaModule = {
  default: new (container: HTMLElement, meta?: MetaConfig) => BaseSketch;
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

export interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position?: [number, number, number];
  intensity?: number;
  color?: string;
  castShadow?: boolean;
  distance?: number;
  decay?: number;
  angle?: number;
  penumbra?: number;
}

export interface MetaConfig {
  camera?: {
    position: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  lights?: LightConfig[];
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

//DoublClick Functional
export type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

export type FullscreenElement = Element & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export type MeshParams = {
  position: { x: number; y: number; z: number };
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  wireframe?: boolean;
  size?: number;
  sizes?: {} | undefined;
  count?: number;
  color: string | number | Color;
  metalness?: number;
  roughness?: number;
  rotationSpeed?: number;
  rotationIndex?: number;
  autoRotate?: boolean;
};
