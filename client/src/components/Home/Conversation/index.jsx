import { Avatar, Box } from "@mui/material";
import dummyavatar from "../../../assets//dummyavatar.jpg";
import Input from "./Input";
import Message from "./Message";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../context/socket";

export default function Conversation() {
  const [messages, setMessages] = useState([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('a user connected with id: ' + socket.id);
    });

    socket.on('welcome', (msg) => {
      console.log(msg + 'ID: ' + socket.id);
    });

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, [socket]);

  return (
    <Box sx={{ width: '100%', height: '100vh' }}>
      <Box sx={{ width: '100%', height: '60px', borderBottom: '1px solid #3a3d44', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '74px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar alt="Avatar" src={dummyavatar} sx={{ width: 50, height: 50 }} />
        </Box>
        <Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
          <Box sx={{ fontSize: '12px' }}>Person Name</Box>
          <Box sx={{ fontSize: '12px' }}>Online</Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: 'calc(100vh - 120px)', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', height: '100%', overflow: 'auto' }}>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {messages.map((message, index) => <Message key={index} message={message} />)}
            </Box>
          </Box>
        </Box>
        <Input />
      </Box>
    </Box>
  );
}