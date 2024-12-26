import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {useSearchParams} from "react-router-dom";

export default function ChatRoom() {

    const [searchParams, setSearchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");
    const stompClient = useRef<any>(null);
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
            stompClient.current.subscribe(`/sub/chatroom/${chatId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessage((prevMessage) => [...prevMessage, newMessage]);
            });
        });
    };

    const joinChatRoom = () => {
        const getUser: any = localStorage.getItem('user');
        const user = JSON.parse(getUser);
        axios.post(`http://localhost:8080/chat/room/${chatId}/enter`, {
            chatId: chatId,
            partId: user.partId
        })
    }

    const disconnect = () => {
        if(stompClient.current) {
            stompClient.current.disconnect();
        }
    }

    const fetchMessage = () => {
        let roomNumber = chatId;
        const getUser: any = localStorage.getItem('user');
        const user = JSON.parse(getUser);
        return axios.get(`http://localhost:8080/chat/${roomNumber}?chatId=${roomNumber}&partId=${user.partId}`)
            .then(response => {
                setMessage(response.data);
            });
    }

    //
    useEffect(() => {
        joinChatRoom();
        connect();
        fetchMessage();
        return () => {
            disconnect();
        }
    }, []);



    const sendMessage = () => {
        if (stompClient.current && inputValue) {
            const body = {
                chatId: chatId,
                name: '테스트 1',
                message: inputValue
            }
            stompClient.current.send("/pub/message", {}, JSON.stringify(body));
            setInputValue("");
        }
    }

    const gameStart = () => {
        axios.get(`http://localhost:8080/chat/gameStart/${chatId}`)
    }


    return (
            <ul>
                <div>
                    <button className={"btn btn-primary"} onClick={gameStart}>게임 시작!</button>
                </div>
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