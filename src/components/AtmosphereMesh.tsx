"use client";

import * as THREE from "three";
import React from "react";

interface FresnelArgs {
  rimHex?: number;
  facingHex?: number;
}

interface ShaderArgs {
  uniforms: Record<string, { value: any }>;
  vertexShader: string;
  fragmentShader: string;
  transparent: boolean;
  blending: THREE.Blending;
}

function getFresnelShaderArgs({
  rimHex = 0x0088ff,
  facingHex = 0x000000,
}: FresnelArgs = {}): ShaderArgs {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };

  const vertexShader = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;

    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      vec3 worldNormal = normalize(mat3(
        modelMatrix[0].xyz,
        modelMatrix[1].xyz,
        modelMatrix[2].xyz
      ) * normal);

      vec3 I = worldPosition.xyz - cameraPosition;

      vReflectionFactor = fresnelBias +
          fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);

      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;

    varying float vReflectionFactor;

    void main() {
      float f = clamp(vReflectionFactor, 0.0, 1.0);
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
  `;

  return {
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  };
}

interface AtmosphereMeshProps {
  rimHex?: number;
  facingHex?: number;
}

function AtmosphereMesh({ rimHex, facingHex }: AtmosphereMeshProps) {
  const args = React.useMemo(
    () => getFresnelShaderArgs({ rimHex, facingHex }),
    [rimHex, facingHex]
  );

  return (
    <mesh>
      <icosahedronGeometry args={[2.03, 32]} />
      {/* shaderMaterial needs “any” props unless you define a custom material */}
      <shaderMaterial attach="material" {...args} />
    </mesh>
  );
}

export default AtmosphereMesh;
