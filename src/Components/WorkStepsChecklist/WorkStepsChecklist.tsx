import React, { useState } from 'react';
import { Checkbox, Card, Divider, Typography } from 'antd';
import './WorkStepsChecklist.css';

const { Title, Text } = Typography;

type Step = {
  title: string;
  items: {
    label: string;
    checked: boolean;
  }[];
};

const WorkStepsChecklist: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      title: '1. Организационно-технические мероприятия и работы',
      items: [
        {
          label: 'Выполнение входного контроля утвержденной технической документацией',
          checked: false,
        },
        {
          label: 'Подготовка схемы расположения разбиваемых в натуре осей и других контролируемых параметров и элементов участка для испытаний',
          checked: false,
        },
      ],
    },
    {
      title: '2. Подготовительные строительные работы',
      items: [
        {
          label: 'Обеспечить в соответствии с заданием подъездными путями, электро-, водоснабжением, связью',
          checked: false,
        },
        {
          label: 'Назначить лиц, ответственных за безопасное производство работ, а также их контроль и качество выполнения',
          checked: false,
        },
        {
          label: 'Укомплектовать отряд, ознакомить работников с проектом и технологией производства работ',
          checked: false,
        },
        {
          label: 'Провести инструктаж членов бригады по охране труда',
          checked: false,
        },
        {
          label: 'Подготовить к производству работ машины и механизмы, механизмы и оборудование доставить на объект',
          checked: false,
        },
        {
          label: 'Заправить топливом машины, заполнить водяные баки катков',
          checked: false,
        },
        {
          label: 'Обработать антиадгезионной жидкостью поверхности соприкосновения со смесью',
          checked: false,
        },
        {
          label: 'Обеспечить рабочих ручными машинами, инструментами и средствами индивидуальной защиты',
          checked: false,
        },
        {
          label: 'Доставить в зону работ рабочих, необходимые материалы, приспособления, инвентарь, инструменты и средства для безопасного производства работ',
          checked: false,
        },
      ],
    },
  ]);

  const handleCheckboxChange = (stepIndex: number, itemIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].items[itemIndex].checked = !newSteps[stepIndex].items[itemIndex].checked;
    setSteps(newSteps);
  };

  return (
    <div className="stepsChecklistContainer">
      <Title level={3} className="stepsChecklistTitle">Этапы выполнения работ</Title>
      <Text type="secondary" className="stepsChecklistSubtitle">Отметьте выполненные пункты</Text>
      <Divider className="stepsChecklistDivider" />

      {steps.map((step, stepIndex) => (
        <Card
          key={stepIndex}
          title={step.title}
          className="stepsChecklistCard"
          styles={{
            header: {
              backgroundColor: '#f0f2f5',
              fontWeight: 'bold',
            }
          }}
        >
          {step.items.map((item, itemIndex) => (
            <div key={itemIndex} className="stepsChecklistCheckboxItem">
              <Checkbox
                checked={item.checked}
                onChange={() => handleCheckboxChange(stepIndex, itemIndex)}
              >
                <span className={item.checked ? "stepsChecklistCheckedItem" : ''}>
                  {item.label}
                </span>
              </Checkbox>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default WorkStepsChecklist;
