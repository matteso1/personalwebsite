import React, { useRef, useEffect, useCallback } from 'react';

const GameOfLife = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gridRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const CELL_SIZE = 12;
  const UPDATE_INTERVAL = 150; // ms between generations

  const createGrid = useCallback((cols, rows) => {
    const grid = [];
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        // Sparse initial population for subtle effect
        grid[i][j] = Math.random() < 0.08 ? 1 : 0;
      }
    }
    return grid;
  }, []);

  const countNeighbors = useCallback((grid, x, y, cols, rows) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const col = (x + i + cols) % cols;
        const row = (y + j + rows) % rows;
        count += grid[col][row];
      }
    }
    return count;
  }, []);

  const nextGeneration = useCallback((grid, cols, rows) => {
    const newGrid = [];
    for (let i = 0; i < cols; i++) {
      newGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        const neighbors = countNeighbors(grid, i, j, cols, rows);
        if (grid[i][j] === 1) {
          newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          newGrid[i][j] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    return newGrid;
  }, [countNeighbors]);

  const draw = useCallback((ctx, grid, cols, rows, width, height) => {
    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          const x = i * CELL_SIZE;
          const y = j * CELL_SIZE;

          // Create gradient for each cell
          const gradient = ctx.createRadialGradient(
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            0,
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            CELL_SIZE
          );
          gradient.addColorStop(0, 'rgba(0, 255, 159, 0.6)');
          gradient.addColorStop(0.5, 'rgba(0, 255, 159, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 255, 159, 0)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x - CELL_SIZE / 2, y - CELL_SIZE / 2, CELL_SIZE * 2, CELL_SIZE * 2);

          // Core cell
          ctx.fillStyle = 'rgba(0, 255, 159, 0.8)';
          ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
      }
    }

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(30, 30, 33, 0.5)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, height);
      ctx.stroke();
    }

    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL_SIZE);
      ctx.lineTo(width, j * CELL_SIZE);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const cols = Math.ceil(canvas.width / CELL_SIZE);
    const rows = Math.ceil(canvas.height / CELL_SIZE);

    gridRef.current = createGrid(cols, rows);

    const animate = (timestamp) => {
      if (timestamp - lastUpdateRef.current >= UPDATE_INTERVAL) {
        gridRef.current = nextGeneration(gridRef.current, cols, rows);
        draw(ctx, gridRef.current, cols, rows, canvas.width, canvas.height);
        lastUpdateRef.current = timestamp;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initial draw
    draw(ctx, gridRef.current, cols, rows, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      const newCols = Math.ceil(canvas.width / CELL_SIZE);
      const newRows = Math.ceil(canvas.height / CELL_SIZE);
      gridRef.current = createGrid(newCols, newRows);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [createGrid, nextGeneration, draw]);

  // Add some cells near mouse on interaction
  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    const cols = gridRef.current.length;
    const rows = gridRef.current[0]?.length || 0;

    // Randomly add cells near cursor
    if (Math.random() < 0.3) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = (x + i + cols) % cols;
          const newY = (y + j + rows) % rows;
          if (Math.random() < 0.3) {
            gridRef.current[newX][newY] = 1;
          }
        }
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ zIndex: 0 }}
      onMouseMove={handleMouseMove}
    />
  );
};

export default GameOfLife;
