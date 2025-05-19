import "./App.css";
import { Divider, Steps } from "antd";
import { useState } from "react";
import WorkStepsChecklist from '../WorkStepsChecklist/WorkStepsChecklist';
import MapComponent from "../MapComponent/MapComponent";
import AsphaltCalculator from "../AsphaltCalculator/AsphaltCalculator";
import "./App.css"

const steps = [
  {
    title: "First",
    content: <MapComponent />,
  },
  {
    title: "Second",
    content: <WorkStepsChecklist />,
  },
  {
    title: "Third",
    content: <AsphaltCalculator />
  },
  {
    title: "Last",
    content: ""
  },
];

function App() {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  return (
    <div className="app">
      <Steps
  
        current={current}
        onChange={onChange}
        items={[
          {
            title: "Этап 1",
            description: "Выбор дороги"
          },
          {
            title: "Этап 2",
            description: "Организация выполнения работ"
          },
          {
            title: "Этап 3",
            description: "Выполнение работ"
          },
          {
            title: "Этап 4",
            description: "Контроль качества работ"
          },
        ]}
      />

      <Divider />
      <div className="content-container">{steps[current].content}</div>
    </div>
  );
}

export default App;
