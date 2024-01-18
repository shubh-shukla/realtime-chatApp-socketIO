import { Avatar, Box } from "@mui/material";
import dummyavatar from "../../../../assets/dummyavatar.jpg";

export default function ListItem() {
  return (
    <Box sx={{ width: '100%', height: '72px', borderBottom: '1px solid #3b3838', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '74px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar alt="Avatar" src={dummyavatar} sx={{ width: 50, height: 50 }} />
      </Box>
      <Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
      <Box sx={{ fontSize: '12px' }}>Name</Box>
      <Box sx={{ fontSize: '12px' }}>Last message</Box>
      </Box>
      {/* <Box sx={{ marginLeft: '10px' }}>Time</Box>
      <Box sx={{ marginLeft: '10px' }}>Unread</Box> */}
    </Box>
  );
}