import "./App.css";
import { Divider, Steps } from "antd";
import { useState } from "react";
import WorkStepsChecklist from '../WorkStepsChecklist/WorkStepsChecklist';
import MapComponent from "../MapComponent/MapComponent";

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
    content: "Second-content",
  },
  {
    title: "Last",
    content: <WorkStepsChecklist />,
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
