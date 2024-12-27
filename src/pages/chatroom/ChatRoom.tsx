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
            stompClient.current.subscribe(`/sub/chatroom/${chatId}`, (message:any) => {
                const response = JSON.parse(message.body);
                setUsers(response.users)
                questViewer(response.question);
            });
        });
    };

    // 채팅방 정보 가져오기
    const getChatRoomInfo = () => {
        axios.get(`http://localhost:8080/chat/room/${chatId}`)
            .then((response) => {
                setRoomInfo(response.data);
            })
    }

    // 채팅방 입장
    const joinChatRoom = () => {
        axios.post(`http://localhost:8080/chat/room/${chatId}/enter`, {
            chatId: chatId,
            partId: user.partId
        })
    }

    // 채팅방에서 나가기
    const disconnect = () => {
        if(stompClient.current) {
            axios.post(
                `http://localhost:8080/chat/room/${chatId}/exit`, {
                    chatId: chatId,
                    partId: user.partId
                })
            stompClient.current.disconnect();
        }
    }

    const questViewer = list => {
        list.forEach((item: any) => {
            if(item.partId == user.partId) {
                setQuestion(item.message)
            }
        })
    }

    useEffect(() => {
        joinChatRoom();
        getChatRoomInfo();
        connect();
        return () => {
            disconnect();
        }
    }, []);

    const gameStart = () => axios.get(`http://localhost:8080/chat/gameStart/${chatId}`)


    return (
        <>
            {
                roomInfo.leader == user.partId ?
                    <div className={"text-center mb-2"}>
                        <button onClick={gameStart} className={"bg-blue-500 text-white p-2 rounded"}>게임 시작</button>
                    </div>
                    : null
            }
            {/** 참가자 명단  **/}
            <div className={"bg-white shadow p-4 mb-2"}>
                <p className={"text-xl"}>😊참가자 명단</p>
                &emsp;
                {users.map((item, index) => {
                    return (
                        <div key={index}>👤 {item.name}</div>
                    )
                })}
            </div>

            {/** 제시어! **/}
            <div className={"bg-white shadow p-4 mb-2 text-center"}>
                <p className={"text-2xl mb-1"}>제시어</p>
                <p className={"text-4xl"}>🎉 {question}</p>
            </div>
        </>
    );
}