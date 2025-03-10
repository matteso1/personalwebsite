// /c:/Users/nilsm/OneDrive/Desktop/websiteProject/interactive-symphony/src/components/Island.js
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

class Island {
    constructor(position, type, onClick, color) {
      this.base = new THREE.Object3D();
      this.base.position.copy(position);
      this.base.userData.island = this;
      this.color = color;
      this.type = type;
  
      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry(type.toUpperCase(), {
          font: font,
          size: 16,
          height: 2,
          depth: 1,
          curveSegments: 8,
          bevelEnabled: true,
          bevelThickness: 0.5,
          bevelSize: 0.3,
          bevelOffset: 0.8,
          bevelSegments: 5
        });
  
        const textMaterial = new THREE.MeshToonMaterial({
          color: 0x000000,
          emissive: color,
          emissiveIntensity: 18,
          shininess: 1,
          transparent: true,
          opacity: 0.95
        });

        // Add outline mesh after creating textMesh:
        const outlineGeometry = new TextGeometry(type.toUpperCase(), {
            font: font,
            size: 23,  // Slightly larger than main text
            height: 2.2,
            curveSegments: 8,
            bevelEnabled: false
        });

        const outlineMesh = new THREE.Mesh(
            outlineGeometry,
            new THREE.MeshBasicMaterial({
              color: 0x000000,
              depthTest: false,
              transparent: true,
              opacity: 0.99
            })
          );
        
        outlineMesh.position.z = -0.5;  // Position behind main text  
        
  
        this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
        this.textMesh.geometry.computeBoundingBox();
        this.textMesh.geometry.center();
        this.textMesh.position.set(0, 28, 0);
        
        const box = new THREE.Box3().setFromObject(this.textMesh);
        const size = box.getSize(new THREE.Vector3());
        const collider = new THREE.Mesh(
          new THREE.BoxGeometry(size.x, size.y, size.z),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        collider.position.copy(this.textMesh.position);
        
        this.base.add(this.textMesh);
        this.base.add(collider);
      });
  
      this.base.addEventListener('click', () => onClick(type));
    }
  
    update(delta) {
        if (this.textMesh) {
          this.textMesh.rotation.y += delta * 0.0001;
          
          // Slower floating animation
          const time = Date.now() * 0.0002; // Reduced from 0.0003
          const sineValue = Math.sin(time);
          const cosineValue = Math.cos(time * 0.7); // Secondary wave
          
          // Combined wave pattern for organic movement
          const verticalMovement = (sineValue * 4) + (cosineValue * 2); // Reduced from 10
          const easedMovement = verticalMovement * (1 - Math.abs(sineValue * 0.2));
          
          // Smoother position transition
          this.textMesh.position.y = 28 + easedMovement;
          
          // Subtler scale animation
          const scaleY = 1 + Math.abs(sineValue) * 0.03; // Reduced from 0.1
          const scaleXZ = 1 - Math.abs(sineValue) * 0.015; // Reduced from 0.05
          this.textMesh.scale.set(scaleXZ, scaleY, scaleXZ);
          
          // Gentler rotation
          this.textMesh.rotation.x = -0.3 + Math.sin(time * 0.5) * 0.1; // Reduced from 0.2
          this.textMesh.rotation.z = Math.sin(time * 0.8) * 0.02; // Reduced from 0.05
        }
      }
  
    getAllMeshes() {
      return [this.textMesh];
    }
  }
  
  export default Island;