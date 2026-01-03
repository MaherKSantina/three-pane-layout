import axios from "axios"
import { useEffect, useState } from "react"
import ChatWindow from "./ChatWindow"

export default function APIChatWindow({sourceAgentID, channelID, isRequest = false}) {

  const [messages, setMessages] = useState([])
  const [layout, setLayout] = useState("text")
  const [message, setMessage] = useState("")

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
    let data = {
      type: "text",
      text: message
    }
    if(msg) {
      data = msg
    }
    await axios.post(`https://api-digitalsymphony.ngrok.pizza/api/${messagesPath()}/${channelID}/createMessage`, {sourceAgentID, data, isResponse: true})
    setMessage("")
    await reloadData()
    return true
  }

  return (
    <ChatWindow messages={messages} sendMode={layout} input={message} onChange={(m) => {
      setMessage(m)
    }} onSendMessage={addMessage} onRefresh={reloadData}></ChatWindow>
  )
}