import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router";
import LobbyMain from "./lobby/lobbyMain.tsx";
import ChatRoom from "./chatroom/ChatRoom.tsx";
import './main.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <div className={"bg-gray-100"}>
          <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-md">
              <Routes>
                  <Route path="/" element={<LobbyMain/>}/>
                  <Route path="/chat" element={<ChatRoom/>}/>
              </Routes>
          </div>
      </div>
  </BrowserRouter>
);

