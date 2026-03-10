import { useEffect, useState } from 'react';
import JsonLeafTreeViewer from './JSONLeafTreeViewer';
import axios from 'axios';

const meta = {
  component: JsonLeafTreeViewer,
};

export default meta;

function Component() {
  const [data, setData] = useState({})
  async function reloadData() {
    let response = await axios.post(`https://api-digitalsymphony.ngrok.pizza/yaml/json`, {file: "data/ass2/drafts/targetedPerception-assignment-modified-gpt.yaml"})
    setData(response.data)
  }

  useEffect(() => {
    reloadData()
  }, [])

  return <JsonLeafTreeViewer data={data} />;
}

export const Default = {
  render() {
    return <Component></Component>
  },
};