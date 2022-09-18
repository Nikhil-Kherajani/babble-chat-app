import "./App.css";
import { Routes, Route } from "react-router-dom";
import Join from "./component/Join/Join";
import Chat from "./component/Chat/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Join />} exact></Route>
      <Route path="/chat" element={<Chat />}></Route>
    </Routes>
  );
}

export default App;
