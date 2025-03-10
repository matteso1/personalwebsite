import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const TerminalNav = ({ isVisible = false, onMinimize = () => {}, onFocus = () => {} }) => {
  // States
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/');

  // Refs
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const navigate = useNavigate();

  // Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.terminal-header')) {
      setIsDragging(true);
      onFocus();
      const rect = terminalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - windowSize.width));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - windowSize.height));
      setPosition({ x: newX, y: newY });
    }
    if (isResizing) {
      const newWidth = Math.max(300, e.clientX - position.x);
      const newHeight = Math.max(200, e.clientY - position.y);
      setWindowSize({
        width: Math.min(newWidth, window.innerWidth - position.x),
        height: Math.min(newHeight, window.innerHeight - position.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
    onFocus();
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const trimmedCommand = command.trim().toLowerCase();
      setOutput(prev => [...prev, `\n${currentDirectory}> ${command}`]);

      switch (trimmedCommand) {
        case '/help':
          setOutput(prev => [...prev, 
            'Available commands:',
            '/home     - Return to home',
            '/music    - Go to music section',
            '/about    - About information',
            '/contact  - Contact information',
            'clear     - Clear terminal',
            'close     - Close terminal'
          ]);
          break;
        case 'clear':
          setOutput([]);
          break;
        case 'close':
          onMinimize();
          break;
        default:
          setOutput(prev => [...prev, 'Command not recognized. Type /help for available commands.']);
      }
      setCommand('');
    }
  };

  // Effects
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Auto-scroll effect
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={terminalRef}
      className={`terminal-container ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isVisible ? 'auto' : 'none',
        zIndex: 1000
      }}
      onMouseDown={(e) => {
        handleMouseDown(e);
        onFocus();
      }}
    >
      <div className="terminal-header">
        <div className="terminal-title">TERMINAL OS v2.0</div>
        <div className="terminal-buttons">
          <span 
            className="terminal-button minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          ></span>
          <span className="terminal-button maximize"></span>
          <span 
            className="terminal-button close"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          ></span>
        </div>
      </div>
      <div className="terminal-content" ref={outputRef}>
        <div className="terminal-output">
          {output.map((line, index) => (
            <div key={index} className="terminal-line">{line}</div>
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="terminal-prompt">{currentDirectory}{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="terminal-input"
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>
      <div className="resize-handle" onMouseDown={startResize}></div>
    </div>
  );
};

export default TerminalNav;