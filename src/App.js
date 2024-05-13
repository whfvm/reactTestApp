import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const [receivedtime, setReceivedtime] = useState('');
  const [countingnumbers, setCountingnumbers] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // const newSocket = io.connect("http://localhost:5000");
    const newSocket = io.connect("https://port-0-whfdjq-rccln2llw366w94.sel5.cloudtype.app");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // 컴포넌트가 언마운트될 때 소켓 연결 해제
      if(intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

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

  const handleCountingNumbers = () => {
    if(intervalId) clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
      setCountingnumbers(prevCountingnumbers => prevCountingnumbers + 1);
    }, 100);
    setIntervalId(newIntervalId);
  }

  useEffect(() =>{
    if(socket) {
      socket.on('signalingRecieved', () =>{
        const timeNow = Date.now();
        console.log('받은 시간' + ' ' + timeNow);
        setReceivedtime(`받은 시간: ${timeNow}`);
        handlePlayVideo();
        handleCountingNumbers();
      })
    }
  },[socket])

  return(
    <div>
      <h1>Real-Time Data Exchange with RTCDataChannel</h1>
      <button onClick={socketband}>방 입장</button>
      <button onClick={socketSignaling}>시그널링</button>
      <ReactPlayer
        url="https://youtu.be/3l9K9bZIacg?si=h7qdPrrGz-MMen-L"
        playing={play}
      />
      <p>{receivedtime}</p>
      <p>{countingnumbers}</p>
    </div>
  )
}

export default App;