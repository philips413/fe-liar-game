import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {useSearchParams} from "react-router-dom";

type Chat = {
    chatId: string;
    leader: number;
    participants: number;
    status: any;
    title: string;
    createdAt: string;
}

export default function ChatRoom() {

    const [searchParams, setSearchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");
    const stompClient = useRef<any>(null);
    const [roomInfo, setRoomInfo] = useState<Chat>({
        chatId: "",
        createdAt: "",
        leader: 0,
        participants: 0,
        status: undefined,
        title: ""
    });

    const [users, setUsers] = useState<any[]>([]);
    const getUser: any = localStorage.getItem('user');
    const user = JSON.parse(getUser);

    const [question, setQuestion] = useState<any[]>([]);

    const connect = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
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
        axios.get(`http://localhost:8080/chat/room/${chatId}`)
            .then((response) => {
                setRoomInfo(response.data);
            })
    }

    const joinChatRoom = () => {
        axios.post(`http://localhost:8080/chat/room/enter`, {
            chatId: chatId,
            partId: user.partId
        })
    }

    const disconnect = () => {
        if(stompClient.current) {
            axios.post(
                `http://localhost:8080/chat/room/exit`, {
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
        return () => {
            disconnect();
        }
    }, []);

    const gameStart = () => axios.get(`http://localhost:8080/chat/gameStart/${chatId}`)

    return (
        <div className={"flex flex-col items-center h-dvh p-4 space-y-4"}>
            <div className={"z-20 fixed top-0 left-0 w-full flex justify-between items-center font-sam3kr bg-white shadow p-4"}>
                <button className={"btn"}>뒤로가기</button>
                <div className={"flex items-center"}>
                    <input type="text" placeholder="코드 입력" className="input w-[150px] font-sam3kr"/> &emsp;
                    <button className="btn-text btn-secondary font-sam3kr">링크복사</button>
                </div>
            </div>
            <div style={{marginTop: "50px"}} className="content-container flex flex-col md:flex-row items-center justify-between mt-20 w-full">
                <div className={"card min-h-[450px] w-full md:w-[350px] m-5"}>
                    <div className="card-body font-sam3kr">
                        <h5 className="card-title mb-2.5">😊참가자 명단</h5>
                        <div className="participant-list overflow-auto max-h-[350px]">
                            {users.map((item, index) => {
                                return (
                                    <p key={index} className="mb-4">👤 {item.name}</p>
                                )
                            })}
                        </div>
                        {roomInfo.leader == user.partId && (
                            <div className={"text-center mt-2 mb-2 font-sam3kr"}>
                                <button onClick={gameStart} className={"bg-blue-500 text-white p-2 rounded"}>게임 시작
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"card min-h-[450px] w-full md:w-[350px] m-5"}>
                    <div className="card-body font-sam3kr text-center">
                        <h5 className="card-title">제시어</h5>
                        <p className="text-4xl">🎉 {question}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}