import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import React from "react";

export default function InvitePage () {

    const [searchParams, setSearchParams] = useSearchParams();
    const navi = useNavigate();
    const chatId = searchParams.get("chatId");


    const IndexPage = () => {
        const getUser: any = sessionStorage.getItem('user');
        if (getUser == null) {
            navi(`/?chatId=${chatId}`);
        }

        if (chatId == null) {
            navi('/');
        }

        if (getUser != null && chatId != null) {
            navi(`/chat?chatId=${chatId}`);
        }
    }

    useEffect(() => {
        IndexPage();
    }, []);

    return (
        <>
            <div>TEST</div>
        </>
    );

}