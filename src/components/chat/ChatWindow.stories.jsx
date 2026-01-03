import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';
import { ChatContext, StoreContext } from '../../contexts/StoreContext';
import { useLocalChatStore } from '../../stores/chat.local';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import APIChatWindow from './APIChatWindow';

const meta = {
  title: "Visualization/Chat/Window",
  component: ChatWindow,
};

export default meta;

function CW() {
  const [message, setMessage] = useState("")
  const handleTextChange = useCallback((next) => {
      setMessage(next);
    }, []);
return (
      <ChatWindow input={message} onChange={handleTextChange} messages={[{type: "text", text: "halaa", isResponse: true}]} sendMode='text' onSendMessage={() => {
      }}></ChatWindow>
    )
}

export const Text = {
  render() {
    return <CW></CW>
  }
};


export const Button = {
  render() {
    return (
      <ChatWindow messages={[]} sendMode='button' onSendMessage={(msg) => {
        console.log(msg)
        return true
      }}></ChatWindow>
    )
  }
};

export const Chat = {
  render() {
    return (
      <ChatWindow messages={[
        {
          text: "Test text",
          senderIsSelf: true,
          timestamp: Date.now()
        },
        {
          text: "Test text",
          senderIsSelf: false,
          timestamp: Date.now()
        }
      ]} sendMode='button' onSendMessage={(msg) => {
        console.log(msg)
        return true
      }}></ChatWindow>
    )
  }
};


export const StressTest = {
  render() {
    let messages = []
    for(let i = 0; i < 10000; i++) {
      messages.push({
        text: `This is message of index ${i}`,
        timestamp: Date.now()
      })
    }
    return (
      <ChatWindow messages={messages} sendMode='button' onSendMessage={(msg) => {
        console.log(msg)
        return true
      }}></ChatWindow>
    )
  }
};

export const API4 = {
  render() {
    return (
      <APIChatWindow sourceAgentID={4} channelID={1}></APIChatWindow>
    )
  }
};

export const API20 = {
  render() {
    return (
      <APIChatWindow sourceAgentID={20} channelID={1}></APIChatWindow>
    )
  }
};