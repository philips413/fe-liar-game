import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {useParams} from "react-router-dom";

export default function ChatRoom() {

    const params = useParams();
    const stompClient = useRef<any>(null);
    const [chatId, setChatId] = useState<string>(params.chatId);
    const [message, setMessage] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const connect = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            console.log("연결되었습니다. !! ")
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
        console.log(chatId);
        let roomNumber = chatId;
        return axios.get(`http://localhost:8080/chat/${roomNumber}`)
            .then(response => {
                setMessage(response.data);
            });
    }
    //
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
            <ul>
                <div>
                    {/*입력 필드*/}
                    <input
                        type={"text"}
                        value={inputValue}
                        className={"input input-primary"}
                        onChange={handleInputChange}
                    />
                    {/*메세지 전송, 메세지 리스트에 추가*/}
                    <button onClick={sendMessage}>입력</button>
                </div>
                {message.map((item, index) => (
                    <div key={index} className={"list-item"}>{item.message}</div>
                ))}

            </ul>
    );
}