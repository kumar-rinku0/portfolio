"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";

interface StarPoint {
  pos: THREE.Vector3;
  update: (t: number) => number;
  minDist: number;
  hue: number;
}

interface GetPointsOptions {
  numStars?: number;
}

function getPoints({ numStars = 500 }: GetPointsOptions = {}) {
  function randomSpherePoint(): StarPoint {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const rate = Math.random();
    const prob = Math.random();
    const light = Math.random();

    function update(t: number) {
      const lightness = prob > 0.8 ? light + Math.sin(t * rate) : light;
      return lightness;
    }

    return {
      pos: new THREE.Vector3(x, y, z),
      update,
      minDist: radius,
      hue: Math.random(), // Added, since original code referenced hue
    };
  }

  const verts: number[] = [];
  const colors: number[] = [];
  const positions: StarPoint[] = [];

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint();
    positions.push(p);

    const { pos, hue } = p;
    const col = new THREE.Color().setHSL(hue, 0.2, Math.random());

    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("./circle.png"),
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);

  function update(t: number) {
    points.rotation.y -= 0.0002;

    const newColors: number[] = [];
    for (let i = 0; i < numStars; i++) {
      const bright = positions[i].update(t);
      const col = new THREE.Color().setHSL(0.6, 0.2, bright);
      newColors.push(col.r, col.g, col.b);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(newColors, 3));
    (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  points.userData = { update };

  return points;
}

function Starfield() {
  const ref = useRef<THREE.Points>(null!);

  const points = React.useMemo(() => getPoints({ numStars: 3000 }), []);

  useFrame((state) => {
    const { clock } = state;
    ref.current?.userData.update(clock.elapsedTime);
  });

  return <primitive object={points} ref={ref} />;
}

export default Starfield;
