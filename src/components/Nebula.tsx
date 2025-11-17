"use client";

import * as THREE from "three";
import React from "react";

const loader = new THREE.TextureLoader();

interface GetSpriteProps {
  hasFog: boolean;
  color: THREE.Color;
  opacity: number;
  path: string;
  pos: THREE.Vector3;
  size: number;
}

function getSprite({
  hasFog,
  color,
  opacity,
  path,
  pos,
  size,
}: GetSpriteProps) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    fog: hasFog,
    map: loader.load(path),
    transparent: true,
    opacity,
  });

  // Slight random color variation
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);

  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);

  const randomizedSize = size + Math.random() - 0.5;
  sprite.scale.set(randomizedSize, randomizedSize, randomizedSize);

  sprite.material.rotation = 0;
  return sprite;
}

interface GetSpritesProps {
  hasFog?: boolean;
  hue?: number;
  numSprites?: number;
  opacity?: number;
  path?: string;
  radius?: number;
  sat?: number;
  size?: number;
  z?: number;
}

function getSprites({
  hasFog = true,
  hue = 0.65,
  numSprites = 8,
  opacity = 0.2,
  path = "./rad-grad.png",
  radius = 10,
  sat = 0.5,
  size = 24,
  z = -10.5,
}: GetSpritesProps = {}) {
  const layerGroup = new THREE.Group();

  for (let i = 0; i < numSprites; i++) {
    const angle = (i / numSprites) * Math.PI * 2;

    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );

    const color = new THREE.Color().setHSL(hue, 1, sat);

    const sprite = getSprite({ hasFog, color, opacity, path, pos, size });
    layerGroup.add(sprite);
  }

  return layerGroup;
}

function Nebula() {
  const sprites = React.useMemo(
    () =>
      getSprites({
        numSprites: 8,
        radius: 10,
        z: -10.5,
        size: 24,
        opacity: 0.2,
        path: "./rad-grad.png",
      }),
    []
  );

  return <primitive object={sprites} />;
}

export default Nebula;
