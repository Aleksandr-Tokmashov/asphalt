import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, List, Card, Typography, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./MapComponent.css"

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Координаты Тверской улицы в Москве
const TVERSKAYA_STREET: [number, number] = [55.860181, 37.602169];

type Point = [number, number];

const MapClickHandler: React.FC<{ addPoint: (point: Point) => void }> = ({ addPoint }) => {
  const map = useMap();

  useMapEvents({
    click: (e) => {
      // Проверяем, доступен ли такой zoom уровень
      if (map.getZoom() > map.getMaxZoom()) {
        message.warning('Достигнут максимальный уровень масштабирования');
        return;
      }
      addPoint([e.latlng.lat, e.latlng.lng]);
    },
    zoomend: () => {
      // Проверяем доступность тайлов при изменении зума
      if (map.getZoom() > map.getMaxZoom()) {
        map.setZoom(map.getMaxZoom());
      }
    }
  });
  return null;
};

const MapComponent: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [polygon, setPolygon] = useState<Point[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Добавление точки
  const addPoint = (newPoint: Point) => {
    setPoints(prev => [...prev, newPoint]);
  };

  // Функция для вычисления выпуклой оболочки
  const computeConvexHull = (points: Point[]): Point[] => {
    if (points.length < 3) return points;

    points.sort((a, b) => a[0] - b[0]);

    const lowerHull: Point[] = [];
    for (let i = 0; i < points.length; i++) {
      while (lowerHull.length >= 2 && crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], points[i]) <= 0) {
        lowerHull.pop();
      }
      lowerHull.push(points[i]);
    }

    const upperHull: Point[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
      while (upperHull.length >= 2 && crossProduct(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], points[i]) <= 0) {
        upperHull.pop();
      }
      upperHull.push(points[i]);
    }

    lowerHull.pop();
    upperHull.pop();

    return [...lowerHull, ...upperHull];
  };

  const crossProduct = (a: Point, b: Point, c: Point): number => {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  };

  const removePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    if (newPoints.length >= 3) {
      setPolygon(computeConvexHull(newPoints));
    } else {
      setPolygon([]);
    }
  };

  const clearAll = () => {
    setPoints([]);
    setPolygon([]);
  };

  // Обновляем полигон при изменении точек
  useEffect(() => {
    if (points.length >= 3) {
      setPolygon(computeConvexHull(points));
    } else {
      setPolygon([]);
    }
  }, [points]);

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div style={{ width: '300px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <Typography.Title level={3}>Управление полигоном</Typography.Title>
        <Button
          onClick={clearAll}
          type="primary"
          danger
          style={{ marginBottom: '20px' }}
          disabled={points.length === 0}
        >
          Очистить все точки
        </Button>

        <Typography.Title level={4}>Точки полигона:</Typography.Title>
        <List
          dataSource={points}
          renderItem={(point, index) => (
            <List.Item>
              <Card size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Точка {index + 1}:<br />{point[0].toFixed(6)}, {point[1].toFixed(6)}</span>
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePoint(index);
                    }}
                    size="small"
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />

        {polygon.length > 0 && (
          <Card style={{ marginTop: '20px', backgroundColor: '#e0f7fa' }}>
            <Typography.Text strong>Полигон построен!</Typography.Text>
            <p>Количество точек: {points.length}</p>
            <p>Площадь: {calculatePolygonArea(polygon).toFixed(2)} м²</p>
          </Card>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={TVERSKAYA_STREET}
          zoom={19}
          minZoom={3}
          maxZoom={20}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapReady(true)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={20}
            maxNativeZoom={19}
          />

          {mapReady && <MapClickHandler addPoint={addPoint} />}

          {points.map((point, index) => (
            <Marker
              key={`marker-${index}`}
              position={point}
              eventHandlers={{
                click: () => removePoint(index),
              }}
            >
              <Popup>
                Точка {index + 1}<br />
                {point[0].toFixed(6)}, {point[1].toFixed(6)}<br />
                <Button 
                  type="primary" 
                  danger 
                  onClick={(e) => {
                    e.stopPropagation();
                    removePoint(index);
                  }}
                  size="small"
                >
                  Удалить
                </Button>
              </Popup>
            </Marker>
          ))}

          {polygon.length > 0 && (
            <Polygon
              positions={polygon}
              pathOptions={{ color: 'blue', fillOpacity: 0.4 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

// Функция для расчета площади полигона (в квадратных метрах)
function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  const radius = 6371000; // Радиус Земли в метрах
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[j];
    
    const x1 = lng1 * Math.PI / 180 * radius * Math.cos(lat1 * Math.PI / 180);
    const y1 = lat1 * Math.PI / 180 * radius;
    const x2 = lng2 * Math.PI / 180 * radius * Math.cos(lat2 * Math.PI / 180);
    const y2 = lat2 * Math.PI / 180 * radius;
    
    area += x1 * y2 - x2 * y1;
  }
  
  return Math.abs(area / 2);
}

export default MapComponent;