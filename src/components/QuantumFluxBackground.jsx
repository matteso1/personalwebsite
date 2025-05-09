// src/components/QuantumFluxBackground.jsx
import React, { useEffect, useRef } from 'react';

/**
 * A dynamic background component that creates an animated quantum-like particle effect
 * @param {Object} props
 * @param {string} [props.intensity='medium'] - Controls the density and speed of particles ('low', 'medium', 'high')
 */
const QuantumFluxBackground = ({ intensity = 'medium' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Reinitialize when resized
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Configure based on intensity
    const config = {
      low: {
        particleCount: 50,
        maxSpeed: 0.3,
        connectionDistance: 150,
        size: { min: 1, max: 2 }
      },
      medium: {
        particleCount: 80,
        maxSpeed: 0.5,
        connectionDistance: 200,
        size: { min: 1, max: 3 }
      },
      high: {
        particleCount: 120,
        maxSpeed: 0.7,
        connectionDistance: 250,
        size: { min: 1, max: 4 }
      }
    };
    
    const settings = config[intensity] || config.medium;
    
    // Initialize particles
    function initParticles() {
      particles = [];
      for (let i = 0; i < settings.particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (settings.size.max - settings.size.min) + settings.size.min,
          vx: (Math.random() - 0.5) * settings.maxSpeed,
          vy: (Math.random() - 0.5) * settings.maxSpeed,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`
        });
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles and connections
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < settings.connectionDistance) {
            const opacity = 1 - (distance / settings.connectionDistance);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    initParticles();
    animate();
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default QuantumFluxBackground;