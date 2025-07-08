// types/three-fiber-extensions.d.ts

import '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    ambientLight: JSX.IntrinsicElements['ambientLight'];
    directionalLight: JSX.IntrinsicElements['directionalLight'];
    pointLight: JSX.IntrinsicElements['pointLight'];
    spotLight: JSX.IntrinsicElements['spotLight'];
    hemisphereLight: JSX.IntrinsicElements['hemisphereLight'];
    // 他にも使う要素があればここに追加
  }
}
