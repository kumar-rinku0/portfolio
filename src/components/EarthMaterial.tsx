"use client";

import * as THREE from "three";
import React from "react";
import { useLoader } from "@react-three/fiber";

const defaultSunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();

interface EarthMaterialProps {
  sunDirection?: THREE.Vector3;
}

// ----------------------------
// Custom hook (hooks allowed here)
// ----------------------------
function useEarthMaterial(sunDirection: THREE.Vector3 = defaultSunDirection) {
  const map = useLoader(THREE.TextureLoader, "./earth/earth-daymap-4k.jpg");
  const nightMap = useLoader(
    THREE.TextureLoader,
    "./earth/earth-nightmap-4k.jpg"
  );
  const cloudsMap = useLoader(
    THREE.TextureLoader,
    "./earth/earth-clouds-4k.jpg"
  );

  const uniforms = React.useMemo(
    () => ({
      dayTexture: { value: map },
      nightTexture: { value: nightMap },
      cloudsTexture: { value: cloudsMap },
      sunDirection: { value: sunDirection },
    }),
    [map, nightMap, cloudsMap, sunDirection]
  );

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;

      vUv = uv;
      vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
      vPosition = modelPosition.xyz;
    }
  `;

  const fragmentShader = `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudsTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDirection = normalize(vPosition - cameraPosition);
      vec3 normal = normalize(vNormal);
      vec3 color = vec3(0.0);

      float sunOrientation = dot(sunDirection, normal);
      float dayMix = smoothstep(-0.25, 0.5, sunOrientation);

      vec3 dayColor = texture(dayTexture, vUv).rgb;
      vec3 nightColor = texture(nightTexture, vUv).rgb;

      color = mix(nightColor, dayColor, dayMix);

      // Clouds
      vec2 cloudTex = texture(cloudsTexture, vUv).rg;
      float cloudsMix = smoothstep(0.0, 1.0, cloudTex.g) * dayMix;
      color = mix(color, vec3(1.0), cloudsMix);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const material = React.useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    mat.needsUpdate = true;
    return mat;
  }, [uniforms]);

  return material;
}

// ----------------------------
// Component
// ----------------------------
function EarthMaterial({
  sunDirection = defaultSunDirection,
}: EarthMaterialProps) {
  const material = useEarthMaterial(sunDirection);
  return <primitive object={material} />;
}

export default EarthMaterial;
