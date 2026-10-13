"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { CitadelMark } from "./CitadelLogo";

export interface CitadelPhaseData {
  phase: number;
  id: string;
  name: string;
  subtitle: string;
  description: string;
  role: string;
}

export const CITADEL_PHASES: CitadelPhaseData[] = [
  {
    phase: 1,
    id: "01",
    name: "BUSINESS FIRST",
    subtitle: "The Foundation",
    description: "The foundation of every Citadel solution.",
    role: "Base Foundation Plinth",
  },
  {
    phase: 2,
    id: "02",
    name: "UNDERSTAND THE PROBLEM",
    subtitle: "Operational Discovery",
    description: "Start with the real operational problem.",
    role: "Discovery Tier",
  },
  {
    phase: 3,
    id: "03",
    name: "STRUCTURE THE PROCESS",
    subtitle: "System Architecture",
    description: "Turn complexity into a clear system.",
    role: "Process Framework",
  },
  {
    phase: 4,
    id: "04",
    name: "DESIGN THE RIGHT SYSTEM",
    subtitle: "Engineered Solution",
    description: "Technology follows the business need.",
    role: "Solution Core",
  },
  {
    phase: 5,
    id: "05",
    name: "BUILD WITH PURPOSE",
    subtitle: "Execution & Code",
    description: "Turn the solution into something that works.",
    role: "Execution Layer",
  },
  {
    phase: 6,
    id: "06",
    name: "SCALE WHAT WORKS",
    subtitle: "Sustainable Growth",
    description: "Build systems that can grow with the business.",
    role: "Scalability Tier",
  },
  {
    phase: 7,
    id: "07",
    name: "CREATE LASTING VALUE",
    subtitle: "Long-term Impact",
    description: "The goal is sustainable growth, not a temporary fix.",
    role: "Impact & Capstone",
  },
  {
    phase: 8,
    id: "08",
    name: "THE CITADEL APEX",
    subtitle: "Fortified Architecture",
    description: "A complete, fortified system protecting sustainable growth.",
    role: "Crenellated Battlements",
  },
];

// Tier dimensions derived directly from citadel-mark.svg vectors
interface TierSpec {
  width: number;
  height: number;
  depth: number;
  gap: number;
  isCrown?: boolean;
}

const TIER_SPECS: TierSpec[] = [
  { width: 2.85, height: 0.48, depth: 2.85, gap: 0.1 }, // Tier 1: Vector (foundation base)
  { width: 2.52, height: 0.34, depth: 2.52, gap: 0.1 }, // Tier 2: Vector_2
  { width: 2.2, height: 0.33, depth: 2.2, gap: 0.1 }, // Tier 3: Vector_3
  { width: 1.95, height: 0.33, depth: 1.95, gap: 0.1 }, // Tier 4: Vector_4
  { width: 1.7, height: 0.32, depth: 1.7, gap: 0.1 }, // Tier 5: Vector_5
  { width: 1.44, height: 0.32, depth: 1.44, gap: 0.1 }, // Tier 6: Vector_6
  { width: 1.2, height: 0.31, depth: 1.2, gap: 0.1 }, // Tier 7: Vector_7
  { width: 1.44, height: 0.31, depth: 1.44, gap: 0.1, isCrown: true }, // Tier 8: Vector_8 (Overhanging Crown + crenellations)
];

const RESTING_ROT_Y = 0.9; // 45° corner facing camera symmetrically
const RESTING_ROT_X = 0.18; // 10.3° downward isometric architectural tilt
const MIN_ROT_Y = Math.PI / 4 - 0.6;
const MAX_ROT_Y = Math.PI / 4 + 0.6;
const MIN_ROT_X = -0.05;
const MAX_ROT_X = 0.35;

const PHASE_ANGLES = [
  0.22, // Phase 1: 13° (Foundation base)
  0.58, // Phase 2: 33° (Discovery side)
  0.18, // Phase 3: 10° (Structure framework)
  0.64, // Phase 4: 36° (Solution core)
  0.28, // Phase 5: 16° (Execution layer)
  0.68, // Phase 6: 39° (Scale tier)
  0.38, // Phase 7: 22° (Impact capstone)
  RESTING_ROT_Y, // Phase 8: 0.45 (Full Fortress 360 Spin)
];

const CAMERA_Y_OFFSETS = [
  -0.28, // Phase 1: low angle framing foundation
  -0.2, // Phase 2
  -0.12, // Phase 3
  -0.04, // Phase 4
  0.06, // Phase 5
  0.14, // Phase 6
  0.22, // Phase 7: elevated angle framing upper tier
  0.45, // Phase 8: centered apex framing
];

