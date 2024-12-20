import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router";

type ChatRoom = {
    chatId: string;
    title: string;
    limit: number;
    leader: string;
    createdAt: string;
}

export default function LobbyPage() {
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [chatRoomName, setChatRoomName] = useState<string>('');
    const [chatLimit, setChatLimit] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const createChatRoom = async () => {
        const getUser: any = localStorage.getItem('user');
        const user = JSON.parse(getUser);
        const room = {
            name: chatRoomName,
            limit: chatLimit,
            leader: user.partId
        };
        await axios.post(`http://localhost:8080/chat/room`, room);
        setIsModalOpen(false);
        loadChatRooms();
    }

    const loadChatRooms = async () => {
        await axios.get(`http://localhost:8080/chat/rooms`)
            .then((response) => {
                setChatRooms([...response.data]);
            });
    }

    const enterChatRoom = (chatId: string) => {
        console.log(chatId);
        navigate(`/chat?chatId=${chatId}`);
        // axios.post(`http://localhost:8080/chat/room/${chatId}/enter`);
    }

    useEffect(() => {
        loadChatRooms();
    }, []);

    const changeRoomName = (e: any) => setChatRoomName(e.target.value);
    const changeRoomLimit = (e: any) => setChatLimit(e.target.value);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen text-center">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    방 만들기
                </button>

                {chatRooms.length === 0 && <h1>방이 없습니다.</h1>}
                {chatRooms.map((room: ChatRoom) => (
                    <div key={room.chatId}>
                        <h1>{room.title}</h1>
                        <button onClick={() => enterChatRoom(room.chatId)}>입장하기</button>
                    </div>
                ))}

                {isModalOpen && (
                    <div id="basic-modal" className="overlay modal overlay-open:opacity-100 open opened">
                        <div className="modal-dialog overlay-open:opacity-100">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="modal-title">방 만들기</h3>
                                    <button
                                        type="button"
                                        className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                                        aria-label="Close"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <span className="icon-[tabler--x] size-4"></span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="w-96">
                                        <label className="label label-text" htmlFor="defaultInput"> 방이름 </label>
                                        <input
                                            type="text"
                                            placeholder="라이어 게임 스타트!!"
                                            className="input input-sm"
                                            value={chatRoomName} onChange={changeRoomName}
                                        />
                                    </div>
                                    <div className="w-96">
                                        <label className="label label-text" htmlFor="defaultInput"> 참여인원 </label>
                                        <input
                                            type="number"
                                            placeholder="John Doe"
                                            className="input input-sm"
                                            id="limit"
                                            value={chatLimit}
                                            onChange={changeRoomLimit}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={createChatRoom}
                                    >
                                        만들기
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-soft btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        나가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}