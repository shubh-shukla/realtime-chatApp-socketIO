import {SocketContext, socket} from "./context/socket";
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Forms/Login";
import Register from "./components/Forms/Register";
import Home from "./components/Home";
import './App.css';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
