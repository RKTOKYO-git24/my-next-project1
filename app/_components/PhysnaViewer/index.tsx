'use client';

import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three'; // 追加

type GLTFResult = {
  nodes: any;
  materials: any;
  scene: any;
};

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) as GLTFResult;
  return <primitive object={scene} />;

}

export default function PhysnaViewer({ url }: { url: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <ambientLight intensity={0.6} />
      <OrbitControls />
    </Canvas>
  );
}
