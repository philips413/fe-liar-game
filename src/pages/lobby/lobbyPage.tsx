import React, {useState} from "react";
import axios from "axios";

export default function LobbyPage() {
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [chatRoomName, setChatRoomName] = useState<string>('');
    const [chatLimit, setChatLimit] = useState<number>(10);

    const createChatRoom = () => {
        const getUser: any = localStorage.getItem('user');
        const user = JSON.parse(getUser);
        const room = {
            name: chatRoomName,
            limit: chatLimit,
            leader: user.partId
        };
        axios.post(`http://localhost:8080/chat/room`, room);
    }

    const changeRoomName = (e: any) => setChatRoomName(e.target.value);
    const changeRoomLimit = (e: any) => setChatLimit(e.target.value);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen text-center">

                <button
                    type="button"
                    className="btn btn-primary"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="basic-modal"
                    data-overlay="#basic-modal"
                > 방 만들기</button>

                {chatRooms.length === 0 && <h1>방이 없습니다.</h1>}
                {chatRooms.map((room: any) => (
                    <div key={room.id}>
                        <h1>{room.name}</h1>
                        <button>입장하기</button>
                    </div>
                ))}

                <div id="basic-modal"
                    className="overlay modal overlay-open:opacity-100 hidden"
                    role="dialog"
                    tabIndex={-1}
                >
                    <div className="modal-dialog overlay-open:opacity-100" id={"basic-modal"}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">방 만들기</h3>
                                <button
                                    type="button"
                                    className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                                    aria-label="Close"
                                    data-overlay="#basic-modal"
                                >
                                    <span className="icon-[tabler--x] size-4"></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="w-96">
                                    <label
                                        className="label label-text"
                                        htmlFor="defaultInput"
                                    > 방이름 </label>
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
                                    data-overlay="#basic-modal"
                                >
                                    나가기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}