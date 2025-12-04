import { useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { useApiChatListStore } from '../../stores/chatList.api';
import { useLocalChatListStore } from '../../stores/chatList.local';
import ChatList from './ChatList';
import axios from 'axios';

const meta = {
  title: "Visualization/Chat/List",
  component: ChatList,
};

export default meta;

export function APIChatList({agentID, onClick, onDelete}) {

  const [list, setList] = useState([])
  const [agents, setAgents] = useState([])

  useEffect(() => {
    reloadData()
    reloadAgents()
  }, [])

  async function deleteChat(chat) {
    await axios.delete(`https://api-digitalsymphony.ngrok.pizza/api/channel/${chat.id}`)
    await reloadData()
    await onDelete?.(chat)
  }

  async function reloadData() {
    let response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/agent/${agentID}/channels`)
    setList(response.data)
  }

  async function reloadAgents() {
    let response = await axios.get(`https://api-digitalsymphony.ngrok.pizza/api/agents`)
    setAgents(response.data)
  }

  async function addChat(data) {
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/channel`, {sourceAgentID: agentID, destinationAgentID: data.id})
    await reloadData()
  }

  return (
    <ChatList chats={list} onClick={onClick} onDelete={deleteChat} onAdd={addChat} agents={agents}></ChatList>
    
  )
}

export const Local = {
  render() {
    return (
      <ChatList chats={[]} />
    )
  }
};

export const API = {
  render() {
    return (
      <APIChatList agentID={4} />
    )
  }
};