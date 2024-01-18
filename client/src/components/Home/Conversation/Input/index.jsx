import { useContext, useState } from 'react';
import { Box, FormControl } from "@mui/material";
import { SocketContext } from "../../../../context/socket";

export default function Input() {
  const [message, setMessage] = useState('');
  const socket = useContext(SocketContext);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      socket.emit('message', message);
      console.log('Enter key pressed!');
      
      setMessage('');
    }
  };
  console.log(message);
  return (
    <Box sx={{
      width: 'calc(60% - 2px)',
      height: '40px',
      border: '1px solid #6166aa',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '10px',
      position: 'absolute',
      bottom: '0',
    }}>
      <FormControl sx={{
        width: '100%',
        height: '100%'
      }}>
        <input
          style={{
            width: 'calc(100% - 4px)',
            height: '100%',
            overflow: 'hidden',
            outline: 'none',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#202c33',
            paddingLeft: '10px',
          }}
          type="text"
          placeholder="Type a message" id="message"
          name="message"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown} />
      </FormControl>
    </Box>
  );
}