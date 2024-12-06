import './main.css';
import axios from "axios";
import React, {useEffect, useRef, useState} from 'react';
import {Stomp} from "@stomp/stompjs";

function App() {

    const stompClient = useRef<any>(null);
    const [message, setMessage] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const connect = () => {
        const socket = new WebSocket("ws//localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/chatroom/1`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessage((prevMessage) => [...prevMessage, newMessage]);
            });
        });
    };

    const disconnect = () => {
        if(stompClient.current) {
            stompClient.current.disconnect();
        }
    }

    const fetchMessage = () => {
        return axios.get("http://localhost:8080/chat/1")
            .then(response => {
                setMessage(response.data);
            });
    }

    useEffect(() => {
        connect();
        fetchMessage();
        return () => {
            disconnect();
        }
    }, []);



    const sendMessage = () => {
        if (stompClient.current && inputValue) {
            const body = {
                id: 1,
                name: '테스트 1',
                message: inputValue
            }
            stompClient.current.send("/pub/message", {}, JSON.stringify(body));
            setInputValue("");
        }
    }



  return (
    <div className="App">
      <ul>
          <div>
              {/*입력 필드*/}
              <input
                  type={"text"}
                  value={inputValue}
                  className={"input input-primary"}
                  onClick={handleInputChange}
              />
               {/*메세지 전송, 메세지 리스트에 추가*/}
              <button onClick={sendMessage}>입력</button>
          </div>
          {message.map((item, index) => (
            <div key={index} className={"list-item"}>{item.message}</div>
          ))}
      </ul>
    </div>
  );
}

export default App;
