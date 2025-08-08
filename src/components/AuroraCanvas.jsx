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

    // Simple 2D noise (iq-style)
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

    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      uv.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.08;
      float n1 = noise(uv*3.5 + vec2(t, -t*0.7));
      float n2 = noise(uv*2.0 + vec2(-t*0.3, t*0.9));
      float n3 = noise(uv*4.5 + vec2(t*0.6, t*0.4));
      float band = smoothstep(0.35, 0.9, n1*0.6 + n2*0.3 + n3*0.2);

      vec3 colA = vec3(0.15, 0.05, 0.30);     // deep indigo
      vec3 colB = vec3(0.55, 0.35, 0.95);     // violet
      vec3 colC = vec3(0.15, 0.65, 0.55);     // teal

      vec3 col = mix(colA, colB, band);
      col = mix(col, colC, 0.25 + 0.25*sin(uTime*0.3));
      col *= 0.9 + 0.1*sin(uTime*0.6 + uv.x*4.0);
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
  // Skip rendering on coarse pointers (mobile) for performance/visual simplicity
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas gl={{ antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
        <AuroraPlane />
      </Canvas>
    </div>
  );
}


