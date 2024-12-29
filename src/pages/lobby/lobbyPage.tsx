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
        const result = await axios.post(`http://localhost:8080/chat/room`, room);
        navigate(`/chat?chatId=${result.data.chatId}`);
    }

    const loadChatRooms = async () => {
        await axios.get(`http://localhost:8080/chat/rooms`)
            .then((response) => {
                setChatRooms([...response.data]);
            });
    }

    const enterChatRoom = (chatId: string) => {
        navigate(`/chat?chatId=${chatId}`);
    }

    useEffect(() => {
        loadChatRooms();
    }, []);

    const changeRoomName = (e: any) => setChatRoomName(e.target.value);
    const changeRoomLimit = (e: any) => setChatLimit(e.target.value);

    return (
        <>
            <div className={"text-right font-sam3kr"}>
                <button
                    type="button"
                    className="btn btn-primary mb-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    방 만들기
                </button>
            </div>
            <div className="flex items-center  font-sam3kr">
                {chatRooms.length === 0 && <h1>방이 없습니다.</h1>}
                {chatRooms.map((room: ChatRoom) => (
                    <div key={room.chatId} className="card sm:max-w-sm mx-2">
                        <div className="card-body">
                            <h5 className="card-title mb-0">{room.title}</h5>
                            <p className="mb-4">현재 참석 인원 : <b>5명</b></p>
                            <div className="card-actions">
                                <a onClick={() => enterChatRoom(room.chatId)} href="#"
                                   className="link link-primary no-underline">입장하기</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
            </>
            );
            }