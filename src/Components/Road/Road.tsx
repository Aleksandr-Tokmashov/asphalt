import React, { useState, useRef } from 'react';
import './AsphaltLayingSimulator.css';

type MachineryType = 'dumpTruck' | 'loader' | 'paver' | 'roller';

interface Machinery {
  id: string;
  type: MachineryType;
  position: number;
  direction: 'left' | 'right';
  speed: number;
  stripId: string | null;
}

interface RoadStrip {
  id: string;
  width: number;
  progress: number;
  position: number;
}

const AsphaltLayingSimulator: React.FC = () => {
  const [roadStrips, setRoadStrips] = useState<RoadStrip[]>([]);
  const [machineryList, setMachineryList] = useState<Machinery[]>([]);
  const [draggedMachinery, setDraggedMachinery] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const simulationAreaRef = useRef<HTMLDivElement>(null);

  // Добавление полосы дороги
  const addRoadStrip = () => {
    const newStrip: RoadStrip = {
      id: `strip-${Date.now()}`,
      width: 20,
      progress: 0,
      position: 20 + roadStrips.length * 15,
    };
    setRoadStrips([...roadStrips, newStrip]);
  };

  // Удаление полосы дороги
  const removeRoadStrip = (id: string) => {
    setRoadStrips(roadStrips.filter(strip => strip.id !== id));
    setMachineryList(machineryList.filter(m => m.stripId !== id));
  };

  // Добавление техники
  const addMachinery = (type: MachineryType) => {
    if (roadStrips.length === 0) {
      setErrorMessage('Невозможно добавить технику - сначала добавьте дорожную полосу');
      return;
    }

    setErrorMessage(null);
    const newMachinery: Machinery = {
      id: `machinery-${Date.now()}`,
      type,
      position: 0,
      direction: 'right',
      speed: 1 + Math.random() * 2,
      stripId: roadStrips[0].id,
    };
    setMachineryList([...machineryList, newMachinery]);
  };

  // Удаление техники
  const removeMachinery = (id: string) => {
    setMachineryList(machineryList.filter(m => m.id !== id));
  };

  // Разворот техники
  const toggleMachineryDirection = (id: string) => {
    setMachineryList(machineryList.map(m =>
      m.id === id
        ? { ...m, direction: m.direction === 'left' ? 'right' : 'left' }
        : m
    ));
  };

  // Начало перетаскивания
  const handleDragStart = (id: string) => {
    setDraggedMachinery(id);
  };

  // Завершение перетаскивания
  const handleDragEnd = () => {
    setDraggedMachinery(null);
  };

  // Перемещение техники при перетаскивании
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedMachinery || !simulationAreaRef.current) return;

    const areaRect = simulationAreaRef.current.getBoundingClientRect();
    const x = e.clientX - areaRect.left;
    const y = e.clientY - areaRect.top;

    const closestStrip = roadStrips.reduce((closest, strip) => {
      const stripY = (strip.position / 100) * areaRect.height;
      const distance = Math.abs(y - stripY);
      return distance < closest.distance ? { strip, distance } : closest;
    }, { strip: null as RoadStrip | null, distance: Infinity });

    if (!closestStrip.strip) return;

    const newPosition = (x / areaRect.width) * 100;

    setMachineryList(machineryList.map(m =>
      m.id === draggedMachinery
        ? {
            ...m,
            position: Math.max(0, Math.min(100, newPosition)),
            stripId: closestStrip.strip!.id
          }
        : m
    ));
  };

  // Получение SVG для типа техники
  const getMachinerySVG = (type: MachineryType) => {
    switch (type) {
      case 'dumpTruck':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="114" height="56" viewBox="0 0 114 56" fill="none">
            <rect x="28.4615" y="4.76926" width="83.6154" height="46.4615" rx="7" fill="#B47345" stroke="black" strokeWidth="2"/>
            <path d="M45 8H100.923C105.893 8 109.923 12.0294 109.923 17V39.5381C109.923 44.5086 105.893 48.5381 100.923 48.5381H45C40.0294 48.5381 36 44.5086 36 39.5381V17L36.0117 16.5371C36.2526 11.7817 40.1847 8 45 8Z" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <rect x="92" y="52.2308" width="16.1538" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="92" width="16.1538" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="70" y="52.2308" width="16.6923" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="7.53847" y="46.8462" width="15.0769" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="70" width="16.6923" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="7.53847" y="3.76926" width="15.0769" height="3.76923" rx="1.88461" fill="black"/>
            <rect x="1" y="8" width="25.4615" height="37.8461" rx="9" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <rect x="5.3077" y="11.7692" width="21.1538" height="29.7692" rx="9" fill="#CDAA51" stroke="black" strokeWidth="2"/>
            <rect x="23.6154" y="4.76926" width="6.07692" height="46.4615" rx="3.03846" fill="#CC7E48" stroke="black" strokeWidth="2"/>
          </svg>
        );
      case 'loader':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="185" height="101" viewBox="0 0 185 101" fill="none">
            <path d="M24 14V89H1V14H24Z" fill="#B7B3B3" stroke="black" strokeWidth="2"/>
            <rect x="25" y="34" width="27" height="36" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <line x1="29.2647" y1="33" x2="29.2647" y2="71" stroke="black" strokeWidth="2"/>
            <line x1="35.2353" y1="33" x2="35.2353" y2="71" stroke="black" strokeWidth="2"/>
            <line x1="41.2059" y1="33" x2="41.2059" y2="71" stroke="black" strokeWidth="2"/>
            <line x1="47.1765" y1="33" x2="47.1765" y2="71" stroke="black" strokeWidth="2"/>
            <line x1="53.1471" y1="33" x2="53.1471" y2="71" stroke="black" strokeWidth="2"/>
            <rect x="53" y="12" width="74" height="79" fill="#B7AA46" stroke="black" strokeWidth="2"/>
            <rect x="109" y="39" width="75" height="27" fill="#B7AA46" stroke="black" strokeWidth="2"/>
            <rect x="38" width="40" height="16" fill="#373232"/>
            <rect x="38" y="85" width="40" height="16" fill="#373232"/>
            <rect x="108" width="40" height="16" fill="#373232"/>
            <rect x="108" y="85" width="40" height="16" fill="#373232"/>
          </svg>
        );
      case 'paver':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="85" viewBox="0 0 140 85" fill="none">
            <rect x="55" y="6" width="34" height="6" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <rect x="55" y="74" width="34" height="6" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <path d="M47 3V80H1V3H47Z" fill="#579140" stroke="black" strokeWidth="2"/>
            <rect x="6" y="15" width="35" height="58" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <path d="M32 21V60H6V21H32Z" fill="#D9D9D9" stroke="black" strokeWidth="2"/>
            <rect x="27" y="29" width="21" height="27" fill="#D9D9D9"/>
            <line x1="32" y1="29" x2="48" y2="29" stroke="black" strokeWidth="2"/>
            <line x1="32" y1="55" x2="48" y2="55" stroke="black" strokeWidth="2"/>
            <line x1="47" y1="56" x2="47" y2="30" stroke="black" strokeWidth="2"/>
            <rect x="48" y="12" width="48" height="61" fill="#53A693" stroke="black" strokeWidth="2"/>
            <rect x="68" y="1" width="58" height="83" rx="19" fill="#53A693" stroke="black" strokeWidth="2"/>
            <rect x="127" y="21" width="12" height="43" fill="#797272" stroke="black" strokeWidth="2"/>
          </svg>
        );
      case 'roller':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="72" height="43" viewBox="0 0 72 43" fill="none">
            <rect x="1" y="1" width="70" height="41" fill="#ADA4AA" stroke="black" strokeWidth="2"/>
            <rect x="11" y="10" width="50" height="23" fill="#B64C47" stroke="black" strokeWidth="2"/>
            <rect x="24" y="1" width="24" height="41" fill="#EAD04F" stroke="black" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="asphalt-simulator">
      <div className="controls">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="control-group">
          <h3>Дорожные полосы</h3>
          <button onClick={addRoadStrip}>Добавить полосу</button>
          {roadStrips.map(strip => (
            <div key={strip.id} className="strip-control">
              <span>Полоса {strip.id.slice(-4)}</span>
              <button onClick={() => removeRoadStrip(strip.id)}>Удалить</button>
            </div>
          ))}
        </div>

        <div className="control-group">
          <h3>Техника</h3>
          <button onClick={() => addMachinery('dumpTruck')}>Добавить самосвал</button>
          <button onClick={() => addMachinery('loader')}>Добавить перегружатель</button>
          <button onClick={() => addMachinery('paver')}>Добавить асфальтоукладчик</button>
          <button onClick={() => addMachinery('roller')}>Добавить каток</button>

          {machineryList.map(machinery => (
            <div
              key={machinery.id}
              className={`machinery-control ${draggedMachinery === machinery.id ? 'dragged' : ''}`}
              draggable
              onDragStart={() => handleDragStart(machinery.id)}
              onDragEnd={handleDragEnd}
            >
              <span>
                {machinery.type === 'dumpTruck' && 'Самосвал'}
                {machinery.type === 'loader' && 'Перегружатель'}
                {machinery.type === 'paver' && 'Асфальтоукладчик'}
                {machinery.type === 'roller' && 'Каток'}
                {machinery.stripId ? ` (на полосе ${machinery.stripId.slice(-4)})` : ' (не на полосе)'}
              </span>
              <button onClick={() => removeMachinery(machinery.id)}>Удалить</button>
              <button onClick={() => toggleMachineryDirection(machinery.id)}>
                Развернуть
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="simulation-area"
        ref={simulationAreaRef}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
      >
        {roadStrips.map(strip => (
          <div
            key={strip.id}
            className="road-strip"
            style={{
              width: `${strip.width}%`,
              top: `${strip.position}%`,
            }}
          >
            <div
              className="asphalt-progress"
              style={{ width: `${strip.progress}%` }}
            />

          </div>
        ))}

        {machineryList.map(machinery => {
          const strip = roadStrips.find(s => s.id === machinery.stripId);
          const top = strip ? `${strip.position}%` : '50%';

          return (
            <div
              key={machinery.id}
              className={`machinery ${machinery.type} ${draggedMachinery === machinery.id ? 'dragged' : ''}`}
              style={{
                left: `${machinery.position}%`,
                top,
                transform: `translateY(-50%) scaleX(${machinery.direction === 'right' ? 1 : -1})`,
              }}
              draggable
              onDragStart={() => handleDragStart(machinery.id)}
              onDragEnd={handleDragEnd}
            >
              {getMachinerySVG(machinery.type)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AsphaltLayingSimulator;
