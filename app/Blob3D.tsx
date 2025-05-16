"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function LiquidBlob({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (mesh) {
      const time = clock.getElapsedTime();
      const geom = mesh.geometry as THREE.SphereGeometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = pos.getX(i);
        const oy = pos.getY(i);
        const oz = pos.getZ(i);
        // Spherical coordinates
        const r = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const theta = Math.atan2(Math.sqrt(ox * ox + oy * oy), oz);
        const phi = Math.atan2(oy, ox);
        // More liquid wobble with higher amplitude and frequency
        const wobble =
          0.22 * Math.sin(7 * theta + time * 3 + mouse.x * 3) +
          0.22 * Math.cos(7 * phi + time * 3 + mouse.y * 3);
        const newR = 1 + wobble;
        pos.setXYZ(
          i,
          newR * Math.sin(theta) * Math.cos(phi),
          newR * Math.sin(theta) * Math.sin(phi),
          newR * Math.cos(theta)
        );
      }
      pos.needsUpdate = true;
      geom.computeVertexNormals();
    }
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#fff"
        roughness={0.1}
        metalness={1}
        envMapIntensity={2}
      />
    </mesh>
  );
}

export default function Blob3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ width: '100%', height: 320 }}
      onMouseMove={e => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
        });
      }}
    >
      <Canvas camera={{ position: [0, 0, 3] }} style={{ background: 'transparent' }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <directionalLight position={[-2, -2, 2]} intensity={0.7} />
        <pointLight position={[0, 0, 3]} intensity={0.8} />
        <LiquidBlob mouse={mouse} />
      </Canvas>
    </div>
  );
} 