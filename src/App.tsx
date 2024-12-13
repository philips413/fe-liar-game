import {Routes, Route, BrowserRouter, useLocation} from 'react-router-dom';
import MainPage from "./pages/main/MainPage.tsx";
import LobbyPage from "./pages/lobby/lobbyPage.tsx";
import ChatRoom from "./pages/chatroom/ChatRoom.tsx";
import React, {useEffect} from "react";

import { IStaticMethods } from 'flyonui/flyonui';
declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
    }
}

const App:React.FC = () => {

    const {pathname} = useLocation();

    useEffect(() => {
        const loadFlyonui = async () => {
            await import('flyonui/flyonui');

            window.HSStaticMethods.autoInit();
        };

        loadFlyonui();
    }, [pathname]);

    return (
        <div className={"flex items-center justify-center h-screen bg-gray-100"}>
            <div className={"w-full max-w-3xl mx-auto bg-white shadow-md p-4"}>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/lobby" element={<LobbyPage/>}/>
                    <Route path="/chat" element={<ChatRoom/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;