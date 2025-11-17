"use client";

import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nebula from "@/components/Nebula";
import Starfield from "@/components/StarField";
import EarthMaterial from "@/components/EarthMaterial";
import AtmosphereMesh from "@/components/AtmosphereMesh";

const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);

function Earth() {
  const ref = React.useRef<THREE.Mesh | null>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });
  const axialTilt = (23.4 * Math.PI) / 180;
  return (
    <group rotation-z={axialTilt}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 64]} />
        <EarthMaterial sunDirection={sunDirection} />
        <AtmosphereMesh />
      </mesh>
    </group>
  );
}

function EarthCircle() {
  const { x, y, z } = sunDirection;
  return (
    <Canvas
      style={{
        width: "80vw", // 80% of viewport width
        height: "80vw", // keep it square
        maxWidth: "600px",
        maxHeight: "600px",
        minWidth: "300px",
        minHeight: "300px",
      }}
      camera={{ position: [0, 0.1, 5] }}
      gl={{ toneMapping: THREE.NoToneMapping }}
    >
      <Earth />
      <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
      <directionalLight position={[x, y, z]} />
      <Nebula />
      <Starfield />
      <OrbitControls />
    </Canvas>
  );
}

export default EarthCircle;
