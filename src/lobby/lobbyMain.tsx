import React from "react";

export default function LobbyMain() {

    const samplePosts = [
        { id: 1, title: 'Next.js 13의 새로운 기능', excerpt: 'Next.js 13에서 추가된 주요 기능들을 살펴봅니다.', date: '2023-06-01' },
        { id: 2, title: 'React 18 업데이트 내용', excerpt: 'React 18의 주요 변경사항과 개선된 기능들을 알아봅니다.', date: '2023-05-15' },
        { id: 3, title: 'TypeScript 5.0 소개', excerpt: 'TypeScript 5.0의 새로운 기능과 개선사항을 소개합니다.', date: '2023-04-20' },
    ]


    return (
        <div className="flex flex-col min-h-screen">
            <h1>LOBBY</h1>
            <main className="flex-grow p-4">
                <h1 className="text-2xl font-bold mb-6">최신 기술 블로그 포스트</h1>
                <div className="space-y-8">
                    {samplePosts.map((post) => (
                        <article key={post.id} className="border-b pb-6">
                            <h2 className="text-xl font-semibold mb-2">
                                <div className="text-blue-600 hover:underline">
                                    {post.title}
                                </div>
                            </h2>
                            <p className="text-gray-600 mb-2">{post.excerpt}</p>
                            <span className="text-sm text-gray-500">{post.date}</span>
                        </article>
                    ))}
                </div>
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                <p>&copy; 2023 기술 블로그. All rights reserved.</p>
            </footer>
        </div>
    );
}