import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {useSearchParams} from "react-router-dom";

type Chat = {
    chatId: string;
    leader: number;
    title: string;
    createdAt: string;
}

export default function ChatRoom() {

    const [searchParams, setSearchParams] = useSearchParams();
    let [timer, setTimer] = useState<any>({});
    const chatId = searchParams.get("chatId");
    const stompClient = useRef<any>(null);
    const [roomInfo, setRoomInfo] = useState<Chat>({
        chatId: "",
        createdAt: "",
        leader: 0,
        title: ""
    });

    const [users, setUsers] = useState<any[]>([]);
    const getUser: any = localStorage.getItem('user');
    const user = JSON.parse(getUser);
    const [question, setQuestion] = useState<any[]>([]);

    const connect = () => {
        const socket = new WebSocket("ws://192.168.219.101:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            joinChatRoom();
            getChatRoomInfo();
            stompClient.current.subscribe(`/sub/chatroom/${chatId}`, (message:any) => {
                const response = JSON.parse(message.body);
                setUsers(response.users)
                questViewer(response.question);
            });
        });
    };

    const getChatRoomInfo = () => {
        axios.get(`/chat/room/${chatId}`)
            .then((response) => {
                setRoomInfo(response.data);
            })
    }

    const joinChatRoom = () => {
        axios.post(`/chat/room/enter`, {
            chatId: chatId,
            partId: user.partId
        })
    }

    const disconnect = () => {
        if(stompClient.current) {
            axios.post(
                `/chat/room/exit`, {
                    chatId: chatId,
                    partId: user.partId
                })
            stompClient.current.disconnect();
        }
    }

    const questViewer = (list: any[]) => {
        list.forEach((item: any) => {
            if(item.partId == user.partId) {
                setQuestion(item.message)
            }
        })
    }
    useEffect(() => {
        connect();

        const _timer = setInterval(() => {
            stompClient.current.send(`/pub/status`, {}, JSON.stringify({
                chatId: chatId,
                partId: user.partId,
                message: "alive!!"
            }));
        }, 5000);

        return () => {
            clearInterval(_timer);
            disconnect();
        }
    }, []);

    const gameStart = () => axios.get(`/chat/gameStart/${chatId}`)

    return (
        <div className={"flex flex-col items-center h-dvh p-4 space-y-4"}>
            <div className={"z-20 fixed top-0 left-0 w-full flex justify-between items-center font-sam3kr bg-white shadow p-4"}>
                <button className={"btn btn-sm"}>뒤로가기</button>
                <h1 className={"text-md"}>{roomInfo.title}</h1>
                <button className="btn btn-sm btn-text btn-secondary">링크복사</button>
            </div>
            <div style={{marginTop: "40px"}} className="content-container flex flex-col md:flex-row items-center justify-between mt-20 w-full">
                <div className={"card min-h-[450px] w-full md:w-[350px] m-5 text-center font-sam3kr"}>
                    <div className={"card-header"}>
                        <h5 className="card-title mb-2.5">😊참가자 명단</h5>
                    </div>
                    <div className="card-body">
                        <div className="participant-list overflow-auto max-h-[250px]">
                            {users.map((item, index) => {
                                return (
                                    <p key={index} className="mb-4">👤 {item.name}</p>
                                )
                            })}
                        </div>
                    </div>
                    <div className={"card-footer"}>
                        {roomInfo.leader == user.partId && (
                            <div className={"text-center mt-2 mb-2 font-sam3kr"}>
                                <button onClick={gameStart} className={"bg-blue-500 text-white p-2 rounded"}>게임 시작
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"card min-h-[450px] w-full md:w-[350px] m-5 text-center font-sam3kr "}>
                    <div className={"card-header"}>
                        <h5 className="card-title">제시어</h5>
                    </div>
                    <div className="card-body text-center flex justify-center">
                        <p className="text-4xl">{question}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}