interface Citadel3DModelProps {
  phase?: number | "all";
  interactive?: boolean;
  showControls?: boolean;
  borderless?: boolean;
  lockRotation?: boolean;
  lockRotationX?: boolean;
  lockRotationY?: boolean;
  snapBackOnRelease?: boolean;
  showGround?: boolean;
  disableGround?: boolean;
  enablePhaseHover?: boolean;
  enablePhaseClick?: boolean;
  spinOnPhase8?: boolean;
  label?: string;
  className?: string;
  heightClass?: string;
  onReady?: (status: {
    success: boolean;
    webglAvailable: boolean;
    error?: Error;
  }) => void;
}

export function Citadel3DModel({
  phase = "all",
  interactive = true,
  showControls = false,
  borderless = false,
  lockRotation = false,
  lockRotationX,
  lockRotationY,
  snapBackOnRelease = false,
  showGround = true,
  disableGround = false,
  enablePhaseHover = false,
  enablePhaseClick = false,
  spinOnPhase8 = true,
  label,
  className = "",
  heightClass = "h-[420px] sm:h-[500px]",
  onReady,
}: Citadel3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPhaseRef = useRef<number | "all">(phase);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  const [webGlFailed, setWebGlFailed] = useState(false);

  // User interaction states
  const [clickedPhase, setClickedPhase] = useState<number | "all" | null>(null);
  const [prevPropPhase, setPrevPropPhase] = useState(phase);
  if (phase !== prevPropPhase) {
    setPrevPropPhase(phase);
    setClickedPhase(null);
  }
  const activePhaseIndex = clickedPhase ?? phase;

  const [hoveredPhase, setHoveredPhase] = useState<CitadelPhaseData | null>(
    null,
  );
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isLockX = lockRotationX !== undefined ? lockRotationX : lockRotation;
  const isLockY = lockRotationY !== undefined ? lockRotationY : lockRotation;
  const isGroundDisabled = disableGround || showGround === false;

  const lockRotationRef = useRef(lockRotation);
  const lockRotationXRef = useRef(isLockX);
  const lockRotationYRef = useRef(isLockY);
  const snapBackOnReleaseRef = useRef(snapBackOnRelease);
  const isGroundDisabledRef = useRef(isGroundDisabled);
  const autoRotateRef = useRef(autoRotate);

  // Three.js and animation references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const towerGroupRef = useRef<THREE.Group | null>(null);
  const tiltGroupRef = useRef<THREE.Group | null>(null);
  const pedestalGroupRef = useRef<THREE.Group | null>(null);
  const tierMeshesRef = useRef<THREE.Group[]>([]);
  const restingPositionsRef = useRef<number[]>([]);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const isMouseDownRef = useRef(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    rotY: number;
    rotX: number;
  }>({
    x: 0,
    y: 0,
    rotY: 0,
    rotX: 0,
  });
  const reqIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const pulseRingRef = useRef<THREE.LineLoop | null>(null);
  const pulseRingMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const isFirstPhaseMountRef = useRef<boolean>(true);
  const isFirstExplodeMountRef = useRef<boolean>(true);

  // Build and manage Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup - Positioned and framed to capture full Citadel height from base to crown
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 9.2);
    camera.lookAt(0, 0.1, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      rendererRef.current = renderer;
    } catch (err) {
      console.warn(
        "Citadel 3D: WebGL initialization failed, switching to 2D fallback",
        err,
      );
      queueMicrotask(() => {
        setWebGlFailed(true);
      });
      if (onReadyRef.current) {
        onReadyRef.current({
          success: false,
          webglAvailable: false,
          error: err as Error,
        });
      }
      return;
    }

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("Citadel 3D: WebGL context lost");
      queueMicrotask(() => {
        setWebGlFailed(true);
      });
      if (onReadyRef.current) {
        onReadyRef.current({
          success: false,
          webglAvailable: false,
          error: new Error("WebGL context lost"),
        });
      }
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    // 4. Lighting - Sculpted architectural studio lighting harmonized with the dark background & particle cloud
    const ambientLight = new THREE.AmbientLight(0xd8e4ff, 0.55);
    scene.add(ambientLight);

    // Key Light - crisp sculptural light casting defined architectural bevel shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim light - cool-ice backlight matching the starry particle cloud to chisel the rook silhouette
    const rimLight = new THREE.DirectionalLight(0xd8e4ff, 1.6);
    rimLight.position.set(-6, 6, -5);
    scene.add(rimLight);

    // Bottom bounce light - deep Citadel Navy reflected from below to anchor the fortress
    const bounceLight = new THREE.DirectionalLight(0x0f2a52, 0.85);
    bounceLight.position.set(0, -6, 2);
    scene.add(bounceLight);

    // Warm capstone apex accent light
    const warmAccentLight = new THREE.DirectionalLight(0xc4a254, 0.45);
    warmAccentLight.position.set(-2, 7, 4);
    scene.add(warmAccentLight);

    // Dynamic focal point light (animates to active tier)
    const focalLight = new THREE.PointLight(0xfff8ea, 1.3, 7);
    focalLight.position.set(0, 0, 2);
    scene.add(focalLight);
    pointLightRef.current = focalLight;

    // 5. Structure Groups
    const tiltGroup = new THREE.Group();
    scene.add(tiltGroup);
    tiltGroupRef.current = tiltGroup;

    const towerGroup = new THREE.Group();
    // Fixed architectural angle showing 3D depth and profile
    towerGroup.rotation.set(RESTING_ROT_X, RESTING_ROT_Y, 0);
    tiltGroup.add(towerGroup);
    towerGroupRef.current = towerGroup;

    // Holographic sonar pulse ring that fires on phase transition
    const pulseRingGeo = new THREE.BufferGeometry();
    const pSegments = 64;
    const pulsePts: THREE.Vector3[] = [];
    for (let i = 0; i <= pSegments; i++) {
      const th = (i / pSegments) * Math.PI * 2;
      pulsePts.push(new THREE.Vector3(Math.cos(th), 0, Math.sin(th)));
    }
    pulseRingGeo.setFromPoints(pulsePts);
    const pulseRingMat = new THREE.LineBasicMaterial({
      color: 0xc4a254,
      transparent: true,
      opacity: 0,
    });
    const pulseRing = new THREE.LineLoop(pulseRingGeo, pulseRingMat);
    pulseRing.visible = false;
    pulseRing.renderOrder = 2;
    towerGroup.add(pulseRing);
    pulseRingRef.current = pulseRing;
    pulseRingMatRef.current = pulseRingMat;

    // 6. Architectural Blueprint Pedestal Grid (concentric circles + radial tick lines)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.visible = !isGroundDisabledRef.current;
    tiltGroup.add(pedestalGroup);
    pedestalGroupRef.current = pedestalGroup;

    const ringRadius = [1.8, 2.4, 3.0];
    ringRadius.forEach((rad, idx) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 64;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(Math.cos(theta) * rad, 0, Math.sin(theta) * rad),
        );
      }
      ringGeo.setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: idx === 1 ? 0.22 : 0.1,
      });
      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      pedestalGroup.add(ringLine);
    });

    // Crosshair ticks
    const tickGeo = new THREE.BufferGeometry();
    const tickPts = [
      new THREE.Vector3(-3.2, 0, 0),
      new THREE.Vector3(3.2, 0, 0),
      new THREE.Vector3(0, 0, -3.2),
      new THREE.Vector3(0, 0, 3.2),
    ];
    tickGeo.setFromPoints(tickPts);
    const tickMat = new THREE.LineSegments(
      tickGeo,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
      }),
    );
    pedestalGroup.add(tickMat);

    // 7. Ambient floating dust / light coordinates
    const particlesCount = 35;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particlesMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 8. Build Citadel 3D Tiers according to citadel-mark.svg
    // Calculate total height to center the tower around Y = 0
    let totalHeight = 0;
    TIER_SPECS.forEach((t) => {
      totalHeight += t.height + t.gap;
      if (t.isCrown) totalHeight += 0.26; // Crown crenellation battlements
    });

    let currentY = -totalHeight / 2 + 0.35;
    pedestalGroup.position.y = currentY - 0.25;

    const tierGroups: THREE.Group[] = [];
    const restingYPos: number[] = [];

    TIER_SPECS.forEach((spec, index) => {
      const tierGroup = new THREE.Group();
      tierGroup.userData = {
        tierIndex: index,
        phaseNumber: index + 1,
        phaseData:
          CITADEL_PHASES[index] || CITADEL_PHASES[CITADEL_PHASES.length - 1],
      };

      const tierY = currentY + spec.height / 2;
      tierGroup.position.y = tierY;
      restingYPos.push(tierY);

      // Main Block geometry
      const boxGeo = new THREE.BoxGeometry(spec.width, spec.height, spec.depth);

      // Pristine architectural stone material with environmental responsiveness
      const blockMat = new THREE.MeshPhysicalMaterial({
        color: 0xf3f6fa,
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        reflectivity: 0.5,
        transparent: true,
        opacity: 0.98,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });

      const blockMesh = new THREE.Mesh(boxGeo, blockMat);
      blockMesh.castShadow = true;
      blockMesh.receiveShadow = true;
      blockMesh.name = `tier-mesh-${index}`;
      tierGroup.add(blockMesh);

      // Sharp architectural hairline edges
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
      });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      edgesMesh.name = `tier-edges-${index}`;
      edgesMesh.renderOrder = 1;
      tierGroup.add(edgesMesh);

      // If Crown (Tier 8 / index 7): Add the 4 crenellation battlements
      if (spec.isCrown) {
        const battlementW = 0.44;
        const battlementH = 0.26;
        const battlementD = 0.44;
        const bGeo = new THREE.BoxGeometry(
          battlementW,
          battlementH,
          battlementD,
        );
        const bEdgesGeo = new THREE.EdgesGeometry(bGeo);

        const cornerOffset = spec.width / 2 - battlementW / 2;
        const corners = [
          [-cornerOffset, -cornerOffset],
          [cornerOffset, -cornerOffset],
          [-cornerOffset, cornerOffset],
          [cornerOffset, cornerOffset],
        ];

        corners.forEach(([cx, cz]) => {
          const bMat = blockMat.clone();
          const bMesh = new THREE.Mesh(bGeo, bMat);
          bMesh.position.set(cx, spec.height / 2 + battlementH / 2, cz);
          bMesh.castShadow = true;
          bMesh.receiveShadow = true;
          tierGroup.add(bMesh);

          const bEdges = new THREE.LineSegments(bEdgesGeo, edgesMat.clone());
          bEdges.position.copy(bMesh.position);
          bEdges.renderOrder = 1;
          tierGroup.add(bEdges);
        });
      }

      towerGroup.add(tierGroup);
      tierGroups.push(tierGroup);

      currentY += spec.height + spec.gap;
      if (spec.isCrown) currentY += 0.26;
    });

    tierMeshesRef.current = tierGroups;
    restingPositionsRef.current = restingYPos;

    // 9. Intersection Observer to pause rendering when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(container);

    // 12. Main Animation Loop
    let lastTime = performance.now();

    // Pre-compile shaders for frame-zero readiness and notify loader
    try {
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
      if (onReadyRef.current) {
        requestAnimationFrame(() => {
          onReadyRef.current?.({ success: true, webglAvailable: true });
        });
      }
    } catch (err) {
      console.warn("Citadel 3D: Shader compile or initial render failed", err);
      if (onReadyRef.current) {
        onReadyRef.current({
          success: false,
          webglAvailable: false,
          error: err as Error,
        });
      }
    }

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Continuous slow rotation if autoRotate is true and Y rotation is not locked
      if (
        !lockRotationRef.current &&
        !lockRotationYRef.current &&
        autoRotateRef.current &&
        !isMouseDownRef.current &&
        towerGroupRef.current
      ) {
        towerGroupRef.current.rotation.y += delta * 0.35;
      }

      // Counter-rotate pedestal grid only if Y rotation is not locked
      if (
        !lockRotationRef.current &&
        !lockRotationYRef.current &&
        pedestalGroupRef.current
      ) {
        pedestalGroupRef.current.rotation.y -= delta * 0.12;
      }

      // Float ambient particles
      if (particleSystem) {
        particleSystem.rotation.y += delta * 0.05;
        const posAttr = particlesGeo.attributes
          .position as THREE.BufferAttribute;
        for (let i = 0; i < particlesCount; i++) {
          let y = posAttr.getY(i) + delta * 0.12;
          if (y > 3) y = -3;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Window & Container Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 14. Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      observer.disconnect();

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  // Synchronize prop updates to Three.js scene elements and refs (runs after scene initialization)
  useEffect(() => {
    lockRotationRef.current = lockRotation;
    lockRotationXRef.current = isLockX;
    lockRotationYRef.current = isLockY;
    snapBackOnReleaseRef.current = snapBackOnRelease;
    isGroundDisabledRef.current = isGroundDisabled;
    if (pedestalGroupRef.current) {
      pedestalGroupRef.current.visible = !isGroundDisabled;
    }
    autoRotateRef.current = autoRotate;
  }, [
    lockRotation,
    isLockX,
    isLockY,
    snapBackOnRelease,
    isGroundDisabled,
    autoRotate,
  ]);

  // Update Tier appearance based on activePhaseIndex
  useEffect(() => {
    const tierGroups = tierMeshesRef.current;
    if (tierGroups.length === 0) return;

    const isFirstMount = isFirstPhaseMountRef.current;
    if (isFirstMount) {
      isFirstPhaseMountRef.current = false;
    }

    const isPhase8OrAll = activePhaseIndex === "all" || activePhaseIndex === 8;
    const isEnteringPhase8 =
      activePhaseIndex === 8 && prevPhaseRef.current !== 8;
    prevPhaseRef.current = activePhaseIndex;

    tierGroups.forEach((tg, idx) => {
      const phaseNum = idx + 1;
      const isActive = isPhase8OrAll || activePhaseIndex === phaseNum;
      const isGhost = !isPhase8OrAll && !isActive;

      // Update materials
      tg.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          if (isGhost) {
            mat.opacity = 0.25;
            mat.roughness = 0.45;
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          } else if (isPhase8OrAll) {
            // AT PHASE 8 / HERO: SCULPTED ARCHITECTURAL FINISH HARMONIZED WITH BACKGROUND
            mat.opacity = 1.0;
            mat.roughness = 0.22;
            mat.metalness = 0.08;
            mat.clearcoat = 0.5;
            mat.clearcoatRoughness = 0.15;
            mat.emissive.setHex(0x0f1c2e);
            mat.emissiveIntensity = 0.15;
          } else if (isActive) {
            // Active focused phase tier (phases 1-7)
            mat.opacity = 1.0;
            mat.roughness = 0.1;
            mat.emissive.setHex(0xffffff);
            if (!isFirstMount) {
              // Flash energy surge on transition, then settle into glowing architectural state
              gsap.fromTo(
                mat,
                { emissiveIntensity: 0.9 },
                {
                  emissiveIntensity: 0.35,
                  duration: 0.7,
                  ease: "power2.out",
                },
              );
            } else {
              mat.emissiveIntensity = 0.35;
            }
          }
        } else if (child instanceof THREE.LineSegments) {
          const lineMat = child.material as THREE.LineBasicMaterial;
          if (isPhase8OrAll) {
            // Clean architectural black outline across the completed structure
            lineMat.color.setHex(0x000000);
            lineMat.opacity = 0.85;
          } else if (isActive) {
            // Active focused phase tier: high-contrast architectural black outline
            lineMat.color.setHex(0x000000);
            lineMat.opacity = 1.0;
          } else if (isGhost) {
            lineMat.color.setHex(0xffffff);
            lineMat.opacity = 0.12;
          }
        }
      });

      // Maintain exact architectural tier alignment; active tier breathes outward horizontally (scaleXZ: 1.07)
      const restingY = restingPositionsRef.current[idx] || 0;
      const targetScaleXZ = !isPhase8OrAll && isActive ? 1.07 : 1.0;
      if (isFirstMount) {
        tg.position.y = restingY;
        tg.scale.set(targetScaleXZ, 1.0, targetScaleXZ);
      } else {
        gsap.to(tg.position, {
          y: restingY,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(tg.scale, {
          x: targetScaleXZ,
          z: targetScaleXZ,
          y: 1.0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    });

    const activeIdx =
      typeof activePhaseIndex === "number" ? activePhaseIndex - 1 : 0;
    const targetY = isPhase8OrAll
      ? 0.5
      : restingPositionsRef.current[activeIdx] || 0;

    // Camera elevator crane: smoothly ascends vertically to frame the active tier
    if (cameraRef.current) {
      const targetCamY =
        activePhaseIndex === "all"
          ? 0.1
          : 0.1 + (CAMERA_Y_OFFSETS[activeIdx] ?? 0);
      if (isFirstMount) {
        cameraRef.current.position.y = targetCamY;
      } else {
        gsap.to(cameraRef.current.position, {
          y: targetCamY,
          duration: 0.9,
          ease: "power3.out",
        });
      }
    }

    // Trigger holographic sonar ripple ring from active tier (numbered phases only, post-mount)
    if (
      !isFirstMount &&
      pulseRingRef.current &&
      pulseRingMatRef.current &&
      activePhaseIndex !== "all"
    ) {
      const ring = pulseRingRef.current;
      const ringMat = pulseRingMatRef.current;
      const tierSpec = TIER_SPECS[activeIdx] || TIER_SPECS[0];
      const initialRadius = (tierSpec.width / 2) * 1.05;

      ring.position.y = isPhase8OrAll ? 0.3 : targetY;
      ring.scale.set(initialRadius, 1, initialRadius);
      ring.visible = true;

      gsap.killTweensOf(ring.scale);
      gsap.killTweensOf(ringMat);

      gsap.fromTo(
        ring.scale,
        { x: initialRadius, z: initialRadius },
        {
          x: initialRadius * 1.65,
          z: initialRadius * 1.65,
          duration: 0.75,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ringMat,
        { opacity: 0.85 },
        {
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => {
            ring.visible = false;
          },
        },
      );
    }

    // Move focal light to active tier and flare up intensity
    if (pointLightRef.current) {
      if (isFirstMount) {
        pointLightRef.current.position.y = targetY;
        pointLightRef.current.intensity = 2.2;
      } else {
        gsap.to(pointLightRef.current.position, {
          y: targetY,
          duration: 0.55,
          ease: "power3.out",
        });
        gsap.fromTo(
          pointLightRef.current,
          { intensity: 5.0 },
          {
            intensity: 2.2,
            duration: 0.65,
            ease: "power2.out",
          },
        );
      }
    }

    // Rotate blueprint pedestal compass rings slightly on user transitions
    if (pedestalGroupRef.current && !isFirstMount) {
      gsap.to(pedestalGroupRef.current.rotation, {
        y: "+=0.35",
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (!isFirstMount) {
      // 360-degree rotation flourish on entering the final phase (Phase 8)
      if (
        spinOnPhase8 &&
        !lockRotationYRef.current &&
        isEnteringPhase8 &&
        towerGroupRef.current &&
        !isMouseDownRef.current
      ) {
        gsap.killTweensOf(towerGroupRef.current.rotation);
        const TWO_PI = Math.PI * 2;
        const startRotY = towerGroupRef.current.rotation.y;
        const normalizedStart = ((startRotY % TWO_PI) + TWO_PI) % TWO_PI;
        let angleDelta = RESTING_ROT_Y - normalizedStart;
        // Ensure at least one full revolution (around 2*PI) landing exactly at RESTING_ROT_Y
        while (angleDelta < Math.PI * 1.2) {
          angleDelta += TWO_PI;
        }
        const targetRotY = startRotY + angleDelta;

        gsap.fromTo(
          towerGroupRef.current.rotation,
          { y: startRotY },
          {
            y: targetRotY,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
              if (towerGroupRef.current) {
                // targetRotY is congruent to RESTING_ROT_Y (0.9) modulo 2*PI; normalization has 0px visual shift
                towerGroupRef.current.rotation.y = RESTING_ROT_Y;
              }
            },
          },
        );
      } else if (
        !isPhase8OrAll &&
        !lockRotationYRef.current &&
        towerGroupRef.current &&
        !isMouseDownRef.current
      ) {
        // Dynamic perspective angle shift: smoothly rotate tower to this phase's signature viewpoint
        const targetAngle = PHASE_ANGLES[activeIdx] ?? RESTING_ROT_Y;
        gsap.to(towerGroupRef.current.rotation, {
          y: targetAngle,
          duration: 0.85,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (
        activePhaseIndex === "all" &&
        !lockRotationYRef.current &&
        towerGroupRef.current &&
        !isMouseDownRef.current
      ) {
        // Returning to Hero ("all"): smoothly glide back to RESTING_ROT_Y via shortest angular path
        const TWO_PI = Math.PI * 2;
        const currentRotY = towerGroupRef.current.rotation.y;
        const normalizedCurrent = ((currentRotY % TWO_PI) + TWO_PI) % TWO_PI;
        let delta = RESTING_ROT_Y - normalizedCurrent;
        if (delta > Math.PI) delta -= TWO_PI;
        if (delta < -Math.PI) delta += TWO_PI;
        gsap.to(towerGroupRef.current.rotation, {
          y: currentRotY + delta,
          duration: 0.85,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            if (towerGroupRef.current) {
              towerGroupRef.current.rotation.y = RESTING_ROT_Y;
            }
          },
        });
      }
    }
  }, [activePhaseIndex, lockRotation, isLockY, spinOnPhase8]);

  // Handle Explode / Assembly Toggle
  useEffect(() => {
    if (isFirstExplodeMountRef.current) {
      isFirstExplodeMountRef.current = false;
      return;
    }
    const tierGroups = tierMeshesRef.current;
    const restingYPos = restingPositionsRef.current;
    if (tierGroups.length === 0) return;

    tierGroups.forEach((tg, idx) => {
      const restY = restingYPos[idx] || 0;
      const explodeOffset = (idx - 3.5) * 0.4;
      const targetY = isExploded ? restY + explodeOffset : restY;

      gsap.to(tg.position, {
        y: targetY,
        duration: 0.8,
        delay: idx * 0.03,
        ease: "power3.out",
      });
    });
  }, [isExploded]);

  // Mouse Move Parallax / Clamped Smooth Rotation & Raycast hover
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.set(x, y);

      // Rotation interaction: smooth pitch (X) and yaw (Y) with respective locking rules
      if (isMouseDownRef.current && towerGroupRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const targetY = lockRotationYRef.current
          ? dragStartRef.current.rotY
          : THREE.MathUtils.clamp(
              dragStartRef.current.rotY + deltaX * 0.005,
              MIN_ROT_Y,
              MAX_ROT_Y,
            );
        const targetX = lockRotationXRef.current
          ? THREE.MathUtils.clamp(
              dragStartRef.current.rotX + deltaY * 0.004,
              MIN_ROT_X,
              MAX_ROT_X,
            )
          : dragStartRef.current.rotX + deltaY * 0.006;

        gsap.to(towerGroupRef.current.rotation, {
          y: targetY,
          x: targetX,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (tiltGroupRef.current) {
        // Subtle hover parallax when not dragging
        const targetTiltX = lockRotationXRef.current ? 0 : -y * 0.08;
        const targetTiltY = lockRotationYRef.current ? 0 : x * 0.1;
        gsap.to(tiltGroupRef.current.rotation, {
          x: targetTiltX,
          y: targetTiltY,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Raycasting for tier hover (only when enablePhaseHover is explicitly enabled)
      if (
        enablePhaseHover &&
        cameraRef.current &&
        tierMeshesRef.current.length > 0
      ) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const meshes: THREE.Object3D[] = [];
        tierMeshesRef.current.forEach((g) => {
          g.children.forEach((c) => {
            if (c instanceof THREE.Mesh) meshes.push(c);
          });
        });

        const intersects = raycasterRef.current.intersectObjects(meshes, false);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const hitTierGroup = hitObj.parent as THREE.Group;
          if (hitTierGroup && hitTierGroup.userData.phaseData) {
            setHoveredPhase(hitTierGroup.userData.phaseData);
          }
        } else {
          setHoveredPhase(null);
        }
      } else if (!enablePhaseHover && hoveredPhase) {
        setHoveredPhase(null);
      }
    },
    [interactive, enablePhaseHover, hoveredPhase],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      isMouseDownRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        rotY: towerGroupRef.current?.rotation.y || RESTING_ROT_Y,
        rotX: towerGroupRef.current?.rotation.x || RESTING_ROT_X,
      };
    },
    [interactive],
  );

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
    setIsDragging(false);

    // Only ease back to architectural pose if snapBackOnRelease is explicitly enabled
    if (snapBackOnReleaseRef.current && towerGroupRef.current) {
      const activeAngle =
        typeof activePhaseIndex === "number"
          ? (PHASE_ANGLES[activePhaseIndex - 1] ?? RESTING_ROT_Y)
          : RESTING_ROT_Y;

      const targetProps: { y?: number; x?: number } = {};
      if (!lockRotationYRef.current) {
        targetProps.y = activeAngle;
      }
      if (lockRotationXRef.current) {
        targetProps.x = RESTING_ROT_X;
      }

      if (Object.keys(targetProps).length > 0) {
        gsap.to(towerGroupRef.current.rotation, {
          ...targetProps,
          duration: 1.0,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    if (snapBackOnReleaseRef.current && tiltGroupRef.current) {
      gsap.to(tiltGroupRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [activePhaseIndex]);

  const handleMouseLeave = useCallback(() => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    if (snapBackOnReleaseRef.current) {
      handleMouseUp();
    }
    if (tiltGroupRef.current) {
      gsap.to(tiltGroupRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    setHoveredPhase(null);
  }, [handleMouseUp]);

  // Touch support for mobile / tablets
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!interactive || e.touches.length === 0) return;
      isMouseDownRef.current = true;
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        rotY: towerGroupRef.current?.rotation.y || RESTING_ROT_Y,
        rotX: towerGroupRef.current?.rotation.x || RESTING_ROT_X,
      };
    },
    [interactive],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!interactive || !isMouseDownRef.current || e.touches.length === 0)
        return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      if (towerGroupRef.current) {
        const targetY = lockRotationYRef.current
          ? dragStartRef.current.rotY
          : THREE.MathUtils.clamp(
              dragStartRef.current.rotY + deltaX * 0.005,
              MIN_ROT_Y,
              MAX_ROT_Y,
            );
        const targetX = lockRotationXRef.current
          ? THREE.MathUtils.clamp(
              dragStartRef.current.rotX + deltaY * 0.004,
              MIN_ROT_X,
              MAX_ROT_X,
            )
          : dragStartRef.current.rotX + deltaY * 0.006;

        gsap.to(towerGroupRef.current.rotation, {
          y: targetY,
          x: targetX,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    [interactive],
  );

  // Click on tier to select phase (only if enabled)
  const handleClick = useCallback(() => {
    if (!enablePhaseClick) return;
    if (hoveredPhase) {
      setClickedPhase((prev) => {
        const current = prev ?? phase;
        return current === hoveredPhase.phase ? "all" : hoveredPhase.phase;
      });
    }
  }, [enablePhaseClick, hoveredPhase, phase]);

  // Current active phase information
  const currentActiveData =
    typeof activePhaseIndex === "number"
      ? CITADEL_PHASES[activePhaseIndex - 1]
      : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onClick={enablePhaseClick ? handleClick : undefined}
      className={`relative w-full ${heightClass} overflow-hidden flex flex-col items-center justify-center select-none group ${
        borderless
          ? "bg-transparent border-none rounded-none"
          : "rounded-md border border-white/10 bg-[#05070a]"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
      />

      {/* 2D Architectural Fallback if WebGL fails or context is lost */}
      {webGlFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070a] z-10 p-6 text-center">
          <CitadelMark className="w-16 h-20 text-brand mb-4 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-[2px] uppercase text-white/80">
            CITADEL ARCHITECTURAL VECTOR ENGINE
          </span>
          <span className="text-[10px] font-mono tracking-[1.5px] uppercase text-brand/80 mt-1">
            [ 2D ARCHITECTURAL FALLBACK ACTIVE ]
          </span>
        </div>
      )}

      {/* Blueprint Grid Overlay (shown only when not borderless) */}
      {!borderless && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Corner crosshairs (shown only when not borderless) */}
      {!borderless && (
        <>
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/40 pointer-events-none z-10" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/40 pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/40 pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/40 pointer-events-none z-10" />
        </>
      )}

      {/* Top Header HUD badge (shown only when labeled and not borderless) */}
      {!borderless && (
        <div className="absolute top-4 inset-x-6 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/70 font-mono">
              {label ||
                (currentActiveData
                  ? `PHASE ${currentActiveData.id} — ${currentActiveData.name}`
                  : "CITADEL 3D TOWER")}
            </span>
          </div>
          <span className="text-[10px] tracking-[1.5px] uppercase text-white/40 font-mono hidden sm:inline-block">
            [ 3D INTERACTIVE ]
          </span>
        </div>
      )}

      {/* Interactive Tooltip HUD when hovering over a tier (only if enabled) */}
      {enablePhaseHover && hoveredPhase && (
        <div className="absolute top-12 px-4 py-2 bg-surface-darker/90 backdrop-blur-md border border-brand/60 rounded-sm pointer-events-none shadow-xl transition-all duration-200 z-30 flex items-center gap-3 animate-in fade-in">
          <span className="text-xs font-bold font-mono text-brand">
            {hoveredPhase.id}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider uppercase text-white">
              {hoveredPhase.name}
            </span>
            <span className="text-[10px] text-white/60">
              {hoveredPhase.subtitle} • Click to isolate
            </span>
          </div>
        </div>
      )}

      {/* Bottom Controls / Phase Pills (shown when showControls is true, e.g. in Hero Showcase) */}
      {showControls && (
        <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-auto">
          {/* Phase Filter Buttons */}
          <div className="flex items-center gap-1 bg-surface-darker/80 backdrop-blur-md p-1 rounded-sm border border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setClickedPhase("all");
              }}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase transition-colors rounded-sm ${
                activePhaseIndex === "all"
                  ? "bg-white text-fg font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ALL
            </button>
            {CITADEL_PHASES.slice(0, 8).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setClickedPhase(p.phase);
                }}
                className={`px-2 py-1 text-[10px] font-mono transition-colors rounded-sm ${
                  activePhaseIndex === p.phase
                    ? "bg-brand text-fg font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>

          {/* Action buttons: Explode & Auto-rotate toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExploded((prev) => !prev);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase border rounded-sm transition-colors backdrop-blur-md ${
                isExploded
                  ? "bg-white/20 border-white text-white"
                  : "border-white/20 text-white/70 hover:border-white/40 bg-surface-darker/70"
              }`}
            >
              {isExploded ? "ASSEMBLE" : "EXPLODE"}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAutoRotate((prev) => !prev);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase border rounded-sm transition-colors backdrop-blur-md ${
                autoRotate
                  ? "border-brand/40 text-brand bg-surface-darker/70"
                  : "border-white/20 text-white/40 bg-surface-darker/70"
              }`}
            >
              {autoRotate ? "ROTATING" : "PAUSED"}
            </button>
          </div>
        </div>
      )}

      {/* Floating Instructions prompt on hover (hidden in borderless mode) */}
      {!borderless && (
        <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase tracking-[1.5px] text-white/30 pointer-events-none hidden sm:block z-10">
          {enablePhaseHover ? "Drag to rotate • Hover phase" : "Drag to rotate"}
        </div>
      )}
    </div>
  );
}
