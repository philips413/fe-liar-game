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
        if (!name) {
            alert('🚨참가명을 입력하세요.');
            return;
        }
        // 최소 문자의 길이는 3자 이상이여야 합니다.
        if (name.length < 3) {
            alert('🚨참가명은 3자 이상이여야 합니다.');
            return;
        }
        const result = await axios.post(`/part/create_user`, {
            name: name
        });
        localStorage.setItem('user', JSON.stringify(result.data));
        navigate('/lobby');

    }



    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <div>
                <h1 className="text-4xl font-bold mb-4 font-sam3kr">라이어게임을 시작합니다.</h1>
                <input type="text" placeholder="참가명을 등록하세요" value={name} onChange={doChangeValue}
                       className="input w-1/2 font-sam3kr mt-4 mb-1"/> &emsp;
                <button className="btn btn-primary font-sam3kr" onClick={goLobby}>😎 입장하기</button>
            </div>
        </div>
    )
}