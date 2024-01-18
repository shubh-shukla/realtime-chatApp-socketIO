import { Box } from "@mui/material";
import ListItem from "./ListItem";

export default function Chatlist() {
  const chats = new Array(10).fill(0);
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 60px)', overflow: 'auto' }}>
      {chats.map((chat, index) => <ListItem key={index} />)}
    </Box>
  );
}