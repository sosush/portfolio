import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Heart,
  ChevronDown,
  Sparkles,
  Terminal,
  ArrowRight,
  FileText,
  Award,
  X,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  BookOpen,
  Layout
} from 'lucide-react';

// Custom Brand Icons as Lucide removed them in recent versions
const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial, Torus, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SpaceBackground3D from './components/SpaceBackground3D';

// Custom Typing Animation Component
const TypingText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="text-[#ff71ce]">
      {texts[index].substring(0, subIndex)}
      <span className="inline-block w-[2px] h-[0.8em] bg-white ml-1 animate-[blink_1s_infinite]"></span>
    </span>
  );
};

const Section: React.FC<{ children: React.ReactNode; id?: string; className?: string }> = ({ children, id, className = "" }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    className={`min-h-screen flex flex-col justify-center py-20 px-6 md:px-20 ${className}`}
  >
    {children}
  </motion.section>
);

const ProjectVisual = ({ type, color }: { type: string; color: string }) => {
  return (
    <div className="w-full h-full bg-[#0a0a0c]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Scene type={type} color={color} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

const NetworkTruthVisual = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      meshRef.current.rotation.z += 0.0005;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        
        // Base flowing wave - more graphical/stepped
        const freq = 1.2;
        const waveX = Math.sin(x * freq + time * 0.8);
        const waveY = Math.cos(y * freq + time * 0.8);
        
        // Stepped wave effect for a digital look
        let z = (Math.round(waveX * 4) / 4) * (Math.round(waveY * 4) / 4) * 0.25;
        
        // Local inflations (breathing effect) - less frequent and smaller
        const inflationX = Math.sin(time * 0.2) * 2.5;
        const inflationY = Math.cos(time * 0.3) * 2.5;
        const dist = Math.sqrt(Math.pow(x - inflationX, 2) + Math.pow(y - inflationY, 2));
        if (dist < 1.2) {
          const stepDist = Math.floor((1.2 - dist) * 6) / 6;
          z += stepDist * (Math.sin(time * 1.2) * 0.5 + 0.5) * 0.7;
        }
        
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[12, 12, 60, 60]} />
      <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
    </mesh>
  );
};

const LearnBuddyVisual = ({ color }: { color: string }) => {
  const brainNodes = useMemo(() => Array.from({ length: 12 }, () => ({
    basePos: new THREE.Vector3(-2 + (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5),
    pos: new THREE.Vector3(),
    phase: Math.random() * Math.PI * 2
  })), []);

  const aiNodes = useMemo(() => Array.from({ length: 12 }, () => ({
    basePos: new THREE.Vector3(2 + (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5),
    pos: new THREE.Vector3(),
    phase: Math.random() * Math.PI * 2
  })), []);

  const sparks = useMemo(() => Array.from({ length: 2 }, () => ({
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    progress: Math.random(),
    speed: 0.004 + Math.random() * 0.004, // Slower: ~4-8 seconds per exchange
  })), []);

  const brainMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const aiMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sparkMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const brainLinesRef = useRef<THREE.Group>(null);
  const aiLinesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Move brain nodes
    brainNodes.forEach((node, i) => {
      node.pos.copy(node.basePos).add(new THREE.Vector3(
        Math.sin(time * 0.5 + node.phase) * 0.15,
        Math.cos(time * 0.4 + node.phase) * 0.15,
        Math.sin(time * 0.6 + node.phase) * 0.15
      ));
      if (brainMeshRefs.current[i]) {
        brainMeshRefs.current[i]!.position.copy(node.pos);
      }
    });

    // Move AI nodes
    aiNodes.forEach((node, i) => {
      node.pos.copy(node.basePos).add(new THREE.Vector3(
        Math.sin(time * 0.5 + node.phase) * 0.15,
        Math.cos(time * 0.4 + node.phase) * 0.15,
        Math.sin(time * 0.6 + node.phase) * 0.15
      ));
      if (aiMeshRefs.current[i]) {
        aiMeshRefs.current[i]!.position.copy(node.pos);
      }
    });

    // Update lines (simplified: just rotating the group slightly to feel dynamic)
    if (brainLinesRef.current) brainLinesRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    if (aiLinesRef.current) aiLinesRef.current.rotation.y = Math.cos(time * 0.2) * 0.05;

    // Update sparks
    sparks.forEach((spark, i) => {
      spark.progress += spark.speed;
      if (spark.progress >= 1) {
        spark.progress = 0;
        const fromBrain = Math.random() > 0.5;
        const startNodes = fromBrain ? brainNodes : aiNodes;
        const endNodes = fromBrain ? aiNodes : brainNodes;
        spark.start.copy(startNodes[Math.floor(Math.random() * startNodes.length)].pos);
        spark.end.copy(endNodes[Math.floor(Math.random() * endNodes.length)].pos);
      }
      
      const currentPos = new THREE.Vector3().lerpVectors(spark.start, spark.end, spark.progress);
      // Horizontal sparks - no arc
      
      if (sparkMeshRefs.current[i]) {
        sparkMeshRefs.current[i]!.position.copy(currentPos);
        sparkMeshRefs.current[i]!.scale.setScalar(Math.sin(spark.progress * Math.PI) * 1.5 + 0.5);
      }
    });
  });

  return (
    <group>
      {/* Human Brain Side */}
      <group>
        {brainNodes.map((node, i) => (
          <mesh key={`brain-${i}`} ref={el => brainMeshRefs.current[i] = el}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={2} />
          </mesh>
        ))}
        <group ref={brainLinesRef}>
          {brainNodes.map((node, i) => (
            i < brainNodes.length - 1 && (
              <line key={`brain-line-${i}`}>
                <bufferGeometry>
                  <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
                    node.basePos.x, node.basePos.y, node.basePos.z,
                    brainNodes[i+1].basePos.x, brainNodes[i+1].basePos.y, brainNodes[i+1].basePos.z
                  ]), 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#ff6b6b" transparent opacity={0.2} />
              </line>
            )
          ))}
        </group>
      </group>

      {/* AI Side */}
      <group>
        {aiNodes.map((node, i) => (
          <mesh key={`ai-${i}`} ref={el => aiMeshRefs.current[i] = el}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#4dabf7" emissive="#4dabf7" emissiveIntensity={2} />
          </mesh>
        ))}
        <group ref={aiLinesRef}>
          {aiNodes.map((node, i) => (
            i < aiNodes.length - 1 && (
              <line key={`ai-line-${i}`}>
                <bufferGeometry>
                  <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
                    node.basePos.x, node.basePos.y, node.basePos.z,
                    aiNodes[i+1].basePos.x, aiNodes[i+1].basePos.y, aiNodes[i+1].basePos.z
                  ]), 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#4dabf7" transparent opacity={0.2} />
              </line>
            )
          ))}
        </group>
      </group>

      {/* Sparks */}
      {sparks.map((_, i) => (
        <mesh key={`spark-${i}`} ref={el => sparkMeshRefs.current[i] = el}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
        </mesh>
      ))}
    </group>
  );
};

