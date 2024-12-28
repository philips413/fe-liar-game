import React, {useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";

export default function MainPage() {

    const [name, setName] = useState('');

    const navigate = useNavigate();

    const doChangeValue = (event: any) => {
        setName(event.target.value);
    }

    const goLobby = async () => {
        const result = await axios.post(`http://localhost:8080/part/create_user`, {
            name: name
        });
        localStorage.setItem('user', JSON.stringify(result.data));
        navigate('/lobby');

    }



    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <div>
                <h1 className="text-2xl font-bold mb-4">라이어게임에 오신걸 환영합니다.!</h1>
                <input type="text" placeholder="참가명을 등록하세요" value={name} onChange={doChangeValue} className="input max-w-sm"/>
                <button className="btn btn-primary" onClick={goLobby}>입장하기</button>
            </div>
        </div>
    )
}