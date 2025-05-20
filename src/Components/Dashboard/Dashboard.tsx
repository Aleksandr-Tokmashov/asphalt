import React from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import {
  LineChartOutlined,
  HeatMapOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';

Chart.register(...registerables);

const { TabPane } = Tabs;

const AsphaltDashboard: React.FC = () => {
  // Увеличенные тестовые данные
  const truckData = [
    {
      timestamp: "2024-05-20T08:00:00Z",
      status: "loaded_at_plant",
      payload: {
        asphalt_type: "AC-16",
        weight_kg: 25000,
        initial_temp: 155.0
      }
    },
    {
      timestamp: "2024-05-20T08:15:00Z",
      status: "in_transit",
      payload: {
        current_temp: 152.3
      }
    },
    {
      timestamp: "2024-05-20T08:30:00Z",
      status: "in_transit",
      payload: {
        current_temp: 149.1
      }
    },
    {
      timestamp: "2024-05-20T08:45:00Z",
      status: "dumped_to_transfer",
      payload: {
        remaining_weight_kg: 500,
        end_temp: 142.7
      }
    },
    {
      timestamp: "2024-05-20T09:00:00Z",
      status: "loaded_at_plant",
      payload: {
        asphalt_type: "AC-20",
        weight_kg: 26000,
        initial_temp: 158.0
      }
    },
    {
      timestamp: "2024-05-20T09:15:00Z",
      status: "in_transit",
      payload: {
        current_temp: 154.2
      }
    },
    {
      timestamp: "2024-05-20T09:30:00Z",
      status: "dumped_to_transfer",
      payload: {
        remaining_weight_kg: 800,
        end_temp: 145.5
      }
    }
  ];

  const transferData = [
    {
      timestamp: "2024-05-20T08:50:00Z",
      status: "receiving",
      hopper_level_percent: 85,
      asphalt_temp: 141.2,
      conveyor_speed_mps: 0.8
    },
    {
      timestamp: "2024-05-20T09:05:00Z",
      status: "heating",
      heater_output: 75,
      asphalt_temp: 145.8,
      output_rate_kg_min: 350
    },
    {
      timestamp: "2024-05-20T09:20:00Z",
      status: "feeding_to_paver",
      asphalt_temp: 143.5,
      output_rate_kg_min: 450
    },
    {
      timestamp: "2024-05-20T09:35:00Z",
      status: "receiving",
      hopper_level_percent: 72,
      asphalt_temp: 142.1,
      conveyor_speed_mps: 0.7
    },
    {
      timestamp: "2024-05-20T09:50:00Z",
      status: "heating",
      heater_output: 80,
      asphalt_temp: 146.3,
      output_rate_kg_min: 400
    },
    {
      timestamp: "2024-05-20T10:05:00Z",
      status: "feeding_to_paver",
      asphalt_temp: 144.2,
      output_rate_kg_min: 500
    }
  ];

  const paverData = [
    {
      timestamp: "2024-05-20T09:25:00Z",
      status: "started_section",
      section_id: "A-12-1",
      initial_params: {
        thickness_cm: 5.3,
        temp: 142.1,
        speed_m_min: 2.1
      }
    },
    {
      timestamp: "2024-05-20T09:40:00Z",
      status: "in_progress",
      current_params: {
        thickness_cm: 5.1,
        temp: 138.7,
        vibration_level: 0.7
      }
    },
    {
      timestamp: "2024-05-20T09:55:00Z",
      status: "completed",
      total_laid_kg: 18500,
      avg_temp: 139.8
    },
    {
      timestamp: "2024-05-20T10:10:00Z",
      status: "started_section",
      section_id: "A-12-2",
      initial_params: {
        thickness_cm: 5.5,
        temp: 143.2,
        speed_m_min: 2.2
      }
    },
    {
      timestamp: "2024-05-20T10:25:00Z",
      status: "in_progress",
      current_params: {
        thickness_cm: 5.3,
        temp: 140.1,
        vibration_level: 0.8
      }
    },
    {
      timestamp: "2024-05-20T10:40:00Z",
      status: "completed",
      total_laid_kg: 19200,
      avg_temp: 141.5
    }
  ];

  const rollerData = [
    {
      timestamp: "2024-05-20T10:00:00Z",
      status: "first_pass",
      pass_data: {
        speed_kmh: 3.5,
        vibration_freq_hz: 45,
        surface_temp: 125.4,
        estimated_density: 87.2
      }
    },
    {
      timestamp: "2024-05-20T10:15:00Z",
      status: "second_pass",
      pass_data: {
        speed_kmh: 4.0,
        surface_temp: 118.3,
        estimated_density: 91.5
      }
    },
    {
      timestamp: "2024-05-20T10:30:00Z",
      status: "final_pass",
      pass_data: {
        speed_kmh: 3.8,
        surface_temp: 110.7,
        estimated_density: 93.8,
        qc_status: "approved"
      }
    },
    {
      timestamp: "2024-05-20T10:45:00Z",
      status: "first_pass",
      pass_data: {
        speed_kmh: 3.6,
        vibration_freq_hz: 47,
        surface_temp: 123.8,
        estimated_density: 88.1
      }
    },
    {
      timestamp: "2024-05-20T11:00:00Z",
      status: "second_pass",
      pass_data: {
        speed_kmh: 4.1,
        surface_temp: 117.5,
        estimated_density: 92.3
      }
    },
    {
      timestamp: "2024-05-20T11:15:00Z",
      status: "final_pass",
      pass_data: {
        speed_kmh: 3.9,
        surface_temp: 109.2,
        estimated_density: 94.5,
        qc_status: "approved"
      }
    }
  ];

  // Подготовка данных для графиков
  const prepareTemperatureData = () => {
    const labels = [
      ...truckData.map(d => moment(d.timestamp).format('HH:mm')),
      ...transferData.map(d => moment(d.timestamp).format('HH:mm')),
      ...paverData.map(d => moment(d.timestamp).format('HH:mm'))
    ];

    const truckTemps = truckData.map(d =>
      d.payload?.current_temp || d.payload?.initial_temp || d.payload?.end_temp || null
    );
    const transferTemps = transferData.map(d => d.asphalt_temp || null);
    const paverTemps = paverData.map(d =>
      d.current_params?.temp || d.initial_params?.temp || d.avg_temp || null
    );

    return {
      labels,
      datasets: [
        {
          label: 'Самосвал',
          data: truckTemps,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        },
        {
          label: 'Перегружатель',
          data: transferTemps,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1
        },
        {
          label: 'Укладчик',
          data: paverTemps,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  const prepareDensityData = () => {
    const passes = rollerData.filter(d => d.pass_data?.estimated_density);
    return {
      labels: passes.map(d => `Проход ${d.status.replace('_pass', '')}`),
      datasets: [
        {
          label: 'Плотность (%)',
          data: passes.map(d => d.pass_data.estimated_density),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const prepareWeightData = () => {
    const weights = truckData.filter(d => d.payload?.weight_kg);
    return {
      labels: weights.map(d => moment(d.timestamp).format('HH:mm')),
      datasets: [
        {
          label: 'Вес груза (кг)',
          data: weights.map(d => d.payload.weight_kg),
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const prepareStatusDistribution = () => {
    const statusCounts = {
      truck: {
        loaded: truckData.filter(d => d.status === 'loaded_at_plant').length,
        transit: truckData.filter(d => d.status === 'in_transit').length,
        dumped: truckData.filter(d => d.status === 'dumped_to_transfer').length
      },
      paver: {
        started: paverData.filter(d => d.status === 'started_section').length,
        progress: paverData.filter(d => d.status === 'in_progress').length,
        completed: paverData.filter(d => d.status === 'completed').length
      }
    };

    return {
      labels: ['Загрузка', 'Транспортировка', 'Разгрузка', 'Начало', 'В процессе', 'Завершено'],
      datasets: [
        {
          label: 'Статусы оборудования',
          data: [
            statusCounts.truck.loaded,
            statusCounts.truck.transit,
            statusCounts.truck.dumped,
            statusCounts.paver.started,
            statusCounts.paver.progress,
            statusCounts.paver.completed
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const prepareOutputRateData = () => {
    const rates = transferData.filter(d => d.output_rate_kg_min);
    return {
      labels: rates.map(d => moment(d.timestamp).format('HH:mm')),
      datasets: [
        {
          label: 'Производительность (кг/мин)',
          data: rates.map(d => d.output_rate_kg_min),
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  // Опции для графиков с уменьшенной высотой
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: '16px' }}>
      <Card title="Аналитика асфальтоукладочных работ" bordered={false}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Температура
              </span>
            }
            key="1"
          >
            <Card>
              <div style={{ height: '500px' }}>
                <Line
                  data={prepareTemperatureData()}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Изменение температуры асфальта по этапам'
                      },
                    },
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'Температура (°C)'
                        },
                        min: 100,
                        max: 160
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Плотность
              </span>
            }
            key="2"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <div style={{ height: '400px' }}>
                    <Bar
                      data={prepareDensityData()}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: 'Плотность покрытия по проходам катка'
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: 'Плотность (%)'
                            },
                            min: 80,
                            max: 100
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <div style={{ height: '400px' }}>
                    <Line
                      data={{
                        labels: rollerData.map(d => moment(d.timestamp).format('HH:mm')),
                        datasets: [{
                          label: 'Температура поверхности',
                          data: rollerData.map(d => d.pass_data?.surface_temp || null),
                          borderColor: 'rgb(255, 159, 64)',
                          backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        }]
                      }}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: 'Остывание поверхности при уплотнении'
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: 'Температура (°C)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <PieChartOutlined />
                Распределение
              </span>
            }
            key="3"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <div style={{ height: '400px' }}>
                    <Pie
                      data={prepareStatusDistribution()}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: 'Распределение статусов оборудования'
                          },
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <div style={{ height: '400px' }}>
                    <Bar
                      data={prepareWeightData()}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            display: true,
                            text: 'Вес перевозимого асфальта'
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: 'Вес (кг)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <HeatMapOutlined />
                Производительность
              </span>
            }
            key="4"
          >
            <Card>
              <div style={{ height: '400px' }}>
                <Line
                  data={prepareOutputRateData()}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Производительность перегружателя'
                      },
                    },
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'кг/мин'
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AsphaltDashboard;
