import Box from '@mui/material/Box';
import Navbar from "./Navbar";
import Chatlist from "./Chatlist";
import Conversation from "./Conversation";

export default function Home() {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '40%', backgroundColor: '#191c1d' }}>
        <Navbar />
        <Chatlist />
      </Box>
      <Box sx={{ width: '60%' }}>
        <Conversation />
      </Box>
    </Box>
  );
}