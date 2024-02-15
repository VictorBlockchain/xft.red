import { useEffect, useRef, useState } from 'react';
import ChatWindow from "./ChatWindow";
import styles from '../styles/Chatroom.module.css';

function Chatroom({ account, tab }: any) {
  const [messages, setMessages]: any = useState([]);
  const [message, setMessage]: any = useState('');
  const messagesEndRef: any = useRef(null);
  const messageEl: any = useRef(null);
  const [openGroupChats, setOpenGroupChats]: any = useState([]);
  const [openPrivateChats, setOpenPrivateChats]: any = useState([]);
  const esportsSSE = useRef<EventSource | null>(null);
  const privateSSE = useRef<EventSource | null>(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])
  
  useEffect(() => {
    if (messages) {
      // console.log(messages)
    }
  }, [messages])

  useEffect(() => {
    if (!esportsSSE.current) {
      esportsSSE.current = new EventSource('/api/esports/chatPublic_sse');
      
      esportsSSE.current.addEventListener('open', (e: any) => {
        console.log('SSE Connection opened');
      });
      
      esportsSSE.current.addEventListener('message', (e: any) => {
        let data = JSON.parse(e.data);
        setMessages(data.reverse());
      });
      
      esportsSSE.current.addEventListener('error', function (e: any) {
        console.error('SSE Connection error:', e);
      });
    }
    
    return () => {
      if (esportsSSE.current) {
        esportsSSE.current.close();
        esportsSSE.current = null;
      }
    };
  }, [tab]);
  
  const handleOpenChat = (nameTo: any, accountTo: any) => {
    if (accountTo !== account) {
      // Check if the chat window is already open for private chat
      const isPrivateChatOpen = openPrivateChats.some((chat: any) => chat.nameTo === nameTo);
      
      if (!isPrivateChatOpen) {
        // Add a new private chat to the list of open private chats
        setOpenPrivateChats((prevChats: any) => [...prevChats, { nameTo, accountTo: accountTo }]);
      }
    
    }
  };
  
  const handleCloseChat = (nameTo: any, isPrivate: boolean) => {
    if (isPrivate) {
      // Remove the closed chat from the list of open private chats
      setOpenPrivateChats((prevChats: any) => prevChats.filter((chat: any) => chat.nameTo !== nameTo));
    }
  };
  
  const renderChatWindows = () => {
    const privateChats = openPrivateChats.map((chat: any) => (
      <ChatWindow key={chat.nameTo} accountFrom={account} accountTo={chat.accountTo} nameTo={chat.nameTo} open={true} onClose={() => handleCloseChat(chat.nameTo, true)} />
    ));
    
    const groupChats = openGroupChats.map((chat: any) => (
      <ChatWindow key={chat.nameTo} accountFrom={account} accountTo={chat.accountTo} nameTo={chat.nameTo} open={true} onClose={() => handleCloseChat(chat.nameTo, false)} />
    ));
    
    return [...privateChats, ...groupChats];
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      
      const response = await fetch('/api/esports/chatPublic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, account, }),
      });
      
      if (response.ok) {
        console.log('sent')
        setMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <div className={styles.chatroom}>
      {renderChatWindows()}
        <ul className={styles['message-list']} style={{ height: '800px', overflowY: 'auto' }} ref={messageEl}>
          {messages.map((msg: any, index: any) => (
            <li
              key={index}
              className={index % 2 === 0 ? styles['message-even'] : styles['message-odd']}
            >
              <span className={styles['message-user']}><b><a href="#" onClick={() => handleOpenChat(msg.name, msg.account)}>{msg.name}</a></b>:</span>
              <span className={styles['message-content']}>{msg.message}</span>
              <span className={styles['message-time']}>&nbsp;-{new Date(msg.time).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
        {account && (
                <form onSubmit={handleSubmit} className={styles['input-container']}>
                <input
                  className="cs-form_field w-100"
                  style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                  placeholder="message..."
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
        )}
        {!account && (
          <p className="text-center">connect wallet to chat</p>
        )}
      </div>
    </>
  );
}

export default Chatroom;
