import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';
import { ChatContext, StoreContext } from '../../contexts/StoreContext';
import { useLocalChatStore } from '../../stores/chat.local';
import { useEffect, useState } from 'react';
import axios from 'axios';

const meta = {
  title: "Visualization/Chat/Window",
  component: ChatWindow,
};

export default meta;

export const Text = {
  render() {
    return (
      <ChatWindow messages={[]} sendMode='text' onSendMessage={(msg) => {
        console.log(msg)
        return true
      }}></ChatWindow>
    )
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

export function APIChatMessage({sourceAgentID, channelID, isRequest = false}) {

  const [messages, setMessages] = useState([])
  const [layout, setLayout] = useState("text")

  useEffect(() => {
    reloadData()
  }, [sourceAgentID, channelID])

  function messagesPath() {
    return isRequest ? "requests" : "channel"
  }

  async function reloadData() {
    let response = await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/${messagesPath()}/${channelID}/messages`, {sourceAgentID})
    setMessages(response.data.messages)
    setLayout(response.data.layout)
  }

  async function addMessage(msg) {
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/${messagesPath()}/${channelID}/createMessage`, {sourceAgentID, data: msg, isResponse: msg.isResponse})
    await reloadData()
    return true
  }

  return (
    <ChatWindow messages={messages} sendMode={layout} onSendMessage={addMessage} onRefresh={reloadData}></ChatWindow>
    
  )
}

export const API4 = {
  render() {
    return (
      <APIChatMessage sourceAgentID={4} channelID={1}></APIChatMessage>
    )
  }
};

export const API20 = {
  render() {
    return (
      <APIChatMessage sourceAgentID={20} channelID={1}></APIChatMessage>
    )
  }
};