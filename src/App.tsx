import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { blogPosts, type BlogPost } from './lib/posts';
import { MarkdownContent } from './components/MarkdownContent';
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
  Layout,
  Briefcase
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

const TwitterXIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BlueskyIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  amount?: number;
}> = ({ children, className = "", direction = 'up', delay = 0, duration = 0.8, amount = 0.2 }) => {
  const isMobile = useIsMobile();
  const initialX = direction === 'left' ? 48 : direction === 'right' ? -48 : 0;
  const initialY = direction === 'up' ? 48 : direction === 'down' ? -48 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : initialX, y: isMobile ? 24 : initialY, scale: isMobile ? 1 : 0.98 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: false, amount: isMobile ? 0.02 : amount }}
      transition={{ duration: isMobile ? 0.5 : duration, ease: [0.22, 1, 0.36, 1], delay: isMobile ? delay * 0.5 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Section: React.FC<{ children: React.ReactNode; id?: string; className?: string }> = ({ children, id, className = "" }) => {
  const isMobile = useIsMobile();
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: isMobile ? 30 : 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: isMobile ? 0.01 : 0.2, margin: isMobile ? "0px" : "-80px" }}
      transition={{ duration: isMobile ? 0.6 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen flex flex-col justify-center py-24 px-6 md:px-24 lg:px-32 max-w-screen-2xl mx-auto w-full ${className}`}
    >
      {children}
    </motion.section>
  );
};

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

  if (type === 'Spark' || type === 'Circuit Atlas (Ongoing)' || type === 'Circuit Atlas') {
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

  if (type === 'QuantLedger') {
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

  if (type === 'Prism' || type === 'Prism Protocol') {
    return <PrismProtocolVisual color={color} />;
  }

  if (type === 'NetSentinel' || type === 'Intrusion Detection System') {
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

  if (type === 'DISENT-KWS' || type === 'LearnBuddy') {
    return <LearnBuddyVisual color={color} />;
  }

  if (type === 'REFLEX' || type === 'Dynamic Adaptation in Cybersecurity') {
    return <CybersecurityVisual color={color} />;
  }

  if (type === 'PI-IDS' || type === 'PI-IDS (Protocol-Invariant Intrusion Detection)' || type === "Finding the 'Truth' in Network Traffic") {
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
    whileHover={{ y: -6, scale: 1.01 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.16] p-6 rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300"
    onClick={onKnowMore}
  >
    {/* Subtle accent glow on hover */}
    <div 
      className="absolute -top-12 -right-12 w-40 h-40 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"
      style={{ backgroundColor: color }}
    />
    {/* 3D Canvas Preview */}
    <div className="aspect-video mb-5 rounded-xl overflow-hidden bg-[#080809] border border-white/[0.05]">
      <ProjectVisual type={title} color={color} />
    </div>
    {/* Type Badge */}
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-500">
        {type === 'personal' ? 'Personal' : type === 'team' ? 'Team' : 'Research'}
      </span>
      <div className="w-1 h-1 rounded-full opacity-60" style={{ backgroundColor: color }} />
    </div>
    <h3 className="text-xl font-bold mb-2 font-display text-white group-hover:text-[#f1f1f1] transition-colors" style={{ color }}>{title}</h3>
    <p className="text-gray-500 mb-5 leading-relaxed text-sm line-clamp-2">{desc}</p>
    <div className="flex flex-wrap gap-1.5 mb-6">
      {tags.slice(0, 4).map(tag => (
        <span key={tag} className="text-[9px] tracking-wide font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-gray-500">
          {tag}
        </span>
      ))}
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onKnowMore();
      }}
      className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors group/btn"
    >
      View details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

// Comet cursor: a soft glowing head that eases toward the pointer, leaving a
// short trail of fading sparks behind it, with a light aura burst on click.
const CometCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only take over the cursor on real desktop viewports with a mouse.
    // Touch devices, and narrow/mobile-width viewports (even ones that
    // technically report a fine pointer, e.g. some devtools emulation),
    // keep their native cursor/tap behavior untouched.
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!pointerFine) return;

    const MOBILE_BREAKPOINT = 768;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = ['#ff71ce', '#01cdfe', '#b967ff'];
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let active = window.innerWidth >= MOBILE_BREAKPOINT;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-check on every resize so shrinking the window down to a mobile
      // width (or rotating a device) turns the effect off immediately.
      active = window.innerWidth >= MOBILE_BREAKPOINT;
      if (!active) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    resize();

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const head = { x: target.x, y: target.y };
    let lastTrailX = head.x;
    let lastTrailY = head.y;
    let visible = false;

    type Spark = { x: number; y: number; age: number; maxAge: number; size: number; color: string };
    type Burst = { x: number; y: number; age: number; maxAge: number; color: string };
    let sparks: Spark[] = [];
    let bursts: Burst[] = [];

    const handleMove = (e: MouseEvent) => {
      if (!active) return;
      target.x = e.clientX;
      target.y = e.clientY;
      visible = true;
    };
    const handleLeave = () => { visible = false; };
    const handleClick = (e: MouseEvent) => {
      if (!active) return;
      bursts.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 46, color: pick() });
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleClick);
    document.addEventListener('mouseleave', handleLeave);

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!active) {
        raf = requestAnimationFrame(animate);
        return;
      }

      // Ease the comet head toward the real pointer position — this lag is
      // what gives it a "trailing through space" feel rather than snapping.
      head.x += (target.x - head.x) * 0.22;
      head.y += (target.y - head.y) * 0.22;

      const dx = head.x - lastTrailX;
      const dy = head.y - lastTrailY;
      const dist = Math.hypot(dx, dy);

      if (visible && dist > 2) {
        const steps = Math.min(Math.max(Math.floor(dist / 4), 1), 5);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          sparks.push({
            x: lastTrailX + dx * t,
            y: lastTrailY + dy * t,
            age: 0,
            maxAge: 24 + Math.random() * 14,
            size: 1.4 + Math.random() * 1.6,
            color: pick(),
          });
        }
        lastTrailX = head.x;
        lastTrailY = head.y;
      }

      // Trail sparks
      sparks.forEach((p) => {
        p.age++;
        const ratio = 1 - p.age / p.maxAge;
        if (ratio <= 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.size * ratio, 0.15), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = ratio * 0.6;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      sparks = sparks.filter((p) => p.age < p.maxAge);

      // Click aura bursts
      bursts.forEach((b) => {
        b.age++;
        const ratio = 1 - b.age / b.maxAge;
        if (ratio <= 0) return;
        const eased = 1 - Math.pow(1 - ratio, 2);
        const radius = 4 + (1 - ratio) * 42;

        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius);
        glow.addColorStop(0, `${b.color}66`);
        glow.addColorStop(0.55, `${b.color}26`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.globalAlpha = eased;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x, b.y, radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 1.1;
        ctx.globalAlpha = eased * 0.55;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      bursts = bursts.filter((b) => b.age < b.maxAge);

      // Comet head: soft glow plus a bright white core
      if (visible) {
        const headGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 16);
        headGlow.addColorStop(0, 'rgba(255,255,255,0.9)');
        headGlow.addColorStop(0.3, 'rgba(255,113,206,0.5)');
        headGlow.addColorStop(0.65, 'rgba(1,205,254,0.22)');
        headGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};

const CustomLogo = () => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="relative flex items-center justify-center group cursor-pointer"
  >
    {/* Outer glow ring */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff71ce]/20 to-[#01cdfe]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative w-11 h-11 flex items-center justify-center">
      {/* Background circle */}
      <div className="absolute inset-0 bg-[#0d0d0f] rounded-full border border-white/10 shadow-[0_0_24px_rgba(255,113,206,0.18)] group-hover:border-[#ff71ce]/40 transition-colors duration-300" />
      
      {/* SVG Heart Logo */}
      <svg viewBox="0 0 36 36" className="relative z-10 w-6 h-6" fill="none">
        <motion.path
          d="M18 28 C18 28 6 20 6 12 C6 8.5 8.5 6 12 6 C14.5 6 16.5 7.5 18 9 C19.5 7.5 21.5 6 24 6 C27.5 6 30 8.5 30 12 C30 20 18 28 18 28 Z"
          fill="none"
          stroke="#ff71ce"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
        />
        {/* Cyan dot accent */}
        <motion.circle
          cx="18" cy="9"
          r="1.5"
          fill="#01cdfe"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Soft accent blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10" style={{ backgroundColor: project.color }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-8" style={{ backgroundColor: project.color }} />
      </div>

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0e0e10] border border-white/10 rounded-3xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ff71ce]/40 transition-all group"
        >
          <X size={18} className="text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all" />
        </button>

        {/* Header: 3D canvas + title */}
        <div className="aspect-video w-full overflow-hidden rounded-t-3xl bg-[#080809] relative">
          <ProjectVisual type={project.title} color={project.color} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm text-gray-300 mb-3 inline-block">
              {project.type === 'personal' ? 'Personal Project' : project.type === 'team' ? 'Team Project' : 'Research'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight" style={{ color: project.color }}>
              {project.title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          {/* Stack + Links row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-2">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-md bg-white/[0.05] text-[9px] text-gray-400 border border-white/[0.07] font-medium tracking-wide uppercase">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {project.link && project.link !== '#' && (
                <a href={project.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:opacity-90 transition-opacity">
                  <GithubIcon size={14} /> GitHub
                </a>
              )}
              {project.website && (
                <a href={project.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white text-xs font-semibold hover:bg-white/5 transition-colors">
                  <ExternalLink size={14} /> Live
                </a>
              )}
            </div>
          </div>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-3">The idea</p>
              <p className="text-base text-gray-300 leading-relaxed border-l-2 pl-4" style={{ borderColor: project.color + '55' }}>{project.motivation}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-3">Overview</p>
              <p className="text-sm text-gray-400 leading-relaxed">{project.overview}</p>
            </div>

            {project.keyMetrics && (
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-4">Key numbers</p>
                <div className="grid grid-cols-3 gap-3">
                  {project.keyMetrics.map((metric: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                      <span className="block text-xl font-black font-mono mb-1" style={{ color: project.color }}>{metric.value}</span>
                      <span className="block text-[9px] uppercase tracking-widest text-gray-600 font-semibold leading-tight">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-2.5">How it was built</p>
                <p className="text-sm text-gray-400 leading-relaxed">{project.assembly}</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-2.5">Key features</p>
                <p className="text-sm text-gray-400 leading-relaxed">{project.features}</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold mb-2.5">What's next</p>
              <p className="text-sm text-gray-400 leading-relaxed">{project.improvements}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ResearchCard: React.FC<{ 
  title: string; 
  desc: string; 
  tags: string[]; 
  color: string;
  status: string;
  keyMetrics: { label: string; value: string }[];
  index?: number;
  onKnowMore: () => void;
}> = ({ title, desc, tags, color, status, keyMetrics, index = 0, onKnowMore }) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 30 : 56, scale: isMobile ? 1 : 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: isMobile ? 0.01 : 0.2 }}
      transition={{ duration: 0.7, delay: isMobile ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative bg-[#111113] border border-[#ffffff11] hover:border-[#ffffff22] p-8 rounded-[2.5rem] overflow-hidden flex flex-col justify-between cursor-pointer transition-all shadow-xl"
      onClick={onKnowMore}
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
    />
    
    <div>
      <div className="flex justify-between items-start mb-6 gap-3">
        <span 
          className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-black/40 border font-mono shrink-0"
          style={{ borderColor: color + "44", color: color }}
        >
          {status}
        </span>
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ffffff05] bg-black/40 group-hover:scale-105 transition-transform shrink-0">
          <ProjectVisual type={title} color={color} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 font-display" style={{ color: color }}>{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{desc}</p>
    </div>

    <div>
      <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-2xl bg-black/30 border border-[#ffffff05]">
        {keyMetrics.map((m, idx) => (
          <div key={idx} className="text-center">
            <span className="block text-xs md:text-sm font-black font-mono tracking-tight text-white">{m.value}</span>
            <span className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mt-1 leading-none">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {tags.map(tag => (
          <span key={tag} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-[#ffffff03] border border-[#ffffff0a] text-gray-400 leading-none">
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
        Read Abstract <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
  );
};

const ResearchSection = ({ onKnowMore }: { onKnowMore: (r: any) => void }) => {
  const researches = [
    {
      title: "REFLEX",
      desc: "A way to stop AI security systems from being tricked into ignoring real attacks.",
      tags: ["Self-Supervised Learning", "Adversarial Defense", "Packet Filtering"],
      motivation: "Modern deep learning security systems are excellent at spotting attacks — right up until an attacker figures out how to confuse them. Real-time adaptation fixes can be poisoned by attackers feeding the model deliberately confusing data.",
      overview: "REFLEX solves this without ever letting the model itself change. Acting like a filter in front of the model, incoming data is compared against statistical packet profiles. Anything outside the normal range is stripped, preserving accuracy and protecting the model from poisoning.",
      assembly: "Built statistical packet baselining pipelines in Python. Designed high-performance filtering layers that process network packet records in parallel to minimize pipeline latency.",
      features: "Recovers ~18-20% accuracy on major benchmarks, cuts false alarms to near-zero, and processes 80,000+ records per second.",
      improvements: "Exploring multi-agent defensive collaboration and integration with smartNICs for hardware-level line-rate filtering.",
      color: "#ff71ce",
      type: "research",
      status: "Manuscript under review",
      keyMetrics: [
        { label: "Accuracy Recov.", value: "~18–20%" },
        { label: "False Alarms", value: "Near-Zero" },
        { label: "Throughput", value: "80k+/s" }
      ],
      link: "#"
    },
    {
      title: "PI-IDS (Protocol-Invariant Intrusion Detection)",
      desc: "Teaching security AI to notice what actually matters about an attack — not just what happened to be true in one dataset.",
      tags: ["Causal Inference", "Domain Generalization", "Explainable AI"],
      motivation: "A security model trained on one network often performs poorly on another because it learns dataset-specific coincidences (like traffic volume anomalies) instead of the actual physical constraints of the attack.",
      overview: "PI-IDS enforces protocol-invariance. By directing the AI to focus exclusively on features rooted in how network protocols actually function (e.g. TCP handshake spec violations), it remains highly accurate on completely unseen networks, including cloud setups.",
      assembly: "Designed causal inference models to extract invariant signals. Implemented feature extractors that map raw packet handshakes into RFC compliance states.",
      features: "20%+ improvement on unseen networks, works consistently in cloud environments, and operates using just 3 core explainable protocol signals.",
      improvements: "Adapting the protocol invariance framework to inspect encrypted packets and application-layer protocols.",
      color: "#01cdfe",
      type: "research",
      status: "Manuscript under review",
      keyMetrics: [
        { label: "Cross-Net Improv.", value: "20%+" },
        { label: "Cloud Support", value: "Robust" },
        { label: "Signals", value: "3 Explain" }
      ],
      link: "#"
    },
    {
      title: "Circuit Atlas (Ongoing)",
      desc: "Trying to figure out exactly why AI language models sometimes confidently make things up.",
      tags: ["PyTorch", "TransformerLens", "Weights & Biases"],
      motivation: "Large language models hallucinate false facts with absolute confidence, yet their internal activation layers remain an unmapped black box.",
      overview: "Circuit Atlas leverages mechanistic interpretability to treat a language model like an electrical circuit. By selectively intervening on different internal neuron pathways during generation, we isolate the specific circuits responsible for hallucinations.",
      assembly: "Built on PyTorch and TransformerLens. Structured automated diagnostic pipelines that capture and visualize activation weights, logged and tracked using Weights & Biases.",
      features: "Automated circuit discovery tools, activation weight intervention test suite, and integrated experiment logging.",
      improvements: "Scaling the interpretability framework to support large model families (e.g. Llama-3.1-70B) and building automated intervention patches.",
      color: "#fffb96",
      type: "research",
      status: "In progress",
      keyMetrics: [
        { label: "Approach", value: "Mechanistic" },
        { label: "Primary Tool", value: "PyTorch" },
        { label: "Log Sync", value: "W&B" }
      ],
      link: "#"
    }
  ];

  return (
    <Section id="research">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">
          Academic <span className="text-[#ff71ce]">Research</span> & Papers
        </h2>
        <p className="text-gray-500 mt-4">Diving deep into self-supervised defense, causal reasoning, and mechanistic interpretability.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {researches.map((r, i) => (
          <ResearchCard 
            key={i}
            index={i}
            title={r.title} 
            desc={r.desc} 
            tags={r.tags}
            color={r.color}
            status={r.status}
            keyMetrics={r.keyMetrics}
            onKnowMore={() => onKnowMore(r)}
          />
        ))}
      </div>
    </Section>
  );
};

const CERTIFICATIONS = [
  { title: "Research Internship", issuer: "VIT Chennai (SRIP 2025)", link: "/certificates/reserach-internship.pdf" },
  { title: "Web Developer at Startup", issuer: "Hackfinity", link: "/certificates/web_developer_hackfinity.pdf" }
];

const JourneySection: React.FC<{ certifications: Array<{ title: string; issuer: string; link: string }> }> = ({ certifications }) => {
  const isMobile = useIsMobile();
  return (
    <Section id="journey">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">
          My <span className="text-[#01cdfe]">Journey</span>
        </h2>
        <p className="text-gray-500 mt-4">Academic foundation and hands-on industry experience.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr,0.95fr,0.8fr] gap-8">
        {/* Left Column: Education */}
        <motion.div 
          initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#151518] border border-[#ffffff11] p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 bg-[#01cdfe]" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-[#01cdfe11] text-[#01cdfe]">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">EDUCATION</h3>
          </div>

          <div className="space-y-8 relative pl-6 border-l border-[#ffffff11]">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#01cdfe] border-4 border-[#151518]" />
              <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <h4 className="text-xl font-bold text-white">Vellore Institute of Technology (VIT) Chennai</h4>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffffff05] text-gray-400 border border-[#ffffff11] font-mono">Jul 2024–Present</span>
              </div>
              <p className="text-[#01cdfe] font-semibold text-sm mb-4">B.Tech, Computer Science & Engineering (AI & ML) · CGPA: 8.77/10.0</p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Key Coursework</span>
                  <div className="flex flex-wrap gap-2">
                    {['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'OOP', 'Machine Learning', 'Deep Learning', 'Software Engineering'].map(c => (
                      <span key={c} className="text-[10px] px-2.5 py-1 rounded bg-[#ffffff05] border border-[#ffffff05] text-gray-400 font-medium">{c}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Clubs & Activities</span>
                  <div className="flex flex-wrap gap-2">
                    {['SEDS Antariksh (Space Tech)', 'Linux Users Club'].map(club => (
                      <span key={club} className="text-[10px] px-2.5 py-1 rounded bg-[#01cdfe11] border border-[#01cdfe22] text-[#01cdfe] font-semibold">{club}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle Column: Experience */}
        <motion.div 
          initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#151518] border border-[#ffffff11] p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 bg-[#ff71ce]" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-[#ff71ce11] text-[#ff71ce]">
              <Briefcase size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">EXPERIENCE</h3>
          </div>

          <div className="space-y-10 relative pl-6 border-l border-[#ffffff11]">
            {/* Experience Item 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#ff71ce] border-4 border-[#151518]" />
              <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <h4 className="text-lg font-bold text-white">Undergraduate Research Intern</h4>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffffff05] text-gray-400 border border-[#ffffff11] font-mono">May 2025–Present</span>
              </div>
              <p className="text-[#ff71ce] font-semibold text-sm mb-3">Network Security & ML, VIT Chennai</p>
              <ul className="space-y-2.5 text-gray-400 text-sm list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff71ce] mt-1">▪</span>
                  <span>Two research papers written under faculty supervision, both currently under peer review (focusing on adversarial learning defense and causal reasoning in network security).</span>
                </li>
              </ul>
            </div>

            {/* Experience Item 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gray-600 border-4 border-[#151518]" />
              <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                <h4 className="text-lg font-bold text-white">Software Development Intern</h4>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffffff05] text-gray-400 border border-[#ffffff11] font-mono">Jun–Aug 2024</span>
              </div>
              <p className="text-gray-400 font-semibold text-sm mb-3">Hackfinity, Chennai (Freelance Contributor)</p>
              <ul className="space-y-2.5 text-gray-400 text-sm list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">▪</span>
                  <span>Rebuilt the company's official website as a freelance contributor — shipped ahead of schedule with zero bugs reported after launch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">▪</span>
                  <span>Built several reusable UI components that fixed inconsistent layouts across devices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">▪</span>
                  <span>Found and fixed a calculation bug in the frontend that had been silently giving users wrong numbers.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Certifications */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          transition={{ duration: 0.8, delay: isMobile ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#151518] border border-[#ffffff11] p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 bg-[#b967ff]" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-[#b967ff11] text-[#b967ff]">
              <Award size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">CERTIFICATIONS</h3>
          </div>

          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <a
                key={i}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#b967ff]/30 hover:bg-white/[0.05]"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{cert.title}</h4>
                  <p className="mt-1 text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-2 text-gray-500 transition-all group-hover:bg-[#b967ff] group-hover:text-black">
                  <ExternalLink size={15} />
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const SocialFeedSection: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <section id="social" className="py-16 px-6 md:px-24 lg:px-32 max-w-screen-2xl mx-auto w-full">
      <div className="mb-12">
        <p className="text-[#01cdfe] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Around the web</p>
        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">
          Latest <span className="text-[#ff71ce]">Thoughts</span>
        </h2>
        <p className="text-gray-500 mt-3 text-base">What I'm thinking about across the internet.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Twitter / X ── */}
        <motion.a
          href="https://x.com/sb_19_73"
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: isMobile ? 30 : 48, scale: isMobile ? 1 : 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
          transition={{ duration: 0.7, delay: isMobile ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.2] p-6 rounded-2xl overflow-hidden flex flex-col gap-4 transition-all"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center border border-white/10 shrink-0">
                <TwitterXIcon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none mb-0.5">@sb_19_73</p>
                <p className="text-[10px] text-gray-500">X (Twitter)</p>
              </div>
            </div>
            <TwitterXIcon size={14} className="text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm leading-relaxed">
              Thoughts on ML security, mechanistic interpretability, and building things that actually work.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
            View on X <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.a>

        {/* ── Bluesky ── */}
        <motion.a
          href="https://bsky.app/profile/sosush.bsky.social"
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: isMobile ? 30 : 48, scale: isMobile ? 1 : 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
          transition={{ duration: 0.7, delay: isMobile ? 0 : 0.17, ease: [0.22, 1, 0.36, 1] }}
          className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-[#0085ff]/40 p-6 rounded-2xl overflow-hidden flex flex-col gap-4 transition-all"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#0085ff]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0085ff]/15 flex items-center justify-center border border-[#0085ff]/20 shrink-0">
                <BlueskyIcon size={16} className="text-[#0085ff]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none mb-0.5">Sohini Banerjee</p>
                <p className="text-[10px] text-[#0085ff]/70">@sosush.bsky.social</p>
              </div>
            </div>
            <BlueskyIcon size={14} className="text-gray-600 group-hover:text-[#0085ff] transition-colors shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm leading-relaxed">
              Longer takes on AI research, open-source projects, and what I'm currently reading and building.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#0085ff] transition-colors">
            View on Bluesky <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.a>

        {/* ── LinkedIn ── */}
        <motion.a
          href="https://www.linkedin.com/in/sosush/"
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: isMobile ? 30 : 48, scale: isMobile ? 1 : 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: isMobile ? 0.01 : 0.25 }}
          whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
          transition={{ duration: 0.7, delay: isMobile ? 0 : 0.29, ease: [0.22, 1, 0.36, 1] }}
          className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-[#0a66c2]/40 p-6 rounded-2xl overflow-hidden flex flex-col gap-4 transition-all"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#0a66c2]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0a66c2]/15 flex items-center justify-center border border-[#0a66c2]/25 shrink-0">
                <LinkedinIcon size={16} className="text-[#0a66c2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none mb-0.5">Sohini Banerjee</p>
                <p className="text-[10px] text-[#0a66c2]/70">linkedin.com/in/sosush</p>
              </div>
            </div>
            <LinkedinIcon size={14} className="text-gray-600 group-hover:text-[#0a66c2] transition-colors shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm leading-relaxed">
              Research updates, project milestones, and professional reflections on AI/ML and cybersecurity.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#0a66c2] transition-colors">
            View on LinkedIn <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.a>

      </div>
    </section>
  );
};

// ── Project Deepdive Section ──────────────────────────────────────────────────
const ProjectDeepdiveSection: React.FC<{ onRead: (blog: BlogPost) => void }> = ({ onRead }) => {
  const [isPaused, setIsPaused] = useState(false);
  const stripPosts = useMemo(() => [...blogPosts, ...blogPosts], []);

  return (
    <Section id="deepdive" className="relative overflow-hidden">
      <div className="mb-12 md:mb-16">
        <p className="text-[#05ffa1] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Deepdives</p>
        <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white uppercase">
          Project <span className="text-[#01cdfe]">Deepdive</span>
        </h2>
        <p className="text-gray-500 mt-4 text-base">A comprehensive look into the inspiration and creation of my projects.</p>
      </div>

      <div
        className="relative w-full overflow-hidden py-4 md:py-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,205,254,0.12),transparent_70%)]" />
        <div
          className="flex w-max gap-4 md:gap-5 will-change-transform"
          style={{
            animation: 'scrollTape 20s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {stripPosts.map((blog, idx) => (
            <div
              key={`${blog.slug}-${idx}`}
              className="group h-[340px] md:h-[380px] w-[280px] md:w-[320px] shrink-0 rounded-[28px] border border-white/10 bg-[#111113]/90 p-6 md:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#01cdfe]/30 hover:shadow-[0_24px_90px_rgba(1,205,254,0.16)]"
              onClick={() => onRead(blog)}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">{blog.date}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-400">{blog.readTime}</span>
              </div>

              <div className="mb-4 h-2 w-full rounded-full bg-white/10">
                <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: blog.color }} />
              </div>

              <h3 className="text-lg md:text-xl font-black leading-tight text-white" style={{ color: blog.color }}>
                {blog.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-4">
                {blog.preview}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#05ffa1]">Project</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white transition-colors group-hover:text-[#01cdfe]">
                  Read <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollTape {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </Section>
  );
};

export default function App() {
  const [isBgMoving, setIsBgMoving] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, 32, 32);

      ctx.fillStyle = '#0d0d0f';
      ctx.beginPath();
      ctx.arc(16, 16, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2; t += 0.05) {
        const x = 16 + 8 * Math.pow(Math.sin(t), 3);
        const y = 15 - (7 * Math.cos(t) - 2.8 * Math.cos(2*t) - 1.2 * Math.cos(3*t) - 0.4 * Math.cos(4*t));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.strokeStyle = '#ff71ce';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      const pulse = Math.abs(Math.sin(frame * 0.06));
      ctx.fillStyle = '#01cdfe';
      ctx.beginPath();
      ctx.arc(16, 10, 1 + pulse * 1.3, 0, Math.PI * 2);
      ctx.fill();

      link!.href = canvas.toDataURL('image/png');
      frame++;
      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  const projects = [
    { 
      title: "NetSentinel", 
      type: "personal",
      desc: "A dashboard that watches network traffic in real time and catches attacks as they happen.", 
      motivation: "Most security tools tell you about a breach after it's already happened. NetSentinel is built to catch trouble while it's still unfolding.",
      overview: "It watches live network traffic, runs it through a machine learning model trained to recognize the fingerprints of an attack, and flags anything suspicious on an interactive dashboard — instantly, not after the fact.",
      assembly: "Under the hood, it uses an XGBoost model. Every experiment is version-tracked with DVC and containerized using Docker, allowing it to be dropped onto any server without environment friction.",
      features: "Real-time traffic processing, FastAPI backend, DVC data versioning, containerized deployment, and an automatic drift detection alert system for model retraining.",
      improvements: "Integrating automated test-time adaptation so the classifier adjusts to changing environments dynamically without offline retraining.",
      tags: ['Python', 'FastAPI', 'XGBoost', 'Docker', 'DVC', 'GitHub Actions'],
      color: "#ff4d4d",
      link: "https://github.com/sosush/NetSentinel"
    },
    { 
      title: "QuantLedger", 
      type: "personal",
      desc: "A personal investment tracker that thinks like a quant, not just a spreadsheet.", 
      motivation: "Most portfolio trackers just show you what your stocks are worth today. QuantLedger goes further — it tries to answer if your portfolio is actually good, or if it just looks good.",
      overview: "It pulls in real market data and calculates the same kinds of risk metrics professional fund managers use — things like Sharpe ratio, volatility, and asset correlation.",
      assembly: "Built as a full-stack application using FastAPI for the backend, React 19 for the frontend, and PostgreSQL/Redis for fast data caching and management. Integrates with the Yahoo Finance API for live market feeds.",
      features: "Live financial dashboard, Sharpe ratio and volatility calculations, momentum and fundamentals scoring, and a 3-year strategy backtester.",
      improvements: "Adding Monte Carlo simulations for future returns projections and automated asset rebalancing suggestions based on target risk profiles.",
      tags: ['FastAPI', 'React 19', 'PostgreSQL', 'Redis', 'TypeScript', 'Yahoo Finance API'],
      color: "#01cdfe",
      link: "https://github.com/sosush/QuantLedger"
    },
    { 
      title: "DISENT-KWS", 
      type: "team",
      desc: "A tiny on-device system that doesn't just hear its wake word — it recognizes who said it.", 
      motivation: "Wake word systems typically check what was said, not who said it, meaning anyone can trigger them. We wanted to build a speaker-verified keyword spotter that runs locally.",
      overview: "Built with Swarnim Tripathi at EnnovateX hackathon (Team 'Noisy AF') for speech disentanglement, this tiny model verifies both the wake phrase and the enrolled speaker's voice.",
      assembly: "Uses PyTorch, BC-ResNet, Conformer, and ECAPA-TDNN. The audio signals for words and voice identity are separated during training using an adversarial leak-prevention penalty, then optimized via ONNX.",
      features: "Under 2M parameters (<1MB compressed), 26ms response time, 95%+ keyword accuracy, speaker voice verification, and works down to -5dB SNR background noise.",
      improvements: "Exploring Mamba SSM (State Space Models) for sequence modeling to further reduce computation costs on microcontrollers.",
      tags: ['PyTorch', 'BC-ResNet', 'Conformer', 'ECAPA-TDNN', 'Mamba SSM', 'ONNX'],
      color: "#8a2be2",
      link: "https://github.com/sosush/DISENT_KWS"
    },
    { 
      title: "Genesis", 
      type: "personal",
      desc: "An AI that writes code the way evolution writes DNA — by trying, failing, and mutating until something works.", 
      motivation: "I wondered if we could use the same evolutionary principles that created biology to generate cleaner, more creative software solutions.",
      overview: "A sandbox where code structures 'evolve' over generations using genetic programming to solve algorithmic tasks. If pure evolution gets stuck, it uses an LLM as an expert mutation guide.",
      assembly: "Built in Python with a Streamlit interface. It connects to Groq API (Llama-3.3-70B) to intelligently direct mutation paths, helping it solve complex algorithmic problems.",
      features: "Genetic programming engine, visual generation tracker, LLM-guided mutation feedback loop, and success on LeetCode Hard tier tasks.",
      improvements: "Adding GPU-accelerated population evaluation and scaling the codebase to support multi-file compilation.",
      tags: ['Python', 'Streamlit', 'Groq API', 'Llama 3.3', 'Genetic Programming'],
      color: "#05ffa1",
      link: "https://github.com/sosush/Genesis"
    },
    { 
      title: "Prism", 
      type: "team",
      desc: "A way to prove you're a real human online — using physics, not passwords.", 
      motivation: "Deepfakes and AI-generated avatars are bypassing traditional security. We built Prism at the DEFY Hackathon to verify the physics of a living human.",
      overview: "A biometric verification protocol that checks physical indicators a deepfake cannot replicate, verifying humanity without storing raw private data.",
      assembly: "Built as a group hackathon project. Uses Python, PyTorch, MediaPipe for physical checks, Solidity smart contracts, and Next.js. We implemented Zero-Knowledge Proofs (ZKP) to protect privacy.",
      features: "Corneal reflection analysis, skin subsurface light transport verification, heartbeat pulse-shift checking, and Zero-Knowledge Proof (ZKP) verification tokens.",
      improvements: "Optimizing the ZKP generation pipeline to decrease mobile browser verification times and improving webcam support.",
      tags: ['Python', 'FastAPI', 'PyTorch', 'MediaPipe', 'Solidity', 'Next.js'],
      color: "#00ffcc",
      link: "https://github.com/sosush/Prism"
    },
    { 
      title: "Spark", 
      type: "personal",
      desc: "Turns a codebase into a 3D world you can actually walk through and understand.", 
      motivation: "Reading a massive codebase from static lists is incredibly tedious. Spark attempts to solve this by rendering code repositories as explorable 3D star maps.",
      overview: "It builds a visual, explorable Three.js version of a project's architecture, paired with an AI assistant that explains what any selected component or function does in real-time.",
      assembly: "Uses Next.js for the UI, Three.js for the interactive 3D graphs, FastAPI and Supabase for backend metadata, and Groq/Llama for generating structural code explanations.",
      features: "Interactive 3D graph visualizations, codebase-to-graph parser, semantic code search, and integrated LLM tour guide.",
      improvements: "Adding real-time multiplayer lobbies for team walkthroughs and expanding language support for AST parsing.",
      tags: ['Next.js', 'FastAPI', 'Groq', 'Supabase', 'Three.js'],
      color: "#a100ff",
      link: "https://github.com/sosush/Spark",
      website: "https://spark-constellation.vercel.app/"
    }
  ];

  return (
    <div className="relative selection:bg-[#ff71ce] selection:text-black" style={{ WebkitTapHighlightColor: 'transparent' }}>
      <CometCursor />
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
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedBlog(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e0e10] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
              >
                <X size={16} />
              </button>
              <div className="mb-6">
                <div className="flex gap-3 items-center text-[10px] uppercase font-bold tracking-widest text-gray-500 font-mono">
                  <span>{selectedBlog.date}</span>
                  <span>·</span>
                  <span>{selectedBlog.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight" style={{ color: selectedBlog.color }}>{selectedBlog.title}</h2>
              </div>
              <MarkdownContent content={selectedBlog.content} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="mx-auto max-w-screen-xl px-6 md:px-10">
          <div className="flex justify-between items-center py-3.5 mt-3 bg-black/55 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
            <motion.a
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 group"
            >
              <CustomLogo />
              <span className="text-[15px] font-bold tracking-tight text-white/75 group-hover:text-white transition-colors">Sohini Banerjee.</span>
            </motion.a>
            <div className="hidden md:flex items-center gap-0.5">
              {['About', 'Journey', 'Work', 'Research', 'Deepdive', 'Social', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-3.5 py-2 text-[12px] font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#ff71ce] text-xs font-semibold uppercase tracking-[0.3em] mb-6"
          >
            AI / ML Engineer & Security Researcher
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1] tracking-tight mb-6 font-display text-white"
          >
            Sohini Banerjee
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-black mb-8 font-display"
          >
            I build{' '}<TypingText texts={['Intelligence.', 'Robust Systems.', 'Secure Applications.', 'My Imagination.']} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Does coffee and late nights make me a hard working human? Or just a bunch of neural networks trying to learn too much data too fast?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#work"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 bg-[#ff71ce] text-black text-sm font-bold rounded-xl shadow-[0_0_30px_rgba(255,113,206,0.35)] hover:shadow-[0_0_45px_rgba(255,113,206,0.5)] transition-shadow"
            >
              View my work
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 border border-white/15 text-white text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
            >
              About me
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* About Section */}
      <Section id="about">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-[#080809] border border-white/[0.08] overflow-hidden shadow-2xl">
              <CodeEditorVisual />
            </div>
          </div>
          <div>
            <p className="text-[#ff71ce] text-xs font-semibold uppercase tracking-[0.3em] mb-4">About me</p>
            <h2 className="text-3xl md:text-4xl font-black mb-6 font-display leading-tight text-white">
              Building things that matter, at the intersection of AI & security.
            </h2>
            <div className="space-y-4 text-gray-500 leading-relaxed text-base">
              <p>
                I'm <span className="text-gray-300 font-semibold">Sohini Banerjee</span>, currently pursuing B.Tech in CSE (AI & ML) at VIT Chennai. CGPA 8.77.
              </p>
              <p>
                I specialize in building systems that don't fall apart when things go wrong — from ML-based intrusion detection to evolutionary code generation and mechanistic interpretability of LLMs.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <motion.a
                href="/Sohini_Banerjee_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 px-5 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:border-[#ff71ce]/30 hover:bg-white/[0.08] transition-all group text-sm font-medium text-gray-300"
              >
                <FileText size={16} className="text-[#ff71ce]" />
                Resume
                <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </div>
      </Section>

      {/* Journey Section */}
      <JourneySection certifications={CERTIFICATIONS} />

      {/* Work Section */}
      <Section id="work">
        <div className="mb-12">
          <p className="text-[#05ffa1] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Projects</p>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">
            Things I've built
          </h2>
          <p className="text-gray-500 mt-3 text-base">A selection of personal and team projects across ML, security, and systems engineering.</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      {/* Project Deepdive Section */}
      <ProjectDeepdiveSection onRead={(blog) => setSelectedBlog(blog)} />

      {/* Social Media Feed Section */}
      <SocialFeedSection />

      {/* Skills Section */}
      <section id="skills" className="py-16 px-6 md:px-24 lg:px-32 max-w-screen-2xl mx-auto w-full">
        <p className="text-[#fffb96] text-xs font-semibold uppercase tracking-[0.3em] mb-4">Skills</p>
        <h2 className="text-3xl font-black font-display tracking-tight text-white mb-10">What I work with</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#ff71ce11] text-[#ff71ce]"><Code2 size={18} /></div>
              <h3 className="text-base font-semibold text-white">Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'Framer Motion', 'Three.js', 'D3.js', 'GSAP'].map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400 font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[#01cdfe11] text-[#01cdfe]"><Cpu size={18} /></div>
              <h3 className="text-base font-semibold text-white">Backend & ML</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Python', 'FastAPI', 'Node.js', 'PyTorch', 'PostgreSQL', 'Redis', 'Docker', 'Supabase', 'LangChain', 'ONNX'].map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400 font-medium">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-32 px-6 md:px-24 lg:px-32 border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#ff71ce] opacity-[0.04] blur-[120px] rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-[#01cdfe] opacity-[0.04] blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-[#ff71ce] text-xs font-semibold uppercase tracking-[0.3em] mb-6">Get in touch</p>
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-5 text-white">
              Let's build something together.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-3">
              Open to research collaborations, interesting problems, and good conversations about AI and security.
            </p>
            <p className="text-gray-600 text-sm font-mono mb-10">
              sohinibanerjee1315@gmail.com · (+91) 98740-38011
            </p>

            <div className="flex flex-wrap gap-4 items-center justify-center">
              <motion.a
                href="mailto:sohinibanerjee1315@gmail.com"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-6 py-3 bg-[#ff71ce] text-black text-sm font-bold rounded-xl shadow-[0_0_25px_rgba(255,113,206,0.3)] hover:shadow-[0_0_40px_rgba(255,113,206,0.45)] transition-shadow"
              >
                <Mail size={16} /> Say hello
              </motion.a>
              <a href="https://github.com/sosush" title="GitHub" className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"><GithubIcon size={18} /></a>
              <a href="https://linkedin.com/in/sosush" title="LinkedIn" className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-[#0a66c2] hover:border-[#0a66c2]/30 transition-all"><LinkedinIcon size={18} /></a>
              <a href="https://x.com/sb_19_73" title="X (Twitter)" className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all"><TwitterXIcon size={18} /></a>
              <a href="https://bsky.app/profile/sosush.bsky.social" title="Bluesky" className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-[#0085ff] hover:border-[#0085ff]/30 transition-all"><BlueskyIcon size={18} /></a>
            </div>
          </motion.div>

          <p className="text-gray-700 text-xs mt-16 text-center">© Thank you for viewing my portfolio ❤️ </p>
        </div>
      </footer>
    </div>
  );
}
