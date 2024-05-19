import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const [receivedtime, setReceivedtime] = useState('');

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    // const newSocket = io.connect("https://port-0-whfdjq-rccln2llw366w94.sel5.cloudtype.app");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // 컴포넌트가 언마운트될 때 소켓 연결 해제
    };
  }, []);

  const socketband = () => {
    if(socket) {
      socket.emit('band',{bandId:'곰문곰'});
    }
  }

  const socketSignaling = () => {
    if(socket) {
      socket.emit('signaling',{bandId:'곰문곰'});
    }
  }

  const handlePlayVideo = () => {
    setPlay(prevPlay => !prevPlay)
  };

  useEffect(() =>{
    if(socket) {
      socket.on('signalingRecieved', () =>{
        const timeNow = Date.now();
        console.log('받은 시간' + ' ' + timeNow);
        setReceivedtime(`받은 시간: ${timeNow}`);
        handlePlayVideo();
      })
    }
  },[socket])

  const socketPing = () => {
    if(socket) {
      socket.emit('ping');
    }
  }

  useEffect(() =>{
    if(socket) {
      socket.on('pingRecieved', () =>{
        socket.emit('answer');
      })
    }
  },[socket])

  return(
    <div>
      <h1>Real-Time Data Exchange with RTCDataChannel</h1>
      <button onClick={socketband}>방 입장</button>
      <button onClick={socketSignaling}>시그널링</button>
      <button onClick={socketPing}>딜레이 체크</button>
      <ReactPlayer
        url="https://youtu.be/3l9K9bZIacg?si=h7qdPrrGz-MMen-L"
        playing={play}
      />
      <p>{receivedtime}</p>
    </div>
  )
}

export default App;