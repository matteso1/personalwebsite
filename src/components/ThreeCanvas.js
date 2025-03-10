// /c:/Users/nilsm/OneDrive/Desktop/websiteProject/interactive-symphony/src/components/ThreeCanvas.js
import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Island from './Island';
import gsap from 'gsap';

const ZOOM_SENSITIVITY = 0.0008;
let CAMERA_DISTANCE = 400;
let targetZoom = CAMERA_DISTANCE;
const starCount = 1500;
const maxDistance = 250;
const connectionUpdateInterval = 3;
let frameCount = 0;
let pointerX = 0;
let pointerY = 0;

const starPositions = new Float32Array(starCount * 3);
const starVelocities = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 2000;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
  starPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
  
  starVelocities[i3] = (Math.random() - 0.5) * 0.05;
  starVelocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
  starVelocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
}

const MOUSE_SENSITIVITY = 0.005;
const clock = new THREE.Clock();
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const ThreeCanvas = ({ onIslandClick }) => {
  const canvasRef = useRef(null);
  const islandsRef = useRef([]);
  const timeRef = useRef(0);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Constants for camera positions
  const HOME_POSITION = { x: 0, y: 60, z: 200 }; // Home position of the camera
  const ZOOM_OFFSET = { x: 0, y: 60, z: 102 }; // Offset for zooming into an island

  // Callback to handle island clicks
  const handleIslandClick = useCallback((type) => {
    if (typeof onIslandClick === 'function') {
      onIslandClick(type);
    }
  }, [onIslandClick]);

  // Effect to initialize the Three.js scene when the component mounts
  useEffect(() => {
    if (!mountRef.current) return;

    // Create the scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Remove fog
    scene.fog = null;

    // Update lighting system
    // cyan ambient light 
    const ambientLight = new THREE.AmbientLight(0xffffff, 5, 0); 
    scene.add(ambientLight);

    // main key light 
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
    directionalLight.position.set(10, 20, 10).normalize();
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);

    // sky/ground light 
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 3.0);
    scene.add(hemisphereLight);

    // Create the camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(HOME_POSITION.x, HOME_POSITION.y, HOME_POSITION.z);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000308, 1); // dark blue background 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9; // overall brightness multiplier 
    mountRef.current.appendChild(renderer.domElement); // Append the renderer to the container div
    rendererRef.current = renderer;


    renderer.domElement.addEventListener('mousemove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    });

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      1.5,
      0.4,
    );
    composer.addPass(bloomPass);

    const bgGeometry = new THREE.BufferGeometry();
    const bgVertices = [];
    for (let i = 0; i < 1000; i++) {
      bgVertices.push(
        (Math.random() - 0.5) * 5000,
        (Math.random() - 0.5) * 5000,
        (Math.random() - 0.5) * 5000
      );
    }
    bgGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bgVertices, 3));
    const bgMaterial = new THREE.PointsMaterial({
      color: 0x778899,
      size: 2.0,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    });
    const bgParticles = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgParticles);

    // Initialize stars with positions and velocities
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 2000;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
      
      starVelocities[i3] = (Math.random() - 0.5) * 0.1;
      starVelocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      starVelocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.0,
      transparent: true,
      opacity: 0.1
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(starCount * 4 * 2);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8888ff,
      transparent: true,
      opacity: 0.1 // star connection line 
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Create unique islands with more balanced positions and unique features
    const islandPositions = [
      { 
        type: 'music', 
        label: 'MUSIC',  // Add label property
        position: new THREE.Vector3(
          //Math.cos(Math.PI * 1.3) * 180 + 50,
          //Math.sin(Date.now() * 0.001) * 20, // added vertical offset 
         // Math.sin(Math.PI * 1.3) * 140 - 30

          Math.cos(Math.PI * 1.3) * 180 + 50,
          Math.sin(Date.now() * 0.001) * 20, // added vertical offset 
          Math.sin(Math.PI * 1.3) * 140 - 30


        ), 
        //color: 0x188100 // green
        color: 0x0021c6 // blue
      },
      { 
        type: 'shop', 
        label: 'SHOP',  // Add label property
        position: new THREE.Vector3(
          //-10 + Math.cos(Math.PI * 0.6) * 220 - 40,
          //-30 + Math.cos(Date.now() * 0.001) * 25, // lower position with cos variation
          //80 + Math.sin(Math.PI * 0.6) * 160 + 20

          Math.cos(Math.PI * 0.6) * 220 - 40,
          Math.cos(Date.now() * 0.001) * 25, // lower position with cos variation
          Math.sin(Math.PI * 0.6) * 160 + 20


        ), 
        //color: 0x891300  // orange
        color: 0x0021c6 // blue
      },
      { 
        type: 'about', 
        label: 'ABOUT',  // Add label property
        position: new THREE.Vector3(
          //12 + Math.cos(Math.PI * 0.1) * 200 + 30,
          //150 + Math.sin(Date.now() * 0.002) * 15, // mid level position 
          //22 + Math.sin(Math.PI * 0.1) * 120 - 40

          Math.cos(Math.PI * 0.1) * 200 + 30,
          Math.sin(Date.now() * 0.002) * 15, // mid level position 
          Math.sin(Math.PI * 0.1) * 120 - 40


        ), 
        color: 0x0021c6 // blue
      }
    ];

    islandPositions.forEach(({ type, position, color }) => {
      const island = new Island(position, type, handleIslandClick, color);
      scene.add(island.base);
      islandsRef.current.push(island);
    });

    // Function to handle mouse clicks
    function handleClick(event) {
      if (camera.userData.isAnimating) return;

      event.preventDefault();

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);

      const interactiveObjects = [];
      islandsRef.current.forEach(island => {
        if (island && island.getAllMeshes) {
          interactiveObjects.push(...island.getAllMeshes());
        }
      });

      const intersects = raycasterRef.current.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        let currentObject = intersectedObject;

        while (currentObject && !currentObject.userData.island) {
          currentObject = currentObject.parent;
        }

        if (currentObject && currentObject.userData.island) {
          const island = currentObject.userData.island;

          // Prevent any clicks during animation
          if (camera.userData.isAnimating) return;

          // If already zoomed in, return to home position
          if (camera.userData.isZoomedIn) {
            camera.userData.isAnimating = true;

            // Single animation timeline for returning home
            const timeline = gsap.timeline({
              onComplete: () => {
                camera.userData.isAnimating = false;
                camera.userData.isZoomedIn = false;
                camera.userData.currentIsland = null;
                camera.lookAt(0, 0, 0);
                //handleIslandClick(null);
                
                camera.position.copy(HOME_POSITION);
              }
            });

            // Camera movement
            timeline.to(camera.position, {
              x: HOME_POSITION.x,
              y: HOME_POSITION.y,
              z: HOME_POSITION.z,
              duration: 2.5,
              ease: "power2.inOut",
              onUpdate: () => {
                const progress = timeline.progress();
                const targetX = camera.userData.currentIsland.base.position.x * (1 - progress);
                const targetY = camera.userData.currentIsland.base.position.y * (1 - progress);
                const targetZ = camera.userData.currentIsland.base.position.z * (1 - progress);
                camera.lookAt(targetX, targetY, targetZ);
              }
            }, 0);

            // Fade all islands simultaneously
            islandsRef.current.forEach(island => {
              timeline.to(island.base.material, {
                opacity: 1.0,
                duration: 2.5,
                ease: "power2.inOut"
              }, "<");
            });

            return;
          }

          // Zoom to island
          camera.userData.isAnimating = true;

          // Single animation timeline for zooming in
          const timeline = gsap.timeline({
            onComplete: () => {
              camera.userData.isAnimating = false;
              camera.userData.isZoomedIn = true;
              camera.userData.currentIsland = island;
              handleIslandClick(island.type); 
              camera.position.set(island.base.position.x + ZOOM_OFFSET.x, island.base.position.y + ZOOM_OFFSET.y, island.base.position.z + ZOOM_OFFSET.z); // Ensure final position is set
              camera.lookAt(island.base.position);
            }
          });
          //handleIslandClick(island.type); // Add this line here

          const targetPosition = {
            x: island.base.position.x + ZOOM_OFFSET.x,
            y: island.base.position.y + ZOOM_OFFSET.y,
            z: island.base.position.z + ZOOM_OFFSET.z
          };

          // Camera movement
          timeline.to(camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2.0, // Increased duration for smoother transition
            ease: "power2.inOut", // Smoother easing function
            onUpdate: () => camera.lookAt(island.base.position)
          });

          // Fade other islands simultaneously
          islandsRef.current.forEach(otherIsland => {
            if (otherIsland !== island) {
              timeline.to(otherIsland.base.material, {
                opacity: 0.3,
                duration: 2.0, // Increased duration for smoother transition
                ease: "power2.inOut" // Smoother easing function
              }, "<");
            }
          });
        }
      }
    }

    // Function to handle the animation loop
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      frameCount++;
      
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;





      
      if (!camera.userData.isAnimating && !camera.userData.isZoomedIn) {
        CAMERA_DISTANCE = targetZoom;
        camera.position.x += (CAMERA_DISTANCE * Math.sin(currentRotationY) * Math.cos(currentRotationX) - camera.position.x) * 0.1;
        camera.position.y += (CAMERA_DISTANCE * Math.sin(currentRotationX) - camera.position.y) * 0.1;
        camera.position.z += (CAMERA_DISTANCE * Math.cos(currentRotationY) * Math.cos(currentRotationX) - camera.position.z) * 0.1;
        camera.lookAt(0, 0, 0);
      }

      islandsRef.current.forEach(island => {
      island.base.rotation.y += 0.002;
      });

      if (frameCount % 2 === 0) {  // Update positions every other frame
        const positions = starGeometry.attributes.position.array;
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          positions[i3] += starVelocities[i3];
          positions[i3 + 1] += starVelocities[i3 + 1];
          positions[i3 + 2] += starVelocities[i3 + 2];
          
          const wrap = (val) => val > 1000 ? -1000 : val < -1000 ? 1000 : val;
          positions[i3] = wrap(positions[i3]);
          positions[i3 + 1] = wrap(positions[i3 + 1]);
          positions[i3 + 2] = wrap(positions[i3 + 2]);
        }
        starGeometry.attributes.position.needsUpdate = true;
      }

      if (frameCount % connectionUpdateInterval === 0) {
        const positions = starGeometry.attributes.position.array;
        const linePositions = lineGeometry.attributes.position.array;
        let lineIndex = 0;
        
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          for (let j = i + 1; j < starCount; j++) {
            const j3 = j * 3;
            const dx = positions[i3] - positions[j3];
            const dy = positions[i3 + 1] - positions[j3 + 1];
            const dz = positions[i3 + 2] - positions[j3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < maxDistance) {
              linePositions[lineIndex++] = positions[i3];
              linePositions[lineIndex++] = positions[i3 + 1];
              linePositions[lineIndex++] = positions[i3 + 2];
              linePositions[lineIndex++] = positions[j3];
              linePositions[lineIndex++] = positions[j3 + 1];
              linePositions[lineIndex++] = positions[j3 + 2];
            }
          }
        }
        lineGeometry.setDrawRange(0, lineIndex);
        lineGeometry.attributes.position.needsUpdate = true;
      }

      starGeometry.attributes.position.needsUpdate = true;
      
      if (frameCount % 2 === 0) {
        starMaterial.opacity = 0.7 + Math.sin(timeRef.current * 2) * 0.2;
        starMaterial.needsUpdate = true;
      }

      
        

















      
      composer.render();
    }

    

    const handleMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event) => {
      if (!isDragging || camera.userData.isAnimating) return;
      
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;
      
      targetRotationY += deltaX * MOUSE_SENSITIVITY;
      targetRotationX += deltaY * MOUSE_SENSITIVITY * 0.5;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handleWheel = (event) => {
      if (camera.userData.isAnimating) return;
      targetZoom = THREE.MathUtils.clamp(
        targetZoom + event.deltaY * ZOOM_SENSITIVITY,
        100,
        600
      );
    };

    if (renderer.domElement) {
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.style.touchAction = 'none';
      
      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('mouseleave', () => {
        if (isDragging) handleMouseUp();
      });
      renderer.domElement.addEventListener('wheel', handleWheel);
      renderer.domElement.addEventListener('click', handleClick);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix(); 
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start the animation loop
    animate();

    // Cleanup on component unmount
    return () => {
      if (mountRef.current && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseup', handleMouseUp);
        renderer.domElement.removeEventListener('mouseleave', () => {});
        renderer.domElement.removeEventListener('wheel', handleWheel);
        renderer.domElement.removeEventListener('click', handleClick);
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handleIslandClick]);

  // Return the container div for the Three.js scene
  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000'
      }}
    />
  );
};

export default ThreeCanvas;