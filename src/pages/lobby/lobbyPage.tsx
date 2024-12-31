import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";


export default function LobbyPage() {
    const [chatRoomName, setChatRoomName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [chatRooms, setChatRooms] = useState<string>("");

    const navigate = useNavigate();

    const createChatRoom = async () => {
        const getUser: any = sessionStorage.getItem('user');
        const user = JSON.parse(getUser);
        const room = {
            name: chatRoomName,
            leader: user.partId
        };
        const result = await axios.post(`/chat/room`, room);
        navigate(`/chat?chatId=${result.data.chatId}`);
    }

    const goChatRoom = () => {
        navigate(`/chat?chatId=${chatRooms}`);
    }

    useEffect(() => {
        const getUser: any = sessionStorage.getItem('user');
        if (getUser == null) {
            navigate('/');
        }
    }, []);

    return (
        <>
            <div className={"flex items-center justify-center font-sam3kr"}>
                <button
                    type="button"
                    className="btn btn-primary mb-2"
                    onClick={() => setIsModalOpen(true)}
                > 방 만들기
                </button>
            </div>
            <div className="divider">OR</div>
            <div className={"flex items-center justify-center font-sam3kr"}>
                <input
                    type="text"
                    placeholder="코드 입력"
                    className="input w-1/3 font-sam3kr"
                    onChange={(e) => setChatRooms(e.target.value)}/> &emsp;
                <button className="btn btn-warning font-sam3kr" onClick={() => goChatRoom()}>😎입장하기</button>
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
                                        value={chatRoomName} onChange={e => setChatRoomName(e.target.value)}
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