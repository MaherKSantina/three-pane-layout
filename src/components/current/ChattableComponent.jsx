import ChatWindow from "../chat/ChatWindow"
import SplitPane from "../SplitPane3"

export default function ChattableComponent({component, messages, onSendMessage, sendMode = 'text', onRefresh, onMessageOptions, shouldFocus, onChange, input}) {
  function CW() {
    return 
  }
  if(component) {
return <SplitPane key={"chat"} initialSplit={0.8} left={component} right={<ChatWindow messages={messages} sendMode={sendMode} onSendMessage={onSendMessage} onRefresh={onRefresh} onMessageOptions={onMessageOptions} shouldFocus={shouldFocus} onChange={onChange} input={input}></ChatWindow>}></SplitPane>
  } else {
    return <ChatWindow messages={messages} sendMode={sendMode} onSendMessage={onSendMessage} onRefresh={onRefresh} onMessageOptions={onMessageOptions} shouldFocus={shouldFocus} onChange={onChange} input={input}></ChatWindow>
  }
}