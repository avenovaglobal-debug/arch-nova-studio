"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

type PlanWall = { x1: number; y1: number; x2: number; y2: number };
type PlanMarker = { x: number; y: number; kind: "door" | "window" | "measure" };

function HouseGeometry({ walls, markers }: { walls: PlanWall[]; markers: PlanMarker[] }) {
  return (
    <group position={[0, -0.02, 0]}>
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
            <meshStandardMaterial color="#70c795" roughness={0.65} />
          </mesh>
        );
      })}
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