const PrismProtocolVisual = ({ color }: { color: string }) => {
  const scanRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.Group>(null);
  const outerMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const scanColor = "#ffffff"; // White
  const corneaColor = "#5d4037"; // Brownish
  
  const lines = useMemo(() => {
    const l = [];
    const count = 64; // Denser lines
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // Start from the edge of the inner sphere
      const start = new THREE.Vector3(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0.2);
      // End at the outer sphere
      const end = new THREE.Vector3(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0);
      l.push(start, end);
    }
    return l;
  }, []);

  useFrame((state) => {
    const scanY = Math.sin(state.clock.elapsedTime * 1.5) * 1.5;
    if (scanRef.current) {
      scanRef.current.position.y = scanY;
    }
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      eyeRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }

    // Shine green when scanner passes
    const distance = Math.abs(scanY);
    const shineIntensity = Math.max(0, 1 - distance * 1.2);
    
    if (outerMaterialRef.current) {
      outerMaterialRef.current.emissive.setRGB(0, shineIntensity * 0.8, 0);
      outerMaterialRef.current.emissiveIntensity = shineIntensity * 5;
    }
    if (innerMaterialRef.current) {
      innerMaterialRef.current.emissive.setRGB(0, shineIntensity, 0);
      innerMaterialRef.current.emissiveIntensity = shineIntensity * 8;
    }
  });

  return (
    <group>
      {/* Cornea Structure */}
      <group ref={eyeRef}>
        {/* Outer Brownish Sphere */}
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial 
            ref={outerMaterialRef}
            color={corneaColor} 
            transparent 
            opacity={0.3} 
            wireframe
            emissive={new THREE.Color(0, 0, 0)}
            emissiveIntensity={0}
          />
        </mesh>

        {/* Inner Black Sphere (Pupil/Iris area) */}
        <mesh position={[0, 0, 0.2]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            ref={innerMaterialRef}
            color="#000000" 
            emissive={new THREE.Color(0, 0, 0)}
            emissiveIntensity={0}
          />
        </mesh>

        {/* Connecting Lines */}
        <group>
          {Array.from({ length: 64 }).map((_, i) => (
            <line key={i}>
              <bufferGeometry>
                <float32BufferAttribute 
                  attach="attributes-position" 
                  args={[new Float32Array([
                    lines[i*2].x, lines[i*2].y, lines[i*2].z,
                    lines[i*2+1].x, lines[i*2+1].y, lines[i*2+1].z
                  ]), 3]} 
                />
              </bufferGeometry>
              <lineBasicMaterial color="#000000" transparent opacity={0.6} />
            </line>
          ))}
        </group>
      </group>
      
      {/* White Scanning Rays */}
      <group ref={scanRef}>
        <mesh>
          <planeGeometry args={[3.5, 0.1]} />
          <meshStandardMaterial 
            color={scanColor} 
            emissive={scanColor} 
            emissiveIntensity={6} 
            transparent 
            opacity={1} 
          />
        </mesh>
        {/* Dense white rays/glow effect */}
        <mesh scale={[1, 25, 1]}>
          <planeGeometry args={[3.5, 0.05]} />
          <meshStandardMaterial 
            color={scanColor} 
            transparent 
            opacity={0.25} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh scale={[1, 8, 1]} position={[0, 0, 0.01]}>
          <planeGeometry args={[3.5, 0.05]} />
          <meshStandardMaterial 
            color={scanColor} 
            transparent 
            opacity={0.4} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

const CybersecurityVisual = ({ color }: { color: string }) => {
  const netRef = useRef<THREE.Mesh>(null);
  const hitColorRef = useRef(new THREE.Color(color));
  
  const balls = useMemo(() => Array.from({ length: 20 }, () => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 4 + Math.random() * 4),
    vel: new THREE.Vector3(0, 0, -0.02 - Math.random() * 0.03),
    col: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
    mesh: null as THREE.Mesh | null
  })), [color]);

  useFrame(() => {
    balls.forEach((ball) => {
      ball.pos.add(ball.vel);
      
      if (ball.pos.z <= 0 && ball.vel.z < 0) {
        ball.vel.z *= -1;
        hitColorRef.current.copy(ball.col);
        setTimeout(() => hitColorRef.current.set(color), 200);
      }
      
      if (ball.pos.z > 8) {
        ball.pos.z = 8;
        ball.vel.z *= -1;
      }

      if (ball.mesh) {
        ball.mesh.position.copy(ball.pos);
      }
    });
    
    if (netRef.current) {
      (netRef.current.material as THREE.MeshStandardMaterial).color.lerp(hitColorRef.current, 0.1);
    }
  });

  return (
    <group>
      <mesh ref={netRef}>
        <planeGeometry args={[6, 6, 30, 30]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {balls.map((ball, i) => (
        <mesh key={i} ref={(el) => (ball.mesh = el)}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={ball.col} emissive={ball.col} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ type, color }: { type: string; color: string }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  if (type === 'Spark') {
    return (
      <group ref={meshRef}>
        <Stars radius={5} depth={2} count={200} factor={2} saturation={0} fade speed={1} />
        {/* Network of nodes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = Math.sin(i * 1.5) * 1.5;
          const y = Math.cos(i * 1.2) * 1.5;
          const z = Math.sin(i * 0.8) * 1.5;
          return (
            <group key={i} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
              </mesh>
              {/* Connect to some other nodes */}
              {i > 0 && i % 2 === 0 && (
                <line>
                  <bufferGeometry attach="geometry">
                    <float32BufferAttribute
                      attach="attributes-position"
                      args={[new Float32Array([0, 0, 0, -x * 0.5, -y * 0.5, -z * 0.5]), 3]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial attach="material" color={color} transparent opacity={0.4} />
                </line>
              )}
            </group>
          );
        })}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial color={color} speed={3} distort={0.5} radius={1} />
        </mesh>
      </group>
    );
  }

  if (type === 'Orbital') {
    return (
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#1a1a1a" wireframe />
        </mesh>
        {Array.from({ length: 3 }).map((_, i) => (
          <group key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <mesh>
              <torusGeometry args={[2 + i * 0.2, 0.01, 16, 100]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
              <mesh position={[2 + i * 0.2, 0, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
              </mesh>
            </Float>
          </group>
        ))}
      </group>
    );
  }

  if (type === 'Genesis') {
    return (
      <group ref={meshRef}>
        {Array.from({ length: 30 }).map((_, i) => (
          <group key={i} position={[0, (i - 15) * 0.2, 0]} rotation={[0, i * 0.4, 0]}>
            <mesh position={[0.8, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.8, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === 'Prism Protocol') {
    return <PrismProtocolVisual color={color} />;
  }

  if (type === 'Intrusion Detection System') {
    return (
      <group ref={meshRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh>
            <cylinderGeometry args={[1, 1, 0.2, 5]} />
            <meshStandardMaterial color={color} wireframe />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.8, 0.8, 0.1, 5]} />
            <MeshDistortMaterial color={color} speed={2} distort={0.2} />
          </mesh>
        </Float>
        <gridHelper args={[10, 10, color, "#222"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]} />
      </group>
    );
  }

  if (type === 'LearnBuddy') {
    return <LearnBuddyVisual color={color} />;
  }

  if (type === 'Dynamic Adaptation in Cybersecurity') {
    return <CybersecurityVisual color={color} />;
  }

  if (type === "Finding the 'Truth' in Network Traffic") {
    return <NetworkTruthVisual color={color} />;
  }

  return null;
};

const ProjectCard: React.FC<{ 
  title: string; 
  desc: string; 
  tags: string[]; 
  color: string;
  type: string;
  onKnowMore: () => void;
}> = ({ title, desc, tags, color, type, onKnowMore }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="group relative bg-[#151518] border border-[#ffffff11] p-8 rounded-3xl overflow-hidden cursor-pointer"
    onClick={onKnowMore}
  >
    <div 
      className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
      style={{ backgroundColor: color }}
    />
    <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-[#0a0a0c] border border-[#ffffff05]">
      <ProjectVisual type={title} color={color} />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded bg-[#ffffff05] text-gray-400 border border-[#ffffff11]">
        {type === 'personal' ? 'Personal' : type === 'team' ? 'Team' : 'Research'} Project
      </span>
      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
    </div>
    <h3 className="text-2xl font-bold mb-4 font-display" style={{ color }}>{title}</h3>
    <p className="text-gray-400 mb-6 leading-relaxed line-clamp-2">{desc}</p>
    <div className="flex flex-wrap gap-2 mb-8">
      {tags.map(tag => (
        <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#ffffff05] border border-[#ffffff11]">
          {tag}
        </span>
      ))}
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onKnowMore();
      }}
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#ff71ce] transition-colors group/btn"
    >
      Know More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

const ConstellationCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef<{ x: number; y: number; vx: number; vy: number; size: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initPoints = () => {
      points.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      points.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Attraction to mouse
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * 0.0001;
          p.vy += dy * 0.0001;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        // Connect points
        for (let j = i + 1; j < points.current.length; j++) {
          const p2 = points.current[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist2 / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = `rgba(255, 113, 206, ${0.4 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    initPoints();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const CustomLogo = () => (
  <motion.div 
    whileHover={{ scale: 1.1 }}
    className="relative flex items-center justify-center group"
  >
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Black Circle Background */}
      <div className="absolute inset-0 bg-black rounded-full border border-[#ffffff11] shadow-[0_0_15px_rgba(255,113,206,0.2)]" />
      
      <div className="relative z-10 flex items-center justify-center gap-0.5 px-2">
        <span className="text-[#01cdfe] font-mono text-lg font-bold">&lt;</span>
        <svg viewBox="0 0 100 100" className="w-6 h-6">
          {/* Heart Constellation - More elegant symmetric shape */}
          <motion.path
            d="M50,85 L48,83 C20,60 5,45 5,28 C5,15 15,5 28,5 C35,5 42,8 47,14 L50,17 L53,14 C58,8 65,5 72,5 C85,5 95,15 95,28 C95,45 80,60 52,83 L50,85 Z"
            fill="none"
            stroke="#ff71ce"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Stars at key vertices of the heart */}
          {[
            { x: 50, y: 85 }, { x: 28, y: 65 }, { x: 10, y: 40 }, 
            { x: 15, y: 15 }, { x: 28, y: 5 }, { x: 40, y: 10 }, { x: 50, y: 17 },
            { x: 60, y: 10 }, { x: 72, y: 5 }, { x: 85, y: 15 }, { x: 90, y: 40 },
            { x: 72, y: 65 }
          ].map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="white"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </svg>
        <span className="text-[#01cdfe] font-mono text-lg font-bold">/&gt;</span>
      </div>
    </div>
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
      <span className="text-[6px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity tracking-tighter">SOSUSH...</span>
    </div>
  </motion.div>
);

const CodeEditorVisual = () => {
  const [lines, setLines] = useState<string[]>(Array(10).fill(''));
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const codeLines = [
    'const brain = new NeuralNetwork();',
    'brain.learn(digital_dreams);',
    'await brain.evolve();',
    'if (dream.isPossible()) {',
    '  reality.update(dream);',
    '}',
    'const studio = new CreativeStudio();',
    'studio.addLayer(magic);',
    'studio.render();',
    'console.log("Dream deployed.");',
    '// Keep pushing boundaries',
    'export default brain;'
  ];

  useEffect(() => {
    const currentFullLine = codeLines[currentLineIndex % codeLines.length];
    const currentTypedText = lines[currentLineIndex % 10];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentTypedText.length < currentFullLine.length) {
          const newLines = [...lines];
          newLines[currentLineIndex % 10] = currentFullLine.slice(0, currentTypedText.length + 1);
          setLines(newLines);
        } else {
          if (currentLineIndex % 10 === 9) {
            setTimeout(() => setIsDeleting(true), 2000);
          } else {
            setCurrentLineIndex(prev => prev + 1);
          }
        }
      } else {
        if (currentTypedText.length > 0) {
          const newLines = [...lines];
          newLines[currentLineIndex % 10] = currentTypedText.slice(0, -1);
          setLines(newLines);
        } else {
          if (currentLineIndex % 10 === 0) {
            setIsDeleting(false);
            setCurrentLineIndex(prev => prev + 1);
          } else {
            setCurrentLineIndex(prev => prev - 1);
          }
        }
      }
    }, isDeleting ? 20 : 50);

    return () => clearTimeout(timeout);
  }, [lines, currentLineIndex, isDeleting]);

  return (
    <div className="w-full h-full bg-[#0a0a0c] p-6 font-mono text-[10px] md:text-xs relative overflow-hidden">
      <div className="flex gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div className="space-y-1.5">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-gray-800 w-4 text-right select-none">{i + 1}</span>
            <span className={i % 2 === 0 ? "text-[#ff71ce]" : "text-[#01cdfe]"}>
              {line}
              {i === currentLineIndex % 10 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1.5 h-3 bg-white ml-1 align-middle"
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GeometricDecoration = ({ color }: { color: string }) => {
  return (
    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[2, 2, 0]}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color={color} wireframe />
          </mesh>
        </Float>
        <Float speed={3} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[-3, -1, -2]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={color} wireframe />
          </mesh>
        </Float>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, -3, 1]}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
};

const ProjectDetail: React.FC<{ project: any; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="fixed inset-0 z-[200] bg-[#0a0a0c] overflow-y-auto"
    >
      <GeometricDecoration color={project.color} />
      
      {/* Random Background Visuals */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              rotate: [0, 360]
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 blur-[120px] rounded-full"
            style={{ 
              backgroundColor: project.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="min-h-screen p-6 md:p-20 relative z-10">
        <button 
          onClick={onClose}
          className="fixed top-10 right-10 z-[210] p-4 rounded-full bg-[#151518] border border-[#ffffff11] hover:bg-[#ff71ce] hover:text-black transition-all group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full bg-[#ffffff05] text-gray-400 border border-[#ffffff11]">
                {project.type === 'personal' ? 'Personal Study' : project.type === 'team' ? 'Collaborative Project' : 'Ongoing Research'}
              </span>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-[#ffffff11] to-transparent" />
            </div>
            <h2 className="text-6xl md:text-9xl font-black font-display mb-8 tracking-tighter leading-none" style={{ color: project.color }}>
              {project.title}
            </h2>

            {/* Tech Stack and Links - Moved above visual */}
            <div className="mb-12 p-8 rounded-[2.5rem] bg-[#151518] border border-[#ffffff11] flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="flex-1">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] opacity-50">Core Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-[#ffffff05] text-[10px] text-gray-500 border border-[#ffffff05] font-bold uppercase tracking-tighter">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {project.link && project.link !== "#" && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl"
                  >
                    <GithubIcon size={18} /> Repository
                  </a>
                )}
                {project.website && (
                  <a 
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border border-[#ffffff11] hover:bg-[#ffffff05] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-3 transition-colors"
                  >
                    <ExternalLink size={18} /> View Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div className="aspect-video rounded-[3rem] bg-[#151518] border border-[#ffffff11] overflow-hidden shadow-2xl relative group">
              <ProjectVisual type={project.title} color={project.color} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-sm font-mono text-gray-300">Interactive 3D Visualization of {project.title} core concepts.</p>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-16 text-gray-400 text-lg leading-relaxed">
                <section>
                  <h4 className="text-white font-display text-2xl mb-6 italic flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-white/20" /> Why this idea?
                  </h4>
                  <p className="border-l-2 border-[#ffffff11] pl-6 py-2 text-xl">{project.motivation}</p>
                </section>

                <section>
                  <h4 className="text-white font-display text-2xl mb-6">Overview</h4>
                  <p>{project.overview}</p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="p-8 rounded-3xl bg-[#ffffff03] border border-[#ffffff05] hover:border-[#ffffff11] transition-colors">
                    <h4 className="text-white font-display text-xl mb-4 flex items-center gap-2">
                      <Cpu size={20} className="text-gray-500" /> How it was assembled
                    </h4>
                    <p className="text-sm leading-relaxed">{project.assembly}</p>
                  </section>

                  <section className="p-8 rounded-3xl bg-[#ffffff03] border border-[#ffffff05] hover:border-[#ffffff11] transition-colors">
                    <h4 className="text-white font-display text-xl mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-gray-500" /> Keynote Features
                    </h4>
                    <p className="text-sm leading-relaxed">{project.features}</p>
                  </section>
                </div>

                <section className="p-8 rounded-3xl bg-[#ffffff03] border border-[#ffffff05] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  <h4 className="text-white font-display text-xl mb-6 flex items-center gap-2">
                    <Sparkles size={20} className="text-gray-500" /> Future Improvements
                  </h4>
                  <p className="text-sm leading-relaxed">{project.improvements}</p>
                </section>

                <div className="flex items-center gap-8 p-8 rounded-3xl border border-dashed border-[#ffffff11]">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Heart size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm italic">
                    These projects are being continuously improved. If you have any suggestions for the same, please feel free to reach out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ResearchSection = ({ onKnowMore }: { onKnowMore: (r: any) => void }) => {
  const researches = [
    {
      title: "Dynamic Adaptation in Cybersecurity",
      desc: "An exploration into self-supervised learning for resilient security models.",
      tags: ["Self-Supervised Learning", "Cybersecurity", "Zero-Day Defense"],
      motivation: "Most security models are 'static'—they only know what they were trained on. When a brand new attack (Zero-Day) appears, they often fail.",
      overview: "What if the model could 'adapt' its own brain in milliseconds while it's actually working?",
      assembly: "I'm exploring a way for models to solve a self-supervised 'puzzle' (like guessing missing parts of a network packet) to help them align with new traffic patterns on the fly.",
      features: "Solving the 'Static Defense Fallacy' where models fail against evolving threats.",
      improvements: "Future work involves exploring multi-agent adaptation and more complex self-supervised tasks for deeper alignment.",
      color: "#ff71ce",
      type: "research",
      link: "#"
    },
    {
      title: "Finding the 'Truth' in Network Traffic",
      desc: "Using causal reasoning to build robust, cross-domain security models.",
      tags: ["Causal Reasoning", "Network Traffic", "Robustness"],
      motivation: "AI models often get distracted by 'spurious correlations'—things that look like a pattern but aren't (like traffic volume).",
      overview: "Focus only on the 'invariant' features—the physical constraints of an attack that can't be easily changed (like the specific timing of a TCP handshake).",
      assembly: "Using causal reasoning to separate these core physical truths from the noisy environment, making security models much more robust across different networks.",
      features: "Building models that work across different networks (cross-domain) without needing constant retraining.",
      improvements: "Exploring causal discovery algorithms to automatically identify invariant features in diverse network environments.",
      color: "#01cdfe",
      type: "research",
      link: "#"
    }
  ];

  return (
    <Section id="research">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">
          Current <span className="text-[#ff71ce]">Researches</span> & Explorations
        </h2>
        <p className="text-gray-500 mt-4">Diving deep into the mechanics of security and causal reasoning.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {researches.map((r, i) => (
          <ProjectCard 
            key={i}
            title={r.title} 
            desc={r.desc} 
            tags={r.tags}
            color={r.color}
            type={r.type}
            onKnowMore={() => onKnowMore(r)}
          />
        ))}
      </div>
    </Section>
  );
};

export default function App() {
  const [isBgMoving, setIsBgMoving] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  const projects = [
    { 
      title: "Spark", 
      type: "personal",
      desc: "An exploration into neural brainstorming and spatial data architectures.", 
      motivation: "I was fascinated by how our brains connect disparate ideas. I wanted to see if I could create a digital space that mirrors that 'spark' of inspiration.",
      overview: "A 3D workspace where your GitHub projects aren't just a list, but a constellation of ideas you can explore and expand upon using AI.",
      assembly: "I used Three.js for the 3D environment and React for the interface. The hardest part was getting the AI (Llama) to understand the context of a whole codebase and suggest meaningful next steps.",
      features: "Interactive 3D project maps, AI-powered roadmap generation, and a 'brainstorming' mode that helps you link different technologies.",
      improvements: "I'd love to add real-time collaboration so teams can brainstorm together in the same 3D space, and maybe integrate more data sources like Jira or Notion.",
      tags: ['TypeScript', 'React', 'Three.js', 'Llama 3.3', 'Groq API'],
      color: "#a100ff",
      link: "https://github.com/sosush/Spark",
      website: "https://spark-constellation.vercel.app/"
    },
    { 
      title: "Orbital", 
      type: "team",
      desc: "A real-time visualization of Earth's artificial satellite network.", 
      motivation: "Space is getting crowded, and I wanted to visualize the 'invisible' network of satellites that we rely on every day.",
      overview: "A real-time tracker that shows you exactly where satellites are orbiting Earth right now.",
      assembly: "We pulled data from CelesTrak and used complex math (SGP4) to calculate their positions. We used Three.js to render the Earth and the satellite paths.",
      features: "Real-time tracking of thousands of satellites, 3D Earth visualization, and the ability to filter by satellite type (like Starlink or GPS).",
      improvements: "Adding historical data to see how the number of satellites has grown over time, and maybe a 'collision risk' predictor to show where space debris is most dangerous.",
      tags: ['React', 'Three.js', 'CelesTrak API', 'GLSL'],
      color: "#01cdfe",
      link: "https://github.com/sosush/Orbital",
      website: "https://orbital-brown.vercel.app/"
    },
    { 
      title: "Genesis", 
      type: "personal",
      desc: "Investigating algorithmic evolution through Genetic Programming.", 
      motivation: "I wondered if we could use the same principles of evolution that created us to create better code.",
      overview: "A sandbox where algorithms 'evolve' over time to solve clinical data processing tasks more efficiently.",
      assembly: "I built an evolutionary engine in Python. It creates a population of algorithms, tests them, and lets the best ones 'breed' to create the next generation.",
      features: "Automated algorithm discovery, visual tracking of the evolutionary process, and a focus on clinical data accuracy.",
      improvements: "I want to make the evolutionary process faster by using GPU acceleration and explore more complex 'mutations' that could lead to even more creative solutions.",
      tags: ['Python', 'Genetic Algorithms', 'Machine Learning', 'Clinical Data'],
      color: "#05ffa1",
      link: "https://github.com/sosush/Genesis"
    },
    { 
      title: "Prism Protocol", 
      type: "team",
      desc: "Exploring biometric verification through corneal light transport.", 
      motivation: "Deepfakes are becoming a real problem. I wanted to find a way to prove someone is human using something that's hard to fake: the way light enters their eyes.",
      overview: "A biometric system that uses the unique reflections in your eyes to verify you're a real person without storing your private data.",
      assembly: "We used computer vision to track eye reflections and zero-knowledge proofs (ZKPs) to keep everything private. It was a big challenge to get the light physics right.",
      features: "Secure 'Proof of Humanity,' privacy-first biometric verification, and integration with blockchain for decentralized identity.",
      improvements: "Making it work across more types of cameras (like low-res webcams) and reducing the time it takes to generate the privacy proofs.",
      tags: ['Computer Vision', 'ZK-ML', 'Blockchain', 'Spring Boot'],
      color: "#00ffcc",
      link: "https://github.com/sosush/Prism-all"
    },
    { 
      title: "Intrusion Detection System", 
      type: "personal",
      desc: "A study in pattern recognition for network intrusion detection.", 
      motivation: "After my own network was targeted, I realized that static firewalls aren't enough. I wanted to build something that could 'learn' what an attack looks like.",
      overview: "An intelligent sentinel that monitors network traffic and uses machine learning to spot suspicious patterns before they cause damage.",
      assembly: "I used Python and Scikit-learn to train models on huge datasets of network traffic. I had to learn a lot about different types of cyberattacks to make it effective.",
      features: "Real-time threat detection, classification of attack types (like DDoS or Brute Force), and a simple dashboard to see your network's health.",
      improvements: "I'm looking into 'Test-Time Adaptation' (like in my research) so the system can learn from new attacks it sees in real-time without needing to be retrained from scratch.",
      tags: ['Python', 'Scikit-learn', 'Flask', 'Cybersecurity', 'Machine Learning'],
      color: "#ff4d4d",
      link: "https://github.com/sosush/ML-IDS"
    },
    { 
      title: "LearnBuddy", 
      type: "team",
      desc: "Investigating adaptive learning interfaces and cognitive load.", 
      motivation: "Learning something new can be overwhelming. We wanted to build a companion that helps you navigate that 'ocean of knowledge' without getting lost.",
      overview: "An AI tutor that adapts to your learning style, breaking down complex topics into bite-sized, understandable pieces.",
      assembly: "We used Large Language Models and a technique called RAG to make sure the AI gives accurate, context-aware answers. We built the interface to be as simple and focused as possible.",
      features: "Personalized learning paths, AI-powered explanations, and a focus on reducing 'cognitive load' for the student.",
      improvements: "Adding a 'study group' feature where the AI can facilitate discussions between students, and maybe integrating more interactive quizzes and exercises.",
      tags: ['React', 'Node.js', 'OpenAI API', 'RAG'],
      color: "#8a2be2",
      link: "https://github.com/sosush/learn_buddy",
      website: "https://learn-buddy.netlify.app/"
    }
  ];

  const certificates = [
    { title: "Research Internship", issuer: "VIT Chennai (SRIP 2025)", link: "/certificates/reserach-internship.pdf" },
    { title: "Web Developer at Startup", issuer: "Hackfinity", link: "/certificates/web_developer_hackfinity.pdf" }
  ];

  return (
    <div className="relative selection:bg-[#ff71ce] selection:text-black">
      <SpaceBackground3D moving={isBgMoving} />
      
      {/* ADHD Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <button
          onClick={() => setIsBgMoving(!isBgMoving)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
        >
          <Zap className={`w-3 h-3 ${isBgMoving ? 'text-cyan-400' : 'text-gray-500'}`} />
          {isBgMoving ? "Motion On" : "Motion Off"}
        </button>
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
          Click to {isBgMoving ? 'disable' : 'enable'} background response to cursor
        </div>
      </div>
      
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <CustomLogo />
          <span className="text-xl font-black tracking-tighter uppercase">sosush.</span>
        </motion.div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
          {['About', 'Work', 'Skills', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#ff71ce] transition-colors">
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="relative text-center items-center">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-[#ff71ce11] border border-[#ff71ce33] text-[#ff71ce] text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={12} className="inline mr-2" /> Welcome to my Tech Space
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 font-display">
            I BUILD <br />
            <TypingText texts={['INTELLIGENCE', 'GRACEFULNESS', 'SECURITY', 'MY IMAGINATIONS']} />
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Just a coder exploring the intersection of 
            <span className="text-white"> artificial intelligence </span> 
            and <span className="text-white"> human-centric design</span>.
          </p>
          <div className="flex flex-col items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#ff71ce] text-black font-bold rounded-2xl shadow-[0_0_40px_rgba(255,113,206,0.4)]"
            >
              <a href="#work">Explore My Work</a>
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <ChevronDown />
        </motion.div>
      </Section>

      {/* About Section */}
      <Section id="about">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="aspect-video rounded-[2rem] bg-[#0a0a0c] border border-[#ffffff11] overflow-hidden shadow-2xl">
              <CodeEditorVisual />
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 bg-[#151518] border border-[#ffffff11] rounded-2xl">
              <Zap className="text-[#fffb96]" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 font-display uppercase tracking-tighter">
              The Mind Behind <br /> The <span className="text-[#01cdfe]">Terminal</span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
              <p>
                I'm <span className="text-white font-bold">Sohini</span>, a developer who lives at the edge of what's possible. 
                My work is a blend of technical precision and artistic intuition.
              </p>
              <p>
                I specialize in building systems that don't just work—they feel alive. 
                From neural-inspired interfaces to complex backend architectures, 
                I'm always pushing the boundaries of the digital canvas.
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              <motion.a
                href="/Sohini_Banerjee_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="flex items-center gap-3 px-6 py-4 bg-[#151518] border border-[#ffffff11] rounded-2xl hover:border-[#ff71ce33] transition-colors group"
              >
                <FileText size={20} className="text-[#ff71ce]" />
                <span className="font-bold uppercase text-xs tracking-widest">View Resume</span>
                <span className="text-gray-600 group-hover:text-white" aria-hidden="true">
                  <ExternalLink size={14} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </Section>

      {/* Work Section */}
      <Section id="work">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">
            Selected <span className="text-[#05ffa1]">Artifacts</span>
          </h2>
          <p className="text-gray-500 mt-4">A collection of things I've built with love and logic.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <ProjectCard 
              key={i}
              title={p.title} 
              desc={p.desc} 
              tags={p.tags}
              color={p.color}
              type={p.type}
              onKnowMore={() => setSelectedProject(p)}
            />
          ))}
        </div>
      </Section>

      {/* Research Section */}
      <ResearchSection onKnowMore={(r) => setSelectedProject(r)} />

      {/* Certificates Section */}
      <Section id="certificates" className="!min-h-0 !justify-start !py-16">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter mb-12">
            Milestones & <span className="text-[#b967ff]">Certifications</span>
          </h2>
          <div className="space-y-4">
            {certificates.map((cert, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-6 bg-[#151518] border border-[#ffffff11] rounded-2xl group hover:border-[#b967ff33] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-xl bg-[#b967ff11] text-[#b967ff]">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{cert.title}</h4>
                    <p className="text-sm text-gray-500">{cert.issuer}</p>
                  </div>
                </div>
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-[#ffffff05] hover:bg-[#b967ff] hover:text-black transition-all"
                >
                  <ExternalLink size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skills & Terminal Section */}
      <Section id="skills" className="!min-h-0 !justify-start !py-16">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-12">
              My <span className="text-[#fffb96]">Power-ups</span>
            </h2>
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-[#ff71ce11] text-[#ff71ce]">
                    <Code2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Frontend Sorcery</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'Framer Motion', 'Three.js', 'D3.js', 'GSAP'].map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-[#151518] border border-[#ffffff11] text-sm text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-[#01cdfe11] text-[#01cdfe]">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Backend Alchemy</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Node.js', 'Express', 'Supabase', 'Vercel', 'LangChain', 'PyTorch', 'PostgreSQL', 'FastAPI', 'Flask', 'Docker'].map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-[#151518] border border-[#ffffff11] text-sm text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#151518] rounded-3xl p-12 border border-[#ffffff11] flex flex-col justify-center">
            <Terminal className="text-[#05ffa1] mb-6" size={32} />
            <div className="font-mono text-sm space-y-4">
              <p className="text-gray-500"># Current status</p>
              <p className="text-[#05ffa1]">$ sosush --status</p>
              <p className="text-white">{" >> "} Trying to take AI's job</p>
              <p className="text-white">{" >> "} Laughing at bad 404 jokes</p>
              <p className="text-white">{" >> "} High on caffeine</p>
              <div className="pt-8">
                <p className="text-gray-500"># Connect</p>
                <p className="text-[#ff71ce]">$ sosush --socials</p>
                <div className="flex gap-4 mt-4">
                  <a href="https://github.com/sosush" className="p-2 rounded-lg bg-[#ffffff05] hover:text-[#01cdfe] transition-colors"><GithubIcon size={20} /></a>
                  <a href="https://linkedin.com/in/sohini-banerjee-12882731b" className="p-2 rounded-lg bg-[#ffffff05] hover:text-[#05ffa1] transition-colors"><LinkedinIcon size={20} /></a>
                  <a href="https://leetcode.com/u/sb_1315/" className="p-2 rounded-lg bg-[#ffffff05] hover:text-[#fffb96] transition-colors"><Code2 size={20} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-40 px-6 md:px-20 border-t border-[#ffffff05] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff71ce] opacity-5 blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#01cdfe] opacity-5 blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-8">
              LET'S <span className="text-[#ff71ce]">CHAT</span>.
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Have a project in mind or just want to talk about AI? 
              I'm always down for a cup of coffee with a good conversation.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <motion.a
              href="mailto:sohinibanerjee1315@gmail.com"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#ff71ce] text-black font-bold rounded-xl shadow-lg flex items-center gap-3 transition-all"
            >
              <Mail size={20} /> SAY HELLO
            </motion.a>
            <div className="flex gap-4">
              <a href="https://github.com/sosush" className="p-4 rounded-xl bg-[#151518] border border-[#ffffff11] hover:text-[#01cdfe] transition-colors"><GithubIcon size={20} /></a>
              <a href="https://www.linkedin.com/in/sohini-banerjee-12882731b/" className="p-4 rounded-xl bg-[#151518] border border-[#ffffff11] hover:text-[#05ffa1] transition-colors"><LinkedinIcon size={20} /></a>
            </div>
          </div>
        </div>


      </footer>
    </div>
  );
}
