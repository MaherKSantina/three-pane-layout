import ChatWindow from "../chat/ChatWindow"
import SplitPane from "../SplitPane3"

export default function ChattableComponent({component, messages, onSendMessage, sendMode = 'text', onRefresh, onMessageOptions, shouldFocus}) {
  function CW() {
    return <ChatWindow messages={messages} sendMode={sendMode} onSendMessage={onSendMessage} onRefresh={onRefresh} onMessageOptions={onMessageOptions} shouldFocus={shouldFocus}></ChatWindow>
  }
  if(component) {
return <SplitPane key={"chat"} initialSplit={0.8} left={component} right={<CW />}></SplitPane>
  } else {
    return <CW />
  }
  
}