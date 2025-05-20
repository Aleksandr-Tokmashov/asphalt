import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Card,
  Tabs,
  Row,
  Col,
  Divider,
  Tag,
  Statistic,
  Progress,
  Descriptions,
  message
} from 'antd';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface AsphaltData {
  timestamp: string;
  status: string;
  payload?: any;
}

const AsphaltLogForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('1');
  const [truckData, setTruckData] = useState<AsphaltData[]>([]);
  const [transferData, setTransferData] = useState<AsphaltData[]>([]);
  const [paverData, setPaverData] = useState<AsphaltData[]>([]);
  const [rollerData, setRollerData] = useState<AsphaltData[]>([]);

  const onFinish = (values: any) => {
    const timestamp = dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
    const newEntry = {
      timestamp,
      ...values,
    };

    switch (activeTab) {
      case '1':
        setTruckData([...truckData, newEntry]);
        break;
      case '2':
        setTransferData([...transferData, newEntry]);
        break;
      case '3':
        setPaverData([...paverData, newEntry]);
        break;
      case '4':
        setRollerData([...rollerData, newEntry]);
        break;
    }

    message.success('Данные успешно сохранены');
    form.resetFields();
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Самосвал',
      children: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="loaded_at_plant">Загрузка на заводе</Option>
                  <Option value="in_transit">В пути</Option>
                  <Option value="dumped_to_transfer">Разгрузка</Option>
                  <Option value="returning">Возврат</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['payload', 'asphalt_type']}
                label="Тип асфальта"
              >
                <Select>
                  <Option value="AC-16">AC-16</Option>
                  <Option value="AC-20">AC-20</Option>
                  <Option value="SMA-15">SMA-15</Option>
                  <Option value="BBTM-16">BBTM-16</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['payload', 'weight_kg']}
                label="Вес (кг)"
              >
                <InputNumber min={0} max={30000} step={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['payload', 'initial_temp']}
                label="Температура при загрузке (°C)"
              >
                <InputNumber  max={180} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['payload', 'current_temp']}
                label="Текущая температура (°C)"
              >
                <InputNumber max={160} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="notes"
                label="Примечания"
              >
                <TextArea rows={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Сохранить данные
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Перегружатель',
      children: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="receiving">Прием</Option>
                  <Option value="heating">Подогрев</Option>
                  <Option value="feeding_to_paver">Подача в укладчик</Option>
                  <Option value="maintenance">Обслуживание</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hopper_level_percent"
                label="Уровень бункера (%)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="asphalt_temp"
                label="Температура асфальта (°C)"
              >
                <InputNumber min={0} max={180} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="conveyor_speed_mps"
                label="Скорость конвейера (м/с)"
              >
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="heater_output"
                label="Мощность нагрева (%)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="output_rate_kg_min"
                label="Производительность (кг/мин)"
              >
                <InputNumber min={0} max={1000} step={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Сохранить данные
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: 'Асфальтоукладчик',
      children: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="started_section">Начало участка</Option>
                  <Option value="in_progress">В процессе</Option>
                  <Option value="completed">Завершено</Option>
                  <Option value="paused">Пауза</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="section_id"
                label="ID участка"
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['initial_params', 'thickness_cm']}
                label="Толщина слоя (см)"
              >
                <InputNumber min={2} max={15} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['initial_params', 'temp']}
                label="Температура асфальта (°C)"
              >
                <InputNumber min={0} max={160} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['initial_params', 'speed_m_min']}
                label="Скорость укладки (м/мин)"
              >
                <InputNumber min={0.5} max={10} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['current_params', 'vibration_level']}
                label="Уровень вибрации"
              >
                <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="total_laid_kg"
                label="Всего уложено (кг)"
              >
                <InputNumber min={0} step={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Сохранить данные
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '4',
      label: 'Каток',
      children: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="first_pass">Первый проход</Option>
                  <Option value="second_pass">Второй проход</Option>
                  <Option value="final_pass">Финальный проход</Option>
                  <Option value="qc_check">Контроль качества</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['pass_data', 'speed_kmh']}
                label="Скорость (км/ч)"
              >
                <InputNumber min={1} max={10} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['pass_data', 'vibration_freq_hz']}
                label="Частота вибрации (Гц)"
              >
                <InputNumber min={0} max={60} step={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['pass_data', 'surface_temp']}
                label="Температура поверхности (°C)"
              >
                <InputNumber min={70} max={150} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['pass_data', 'estimated_density']}
                label="Плотность (%)"
              >
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['pass_data', 'qc_status']}
                label="Статус качества"
              >
                <Select>
                  <Option value="approved">Удовлетворительно</Option>
                  <Option value="needs_check">Требуется проверка</Option>
                  <Option value="rejected">Брак</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Примечания"
          >
            <TextArea rows={2} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Сохранить данные
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '5',
      label: 'Дополнительно',
      children: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weather_conditions"
                label="Погодные условия"
              >
                <Select mode="multiple">
                  <Option value="sunny">Солнечно</Option>
                  <Option value="cloudy">Облачно</Option>
                  <Option value="rain">Дождь</Option>
                  <Option value="fog">Туман</Option>
                  <Option value="windy">Ветрено</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="air_temp"
                label="Температура воздуха (°C)"
              >
                <InputNumber min={-30} max={50} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fuel_consumption"
                label="Расход топлива (л)"
              >
                <InputNumber min={0} step={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="operator_name"
                label="Оператор"
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="quality_check"
            label="Проверка качества"
          >
            <Select style={{ width: '100%' }}>
              <Option value="passed">Соответствует</Option>
              <Option value="failed">Не соответствует</Option>
              <Option value="conditional">Условно соответствует</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="photos"
            label="Фотоотчет"
          >
            <Button icon={<UploadOutlined />}>Загрузить фото</Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Сохранить данные
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  const onChangeTab = (key: string) => {
    setActiveTab(key);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Журнал укладки асфальта" bordered={false}>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChangeTab}
          tabPosition="top"
        />
      </Card>

      <Divider orientation="left">Статистика</Divider>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Самосвалы"
              value={truckData.length}
              suffix="записи"
            />
            <Progress percent={(truckData.length / 5) * 100} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Перегружатели"
              value={transferData.length}
              suffix="записи"
            />
            <Progress percent={(transferData.length / 5) * 100} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Укладчики"
              value={paverData.length}
              suffix="записи"
            />
            <Progress percent={(paverData.length / 5) * 100} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Катки"
              value={rollerData.length}
              suffix="записи"
            />
            <Progress percent={(rollerData.length / 5) * 100} showInfo={false} />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Последние записи</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Самосвал" size="small">
            {truckData.length > 0 ? (
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Последний статус">
                  <Tag color="blue">{truckData[truckData.length - 1].status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Температура">
                  {truckData[truckData.length - 1].payload?.current_temp || truckData[truckData.length - 1].payload?.initial_temp} °C
                </Descriptions.Item>
                <Descriptions.Item label="Вес">
                  {truckData[truckData.length - 1].payload?.weight_kg || truckData[truckData.length - 1].payload?.remaining_weight_kg} кг
                </Descriptions.Item>
                <Descriptions.Item label="Время">
                  {dayjs(truckData[truckData.length - 1].timestamp).format('HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Tag color="orange">Нет данных</Tag>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AsphaltLogForm;
