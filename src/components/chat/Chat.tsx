import React from 'react'
import ChatHeader from './ChatHeader'
import ChatContainer from './ChatContainer'
import ChatInput from './ChatInput'

const Chat:React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-500 to-purple-400 dark:bg-gray-900">
        <ChatHeader/>
        <ChatContainer/>
        <ChatInput/>
    </div>
  )
}

export default Chat