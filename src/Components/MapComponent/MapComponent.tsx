import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import { Button, List, Card, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// Иконка для маркера
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MOSCOW_CENTER: [number, number] = [55.751244, 37.618423];

type Point = [number, number];

const MapComponent: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [polygon, setPolygon] = useState<Point[]>([]);

  // Добавление точки при клике на карту
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newPoint: Point = [lat, lng];
        setPoints(prev => [...prev, newPoint]);

        // Если точек больше 2, строим полигон
        if (points.length >= 2) {
          const convexHull = computeConvexHull([...points, newPoint]);
          setPolygon(convexHull);
        }
      },
    });
    return null;
  };

  // Функция для вычисления выпуклой оболочки
  const computeConvexHull = (points: Point[]): Point[] => {
    if (points.length < 3) return points;

    // Сортируем точки по координате X
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

    // Удаляем последние элементы, так как они дублируются
    lowerHull.pop();
    upperHull.pop();

    return [...lowerHull, ...upperHull];
  };

  // Вспомогательная функция для вычисления векторного произведения
  const crossProduct = (a: Point, b: Point, c: Point): number => {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  };

  // Удаление точки
  const removePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    if (newPoints.length >= 3) {
      const convexHull = computeConvexHull(newPoints);
      setPolygon(convexHull);
    } else {
      setPolygon([]);
    }
  };

  // Очистка всех точек
  const clearAll = () => {
    setPoints([]);
    setPolygon([]);
  };

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div style={{ width: '300px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <Typography.Title level={3}>Управление полигоном</Typography.Title>
        <Button
          onClick={clearAll}
          type="primary"
          danger
          style={{ marginBottom: '20px' }}
        >
          Очистить все точки
        </Button>

        <Typography.Title level={4}>Точки полигона:</Typography.Title>
        <List
          dataSource={points}
          renderItem={(point, index) => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Точка {index + 1}: {point[0].toFixed(4)}, {point[1].toFixed(4)}</span>
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => removePoint(index)}
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
          </Card>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={MOSCOW_CENTER}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler />

          {points.map((point, index) => (
            <Marker
              key={index}
              position={point}
              icon={markerIcon}
              eventHandlers={{
                click: () => removePoint(index),
              }}
            >
              <Popup>
                Точка {index + 1}<br />
                {point[0].toFixed(6)}, {point[1].toFixed(6)}<br />
                <Button type="primary" danger onClick={() => removePoint(index)}>Удалить</Button>
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

export default MapComponent;
