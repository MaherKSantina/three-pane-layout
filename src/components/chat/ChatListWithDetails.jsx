import { useState } from "react"
import SplitPane from "../SplitPane3"
import { APIChatList } from "./ChatList.stories"
import ChatWindow from "./ChatWindow"
import APIChatWindow from "./APIChatWindow"
import axios from "axios"

export default function ChatListWithDetails({agentID}) {
  const [currentItem, setCurrentItem] = useState(null)

  return <SplitPane initialSplit={0.2} left={<APIChatList agentID={agentID} onClick={(chat) => setCurrentItem(chat)} onDelete={(chat) => {
    if(currentItem.id === chat.id) {
        setCurrentItem(null)
    }
  }}></APIChatList>} right={currentItem ? <APIChatWindow channelID={currentItem.id} sourceAgentID={agentID}></APIChatWindow> : <div>Please select a channel</div>}></SplitPane>
}