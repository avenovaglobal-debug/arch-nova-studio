"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

type PlanWall = { x1: number; y1: number; x2: number; y2: number };

function HouseGeometry({ walls }: { walls: PlanWall[] }) {
  const wall = "#9eafa1";
  const roof = "#506458";
  const glass = "#24483b";
  return (
    <group position={[0, -0.02, 0]} rotation={[0, 0.025, 0]}>
      {/* User-drawn plan walls are mirrored into the 3D viewport. */}
      {walls.map((wall, index) => {
        const x1 = (wall.x1 - 270) / 71;
        const z1 = (205 - wall.y1) / 72;
        const x2 = (wall.x2 - 270) / 71;
        const z2 = (205 - wall.y2) / 72;
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.max(0.08, Math.hypot(dx, dz));
        return (
          <mesh key={`custom-wall-${index}`} position={[(x1 + x2) / 2, 1.35, (z1 + z2) / 2]} rotation={[0, Math.atan2(-dz, dx), 0]} castShadow>
            <boxGeometry args={[length, 2.7, 0.11]} />
            <meshStandardMaterial color="#70c795" transparent opacity={0.78} roughness={0.65} />
          </mesh>
        );
      })}
      {/* Site plinth */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[7.6, 0.2, 5.7]} />
        <meshStandardMaterial color="#46564b" roughness={0.9} />
      </mesh>
      {/* Ground level volume */}
      <mesh position={[-0.15, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.9, 1.8, 4.2]} />
        <meshStandardMaterial color={wall} roughness={0.82} />
      </mesh>
      {/* Upper storey */}
      <mesh position={[0.1, 2.45, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 1.3, 3.65]} />
        <meshStandardMaterial color="#829889" roughness={0.8} />
      </mesh>
      {/* Flat roof slabs */}
      <mesh position={[0.1, 3.15, -0.25]} castShadow>
        <boxGeometry args={[4.85, 0.16, 3.95]} />
        <meshStandardMaterial color={roof} roughness={0.72} />
      </mesh>
      <mesh position={[-0.15, 1.86, 0]} castShadow>
        <boxGeometry args={[6.2, 0.12, 4.45]} />
        <meshStandardMaterial color="#b9c8bc" roughness={0.72} />
      </mesh>
      {/* Front glazing panels */}
      {[-1.75, -0.55, 0.85].map((x, i) => (
        <mesh key={x} position={[x, 0.92, 2.115]}>
          <boxGeometry args={[i === 1 ? 0.85 : 0.95, 1.38, 0.035]} />
          <meshStandardMaterial color={glass} metalness={0.28} roughness={0.22} />
        </mesh>
      ))}
      {/* Upper-storey windows */}
      {[-1.15, 0.45, 1.35].map((x) => (
        <mesh key={x} position={[x, 2.48, 1.58]}>
          <boxGeometry args={[0.85, 0.82, 0.045]} />
          <meshStandardMaterial color={glass} metalness={0.2} roughness={0.2} />
        </mesh>
      ))}
      {/* Window frames on upper floor */}
      {[-1.15, 0.45, 1.35].map((x) => (
        <group key={`frame-${x}`} position={[x, 2.48, 1.61]}>
          <mesh position={[0, 0.43, 0]}><boxGeometry args={[0.9, 0.045, 0.06]} /><meshStandardMaterial color="#d4ded5" /></mesh>
          <mesh position={[0, -0.43, 0]}><boxGeometry args={[0.9, 0.045, 0.06]} /><meshStandardMaterial color="#d4ded5" /></mesh>
          <mesh position={[-0.43, 0, 0]}><boxGeometry args={[0.045, 0.86, 0.06]} /><meshStandardMaterial color="#d4ded5" /></mesh>
          <mesh position={[0.43, 0, 0]}><boxGeometry args={[0.045, 0.86, 0.06]} /><meshStandardMaterial color="#d4ded5" /></mesh>
        </group>
      ))}
      {/* Entry door */}
      <mesh position={[1.65, 0.8, 2.14]}>
        <boxGeometry args={[0.72, 1.55, 0.06]} />
        <meshStandardMaterial color="#354b3d" roughness={0.6} />
      </mesh>
      {/* Recessed balcony and thin rail */}
      <mesh position={[1.45, 2.0, 1.9]}>
        <boxGeometry args={[1.65, 0.08, 0.8]} />
        <meshStandardMaterial color="#a8b9ab" />
      </mesh>
      <mesh position={[1.45, 2.28, 2.25]}>
        <boxGeometry args={[1.65, 0.035, 0.035]} />
        <meshStandardMaterial color="#d0dbd1" metalness={0.55} roughness={0.35} />
      </mesh>
      {[-0.25, 0.45, 1.15, 1.95, 2.25].map((x) => (
        <mesh key={x} position={[x, 2.14, 2.25]}>
          <boxGeometry args={[0.025, 0.28, 0.025]} />
          <meshStandardMaterial color="#c1d0c4" metalness={0.45} />
        </mesh>
      ))}
      {/* Side windows visible in orbit */}
      {[-1.1, 0.5].map((z) => (
        <mesh key={z} position={[2.81, 0.98, z]}>
          <boxGeometry args={[0.035, 0.88, 0.75]} />
          <meshStandardMaterial color={glass} metalness={0.22} roughness={0.2} />
        </mesh>
      ))}
      {/* Slim architectural fins */}
      {[-2.3, -2.05, -1.8].map((x) => (
        <mesh key={x} position={[x, 0.92, 2.17]}>
          <boxGeometry args={[0.035, 1.55, 0.09]} />
          <meshStandardMaterial color="#c4d1c6" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ walls }: { walls: PlanWall[] }) {
  return (
    <>
      <color attach="background" args={["#172019"]} />
      <fog attach="fog" args={["#172019", 13, 25]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 5, -4]} intensity={0.8} color="#a9d5b5" />
      <HouseGeometry walls={walls} />
      <Grid
        position={[0, -0.205, 0]}
        args={[18, 18]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#354b3b"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#5a7860"
        fadeDistance={20}
        infiniteGrid
      />
      <ContactShadows position={[0, -0.19, 0]} opacity={0.45} scale={12} blur={2.5} far={5} />
      <Environment preset="city" />
      <OrbitControls
        makeDefault
        target={[0, 1.25, 0]}
        minDistance={5.5}
        maxDistance={15}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export default function HouseScene({ walls = [] }: { walls?: PlanWall[] }) {
  return (
    <div className="real-3d-scene" aria-label="Interactive 3D architectural house model">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [7.8, 5.7, 8.8], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <Scene walls={walls} />
        </Suspense>
      </Canvas>
      <div className="scene-hint">DRAG TO ORBIT · SCROLL TO ZOOM</div>
    </div>
  );
}
