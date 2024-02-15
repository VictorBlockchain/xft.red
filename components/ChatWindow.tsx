// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';
import styles from '../styles/Chatroom.module.css';

const ChatWindow = ({ accountFrom, accountTo, nameTo, open, onClose }: any) => {
const { account, setAccount } = useUser();

  const [message, setMessage]: any = useState('');
  const [messages, setMessages]: any = useState([]);
  const [isOpen, setIsOpen]: any = useState(false);
  const messagesEndRef: any = useRef(null);
  const messageEl: any = useRef(null);
  const esportsSSE = useRef<EventSource | null>(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])

  useEffect(() => {
    // Open the chat window when a message arrives
    setIsOpen(open);
  }, [open]);
  
  useEffect(() => {
    if (isOpen) {
      // Scroll to the bottom when messages change
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  useEffect(() => {
    if (!esportsSSE.current) {
      esportsSSE.current = new EventSource('/api/esports/chatPrivate_sse?sender='+accountFrom+'&receiver='+accountTo);
      
      esportsSSE.current.addEventListener('open', (e: any) => {
        console.log('SSE Connection opened');
      });
      
      esportsSSE.current.addEventListener('message', (e: any) => {
        
        let data = JSON.parse(e.data);
        data = data.reverse()
        setMessages(data);

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
  }, []);
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        
        accountFrom = account
        console.log(accountFrom , accountTo)
        let data_ = {
            message,
            accountFrom,
            accountTo
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/esports/chatPrivate'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // console.log(result)
        if (result.success) {
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
    
    <div className={`chat-window ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <span>{nameTo}</span>
        <button onClick={() => onClose(nameTo)}>Close</button>
      </div>
      <div className="chat-messages" ref={messageEl}>
        <ul className={styles['message-list']}  style={{ height: '280px', overflowY: 'auto' }} ref={messageEl}>
          {messages.map((msg: any, index: any) => (
            <li key={index} className={index % 2 === 0 ? styles['message-even2'] : styles['message-odd2']}>
              <span className="message-user">
                {msg.from==account && (
                    <>
                        <small>you</small>:                     
                    </>
                )}
                {msg.from!=account && (
                    <>
                        <small>{msg.fromName}</small>:                    
                    </>
                )}
                
              </span>
              <span className="message-content">&nbsp;{msg.message}</span>
              <span className="message-time">
                &nbsp;-<small>{new Date(msg.time).toLocaleTimeString()}</small>
              </span>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input">
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
    </div>
  );
};

export default ChatWindow;
