import { Grid } from '@mui/material';
import { DeepChat } from 'deep-chat-react';

export default function Chat() {
    const history = [
        { role: 'user', text: 'Hey, how are you today?' },
        { role: 'ai', text: 'I am doing very wellaaa!' },
      ];
      return (
        <DeepChat
              demo={true}
              style={{ borderRadius: '10px', height: '500px', width: '500px'}}
              textInput={{ placeholder: { text: 'Welcome to the demo!' } }}
              history={history}
            />
      );
}