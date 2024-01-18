import { Box } from "@mui/material";
import { SocketContext } from "../../../../context/socket";
import { useContext } from "react";

export default function Message({ message }) {
  const socket = useContext(SocketContext);
  const { senderId, text } = message;

  const msgSent = senderId === socket.id;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: `${msgSent ? 'flex-end' : 'flex-start'}` }}>
      <Box sx={{ maxWidth: '70%', fontSize: '12px', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', margin: '6px 12px' }}>
        <Box sx={{ backgroundColor: `${msgSent ? '#005c4b' : '#202c33'}`, height: 'max-content', minHeight: '33px', display: 'flex', alignItems: 'center', justifyContent: 'start', paddingLeft: '10px', paddingRight: '10px', borderRadius: '5px' }}>
          <Box sx={{ textAlign: 'left' }}>
            {text}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}