import React, { useState } from 'react';
import { Card, Checkbox, Input, Button, Form, Image, Typography, Divider, Row, Col } from 'antd';
import asphalt from "../../Images/photo_2025-05-19_13-52-01.jpg"

const { Text } = Typography;

interface FormValues {
  process?: string[];
  pabz?: number;
  width?: number;
  height?: number;
  density?: number;
  workTime?: number;
}

const AsphaltCalculator: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0);
  const [productivity, setProductivity] = useState<number>(0);
  const [form] = Form.useForm<FormValues>();

  const processes: string[] = [
    'Загрузка смеси в перегружатель смеси',
    'Загрузка смеси в бункер асфальтоукладчика перегружателем смеси',
    'Укладка смеси асфальтоукладчиком',
    'Уплотнение',
    'Заключительное уплотнение'
  ];

  const calculate = (): void => {
    form
      .validateFields()
      .then((values: FormValues) => {
        const { pabz, width, height, density, workTime } = values;

        if (!pabz || !width || !height || !density || !workTime) {
          return;
        }

        // Расчет скорости
        const v = pabz / (width * height * density * 60);
        setSpeed(parseFloat(v.toFixed(4)));

        // Расчет сменной производительности
        const kv = 0.8;
        const pu = (workTime * kv * width * v) / 8;
        setProductivity(parseFloat(pu.toFixed(2)));
      })
      .catch(error => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <Card
      title="Расчет параметров асфальтоукладчика"
    >
      <Row gutter={20}>
        <Col span={12} style={{ paddingRight: '20px' }}>
          <Image
            width="100%"
            style={{ margin: '0 auto 20px', display: 'block' }}
            src={asphalt}
            alt="Асфальтоукладчик"
            preview={false}
          />
        </Col>
        <Col span={12} style={{ paddingLeft: '20px' }}>
          <Form<FormValues> form={form} layout="vertical">
            <Form.Item label="Рабочий процесс" name="process">
              <Checkbox.Group>
                <Row>
                  {processes.map((item, index) => (
                    <Col key={index} span={24}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Divider orientation="left">Параметры</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Производительность АБЗ (Пабз), т/ч"
                  name="pabz"
                  rules={[{ required: true, message: 'Введите значение' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ширина полосы (a), м"
                  name="width"
                  rules={[{ required: true, message: 'Введите значение' }]}
                >
                  <Input type="number" step="0.01" min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Проектная толщина слоя (h), м"
                  name="height"
                  rules={[{ required: true, message: 'Введите значение' }]}
                >
                  <Input type="number" step="0.01" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Плотность смеси (p), т/м³"
                  name="density"
                  rules={[{ required: true, message: 'Введите значение' }]}
                >
                  <Input type="number" step="0.01" min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Продолжительность смены (ТУ), мин"
                  name="workTime"
                  rules={[{ required: true, message: 'Введите значение' }]}
                >
                  <Input type="number" min={0} max={1440} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" onClick={calculate}>
                Рассчитать
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>

      {speed > 0 && (
        <Card type="inner" title="Результаты расчета">
          <Text strong>Скорость укладки (V): </Text>
          <Text>{speed} м/мин</Text>
          <br />
          <Text strong>Сменная производительность (ПУ): </Text>
          <Text>{productivity} м²/ч</Text>
        </Card>
      )}
    </Card>
  );
};

export default AsphaltCalculator;
