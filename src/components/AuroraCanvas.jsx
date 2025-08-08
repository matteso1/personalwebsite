import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

function AuroraPlane() {
  const materialRef = useRef();
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  const fragmentShader = /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;

    // Enhanced 2D noise functions
    float hash(vec2 p){
      p = fract(p*vec2(123.34, 345.45));
      p += dot(p, p+34.345);
      return fract(p.x*p.y);
    }
    
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i+vec2(1.0, 0.0));
      float c = hash(i+vec2(0.0, 1.0));
      float d = hash(i+vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
    }

    // Fractal brownian motion for richer patterns
    float fbm(vec2 p){
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < 4; i++){
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      uv.x *= uResolution.x / uResolution.y;
      
      // Center the effect
      uv -= 0.5;
      uv *= 2.0;

      float t = uTime * 0.05;
      
      // Multiple noise layers for depth
      float n1 = fbm(uv*2.5 + vec2(t*0.8, -t*0.6));
      float n2 = fbm(uv*1.8 + vec2(-t*0.4, t*1.2));
      float n3 = fbm(uv*3.2 + vec2(t*0.9, t*0.3));
      float n4 = noise(uv*8.0 + vec2(t*2.0, -t*1.5));
      
      // Create flowing aurora bands
      float bands = smoothstep(0.2, 0.8, n1*0.5 + n2*0.3 + n3*0.2);
      bands = mix(bands, n4, 0.1);
      
      // Aurora Borealis color palette
      vec3 deepSpace = vec3(0.02, 0.02, 0.04);     // Deep night sky
      vec3 emeraldGlow = vec3(0.0, 0.8, 0.4);      // Northern lights green
      vec3 violetShimmer = vec3(0.6, 0.2, 0.9);    // Purple aurora
      vec3 cyanWave = vec3(0.0, 0.6, 0.9);         // Blue aurora flow
      vec3 pinkDance = vec3(0.9, 0.3, 0.6);        // Pink aurora tips
      
      // Dynamic aurora color mixing
      float colorShift = sin(uTime*0.15) * 0.5 + 0.5;
      float wavePhase = sin(uTime*0.25 + uv.x*1.5) * 0.5 + 0.5;
      float heightVariation = sin(uTime*0.3 + uv.y*2.0) * 0.5 + 0.5;
      
      // Create aurora layers
      vec3 primaryAurora = mix(emeraldGlow, violetShimmer, colorShift);
      vec3 secondaryAurora = mix(cyanWave, pinkDance, wavePhase);
      
      // Base aurora
      vec3 col = mix(deepSpace, primaryAurora, bands * 0.7);
      
      // Add dancing tips and waves
      col = mix(col, secondaryAurora, bands * 0.4 * heightVariation);
      
      // Add subtle green base (classic aurora)
      col = mix(col, emeraldGlow, bands * 0.2);
      
      // Add depth with distance falloff
      float dist = length(uv);
      col *= 1.0 - dist * 0.3;
      
      // Subtle breathing effect
      col *= 0.85 + 0.15*sin(uTime*0.8);
      
      // Enhance contrast and saturation
      col = pow(col, vec3(0.9));
      col = mix(col, col*col, 0.2);
      
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const mat = useMemo(
    () => new THREE.ShaderMaterial({
      uniforms,
      fragmentShader,
      vertexShader,
      depthWrite: false,
    }),
    []
  );

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={mat} ref={materialRef} attach="material" />
    </mesh>
  );
}

export default function AuroraCanvas() {
  // Always render on desktop, skip only on actual mobile devices
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-0" style={{ zIndex: -1 }}>
      <Canvas 
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }} 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
      >
        <AuroraPlane />
      </Canvas>
    </div>
  );
}


