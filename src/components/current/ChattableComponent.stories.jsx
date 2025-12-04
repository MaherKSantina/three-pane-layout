import { useCallback, useState } from 'react';
import ChattableComponent from './ChattableComponent';

const meta = {
  component: ChattableComponent,
};

export default meta;

function CC() {
  const [message, setMessage] = useState("")
  const handleTextChange = useCallback((next) => {
      setMessage(next);
    }, []);
  return <ChattableComponent component={<div>halaa</div>} messages={[]} onSendMessage={() => {}} shouldFocus={false} onChange={handleTextChange} input={message}></ChattableComponent>
}

export const Default = {
  render() {
    return <CC></CC>
  }
};