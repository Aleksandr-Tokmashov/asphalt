import "./App.css";
import { Divider, Steps } from "antd";
import { useState } from "react";
import WorkStepsChecklist from '../WorkStepsChecklist/WorkStepsChecklist';
import MapComponent from "../MapComponent/MapComponent";
import "./App.css"
import AsphaltLayingSimulator from "../Road/Road";
import AsphaltLayingForm from "../AsphaltCalculator/AsphaltCalculator";
import Dashboard from "../Dashboard/Dashboard";

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
    content: <AsphaltLayingSimulator />
  },
  {
    title: "Fourth",
    content: <AsphaltLayingForm />
  },
  {
    title: "Last",
    content: <Dashboard />
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
            description:"Выбор дороги"
          
          },
          {
            title: "Этап 2",
            description:"Чек-лист организации выполнения работ"
      
          },
          {
            title: "Этап 3",
            description:"Выбор дороги"
          },
          {
            title: "Этап 4",
            description:"Журнал укладки асфальта"
          },
          {
            title: "Этап 5",
            description:"Контроль качества работ"
          },
        ]}
      />

      <Divider />
      <div className="content-container">{steps[current].content}</div>
    </div>
  );
}

export default App;
