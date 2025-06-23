import { TaskForm } from './GanttChartTaskForm';

const meta = {
  title: "Visualization/Gantt/Form/Main",
  component: TaskForm,
};

export default meta;

export const Default = {
  render() {
    return <TaskForm open={true} onSubmit={(values) => {
      console.log(values)
    }}></TaskForm>
  }
};