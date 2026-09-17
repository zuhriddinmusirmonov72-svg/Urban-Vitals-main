import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './EcoGame3D.css';

// ========== CHARACTER COMPONENT ==========
function Character({ position, animation }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const [walkProgress, setWalkProgress] = useState(0);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
    }
    if (animation === 'walking') {
      setWalkProgress(prev => (prev + 0.05) % (Math.PI * 2));
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.1 + Math.sin(walkProgress) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#34d399" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.15, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.08, 1.15, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}

// ========== TRASH OBJECTS ==========
function TrashObject({ position, type, onCollect }) {
  const meshRef = useRef();
  const [isCollected, setIsCollected] = useState(false);

  useFrame(() => {
    if (meshRef.current && !isCollected) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  if (isCollected) return null;

  const trashConfigs = {
    plastic: { color: '#ef4444', size: [0.2, 0.3, 0.1], icon: '🔴' },
    paper: { color: '#f59e0b', size: [0.25, 0.25, 0.05], icon: '🟠' },
    bottle: { color: '#06b6d4', size: [0.15, 0.4, 0.15], icon: '🔵' },
    general: { color: '#64748b', size: [0.2, 0.2, 0.2], icon: '⚫' },
  };

  const config = trashConfigs[type] || trashConfigs.general;

  const handleCollect = () => {
    setIsCollected(true);
    if (onCollect) onCollect();
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleCollect}
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial color={config.color} metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

// ========== ENVIRONMENT OBJECTS ==========
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1.6, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0d7f5c" />
    </mesh>
  );
}

function WaterPond({ position }) {
  return (
    <mesh position={[...position, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.5, 32]} />
      <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function Flower({ position }) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Flower */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

// ========== MAIN GAME SCENE ==========
function GameScene({ characterPos, animation, trashItems, onTrashCollect }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <Ground />
      <Character position={characterPos} animation={animation} />
      {trashItems.map((trash, idx) => (
        <TrashObject
          key={idx}
          position={trash.position}
          type={trash.type}
          onCollect={() => onTrashCollect(idx)}
        />
      ))}
      <Tree position={[-8, 0, -8]} />
      <Tree position={[8, 0, 8]} />
      <Tree position={[-8, 0, 8]} />
      <Tree position={[8, 0, -8]} />
      <Tree position={[0, 0, -10]} />
      <WaterPond position={[10, 0, -5]} />
      <Flower position={[-5, 0, 5]} />
      <Flower position={[5, 0, 5]} />
      <Flower position={[0, 0, 5]} />
      <OrbitControls />
    </>
  );
}

// ========== MAIN COMPONENT ==========
export default function EcoGame3D() {
  const [characterPos, setCharacterPos] = useState([0, 0, 0]);
  const [animation, setAnimation] = useState('idle');
  const [command, setCommand] = useState('');
  const [feedback, setFeedback] = useState('Buyrugingizni yozing...');
  const [trashItems, setTrashItems] = useState([
    { position: [3, 0.2, 5], type: 'plastic' },
    { position: [-4, 0.2, 3], type: 'paper' },
    { position: [2, 0.2, -3], type: 'bottle' },
    { position: [-3, 0.2, -4], type: 'general' },
    { position: [5, 0.2, 0], type: 'plastic' },
  ]);
  const [stats, setStats] = useState({ trash: 0, planted: 0 });
  const [isExecuting, setIsExecuting] = useState(false);
  const commandQueueRef = useRef([]);

  const moveCharacter = async (direction, distance = 3) => {
    const rad = direction * (Math.PI / 180);
    const targetX = characterPos[0] + Math.cos(rad) * distance;
    const targetZ = characterPos[2] + Math.sin(rad) * distance;

    setAnimation('walking');
    await new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.02;
        if (progress >= 1) {
          clearInterval(interval);
          resolve();
        }
        setCharacterPos([
          characterPos[0] + (targetX - characterPos[0]) * Math.min(progress, 1),
          0,
          characterPos[2] + (targetZ - characterPos[2]) * Math.min(progress, 1),
        ]);
      }, 16);
    });
    setAnimation('idle');
  };

  const collectNearestTrash = async () => {
    if (trashItems.length === 0) return;

    const nearest = trashItems.reduce((prev, curr, idx) => {
      const distCurr = Math.hypot(
        curr.position[0] - characterPos[0],
        curr.position[2] - characterPos[2]
      );
      const distPrev = Math.hypot(
        prev.position[0] - characterPos[0],
        prev.position[2] - characterPos[2]
      );
      return distCurr < distPrev ? curr : prev;
    });

    const angle = Math.atan2(nearest.position[2] - characterPos[2], nearest.position[0] - characterPos[0]);
    const direction = (angle * 180) / Math.PI;
    await moveCharacter(direction, 2);

    setAnimation('pickup');
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimation('idle');

    setTrashItems(prev => prev.filter(t => t !== nearest));
    setStats(prev => ({ ...prev, trash: prev.trash + 1 }));
    setFeedback(`✓ Chiqindi yig'ildi! (${stats.trash + 1}/${5})`);
  };

  const plantTree = async () => {
    const randX = Math.random() * 10 - 5;
    const randZ = Math.random() * 10 - 5;
    const angle = Math.atan2(randZ - characterPos[2], randX - characterPos[0]);
    const direction = (angle * 180) / Math.PI;

    await moveCharacter(direction, 2);
    setAnimation('planting');
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimation('idle');

    setStats(prev => ({ ...prev, planted: prev.planted + 1 }));
    setFeedback(`✓ Daraxt ekildi! (${stats.planted + 1})`);
  };

  const executeCommand = async (cmd) => {
    setIsExecuting(true);
    cmd = cmd.toLowerCase().trim();

    try {
      if (cmd.includes('yur')) {
        setFeedback('Qahramon yuryapti...');
        await moveCharacter(0, 5);
        setFeedback('Yurish tugadi');
      } else if (cmd.includes('to\'xta') || cmd.includes('toxta')) {
        setAnimation('idle');
        setFeedback('Qahramon to\'xtadi');
      } else if (cmd.includes('chiqindilarni ter') || cmd.includes('chiqindini yig')) {
        setFeedback('Chiqindilar yig\'ilmoqda...');
        while (trashItems.length > 0 && commandQueueRef.current.length === 0) {
          await collectNearestTrash();
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        setFeedback('Hammasini yig\'ildi!');
      } else if (cmd.includes('daraxt ek') || cmd.includes('daraxt eksh')) {
        setFeedback('Daraxt ekilmoqda...');
        await plantTree();
      } else if (cmd.includes('oldinga')) {
        setFeedback('Qahramon oldinga yuryapti...');
        await moveCharacter(0, 3);
        setFeedback('Oldinga yurish tugadi');
      } else if (cmd.includes('orqaga')) {
        setFeedback('Qahramon orqaga yuryapti...');
        await moveCharacter(180, 3);
        setFeedback('Orqaga yurish tugadi');
      } else {
        setFeedback('❌ Buyrugni tushunmadim. "yur", "to\'xta", "chiqindilarni ter", "daraxt ek" ni sinab ko\'ring');
      }
    } catch (error) {
      setFeedback('⚠️ Buyruq bajarilishida xato!');
    }

    setIsExecuting(false);
  };

  const handleCommandSubmit = () => {
    if (command.trim() && !isExecuting) {
      executeCommand(command);
      setCommand('');
    }
  };

  return (
    <div className="eco-game-container">
      <div className="eco-game-canvas">
        <Canvas shadows camera={{ position: [15, 15, 15], fov: 75 }}>
          <GameScene 
            characterPos={characterPos} 
            animation={animation} 
            trashItems={trashItems} 
            onTrashCollect={(idx) => {
              setTrashItems(prev => prev.filter((_, i) => i !== idx));
              setStats(prev => ({ ...prev, trash: prev.trash + 1 }));
            }} 
          />
        </Canvas>
      </div>
      <div className="eco-game-ui eco-game-ui-top">
        <div className="eco-game-hud">
          <div className="hud-stats">
            <div className="stat-item">
              <span className="stat-icon">🗑️</span>
              <span className="stat-label">Chiqindi yig'ildi:</span>
              <span className="stat-value">{stats.trash}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🌳</span>
              <span className="stat-label">Daraxt ekildi:</span>
              <span className="stat-value">{stats.planted}</span>
            </div>
          </div>

          <div className="hud-feedback">
            <div className="feedback-text">{feedback}</div>
          </div>
        </div>

        <div className="eco-game-controls">
          <div className="command-input-group">
            <input
              type="text"
              className="command-input"
              placeholder="Buyruq yozing... (yur, to'xta, chiqindilarni ter, daraxt ek)"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommandSubmit()}
              disabled={isExecuting}
            />
            <button
              className="command-send-btn"
              onClick={handleCommandSubmit}
              disabled={isExecuting}
            >
              {isExecuting ? '⏳' : '▶️ Yuborish'}
            </button>
          </div>

          <div className="command-hints">
            <h4>💡 Maslahat:</h4>
            <div className="hints-grid">
              <button onClick={() => { setCommand('yur'); handleCommandSubmit(); }} className="hint-btn">
                🚶 Yur
              </button>
              <button onClick={() => { setCommand('to\'xta'); handleCommandSubmit(); }} className="hint-btn">
                ⏹️ To'xta
              </button>
              <button onClick={() => { setCommand('chiqindilarni ter'); handleCommandSubmit(); }} className="hint-btn">
                🗑️ Yig'
              </button>
              <button onClick={() => { setCommand('daraxt ek'); handleCommandSubmit(); }} className="hint-btn">
                🌳 Ek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
