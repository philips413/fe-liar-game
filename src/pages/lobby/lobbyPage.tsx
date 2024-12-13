import React, { useState } from "react";
import axios from "axios";
import Popup from "./popup.tsx";

export default function LobbyPage() {
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const loadChatRooms = async () => {
        const response = await axios.get("http://localhost:8080/chat/rooms");
        setChatRooms(response.data);
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // loadChatRooms();
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

                <div
                    id="basic-modal"
                    className="overlay modal overlay-open:opacity-100 hidden"
                    role="dialog"
                    tabIndex={-1}
                >
                    <div className="modal-dialog overlay-open:opacity-100">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Dialog Title</h3>
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
                                This is some placeholder content to show the scrolling behavior
                                for modals. Instead of repeating the text in the modal, we use an
                                inline style to set a minimum height, thereby extending the length
                                of the overall modal and demonstrating the overflow scrolling.
                                When content becomes longer than the height of the viewport,
                                scrolling will move the modal as needed.
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-soft btn-secondary"
                                    data-overlay="#basic-modal"
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}