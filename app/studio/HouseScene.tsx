"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

type PlanWall = { x1: number; y1: number; x2: number; y2: number };
type PlanMarker = { x: number; y: number; kind: "door" | "window" | "measure" };

function HouseGeometry({ walls, markers }: { walls: PlanWall[]; markers: PlanMarker[] }) {
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
      {/* Door and window markers from the 2D plan are represented in the 3D scene. */}
      {markers.filter((marker) => marker.kind === "door" || marker.kind === "window").map((marker, index) => {
        const x = (marker.x - 270) / 71;
        const z = (205 - marker.y) / 72;
        const isDoor = marker.kind === "door";
        return (
          <group key={`plan-marker-${marker.kind}-${index}`} position={[x, isDoor ? 0.82 : 1.55, z]}>
            <mesh castShadow>
              <boxGeometry args={[isDoor ? 0.72 : 0.92, isDoor ? 1.58 : 0.78, 0.075]} />
              <meshStandardMaterial color={isDoor ? "#735a3e" : "#62b9c8"} metalness={isDoor ? 0.05 : 0.25} roughness={isDoor ? 0.72 : 0.22} />
            </mesh>
            {!isDoor && <mesh position={[0, 0, 0.045]}>
              <boxGeometry args={[0.035, 0.78, 0.025]} />
              <meshStandardMaterial color="#d5e4df" />
            </mesh>}
          </group>
        );
      })}
      {/* No prebuilt house: geometry is generated from the architect's own plan edits. */}
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

function Scene({ walls, markers }: { walls: PlanWall[]; markers: PlanMarker[] }) {
  return (
    <>
      <color attach="background" args={["#172019"]} />
      <fog attach="fog" args={["#172019", 13, 25]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 5, -4]} intensity={0.8} color="#a9d5b5" />
      <HouseGeometry walls={walls} markers={markers} />
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

export default function HouseScene({ walls = [], markers = [] }: { walls?: PlanWall[]; markers?: PlanMarker[] }) {
  return (
    <div className="real-3d-scene" aria-label="Interactive 3D architectural house model">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [7.8, 5.7, 8.8], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <Scene walls={walls} markers={markers} />
        </Suspense>
      </Canvas>
      <div className="scene-hint">DRAG TO ORBIT · SCROLL TO ZOOM</div>
    </div>
  );
}
