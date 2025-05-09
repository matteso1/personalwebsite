// src/components/AnimatedBackground.jsx
import React, { useEffect, useRef } from 'react';

/**
 * A dynamic background component that creates an animated particle effect
 * @param {Object} props
 * @param {string} [props.intensity='medium'] - Controls the density and speed of particles ('low', 'medium', 'high')
 * @param {string} [props.color='accent'] - Base color for particles ('accent', 'primary', 'white')
 */
const AnimatedBackground = ({ intensity = 'medium', color = 'accent' }) => {
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
    
    initParticles();
    animate();
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, color]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark via-dark/95 to-dark z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;
    
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
    
    // Color configuration
    const colorMap = {
      accent: { r: 139, g: 92, b: 246 }, // violet-500
      primary: { r: 79, g: 70, b: 229 },  // indigo-600
      white: { r: 255, g: 255, b: 255 }
    };
    
    const baseColor = colorMap[color] || colorMap.accent;
    const settings = config[intensity] || config.medium;
    
    // Initialize particles
    function initParticles() {
      particles = [];
      for (let i = 0; i < settings.particleCount; i++) {
        // Randomize color slightly
        const r = baseColor.r + Math.floor(Math.random() * 20 - 10);
        const g = baseColor.g + Math.floor(Math.random() * 20 - 10);
        const b = baseColor.b + Math.floor(Math.random() * 20 - 10);
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (settings.size.max - settings.size.min) + settings.size.min,
          vx: (Math.random() - 0.5) * settings.maxSpeed,
          vy: (Math.random() - 0.5) * settings.maxSpeed,
          color: `rgba(${r}, ${g}, ${b}, ${Math.random() * 0.5 + 0.2})`
        });
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check with wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
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
            ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };