import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ForgetPassword from "./components/forgetPassword/ForgetPassword";
import ChangePassword from "./components/changePassword/ChangePassword";
import Folder from "./components/folder/Folder";
import NavBar from "./components/navBar/NavBar";
import Note from "./components/note/Note";
import NoteViewOnly from "./components/noteViewOnly/NoteViewOnly";
import useToken from "./customHook/useToken";
import "./App.css"

function App() {
  const { token, setToken, delToken } = useToken();

  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Login setToken={setToken}></Login>} />
        <Route path="/login" element={<Login setToken={setToken}></Login>} />
        <Route path="/register" element={<Register setToken={setToken}></Register>} />
        <Route path="/forgot" element={<ForgetPassword></ForgetPassword>} />
        <Route path="/reset" element={<ChangePassword></ChangePassword>} />
      </Routes>
    );
  }

  return (
    <div className="App">

      <Routes>
        <Route path="/login" element={<Folder></Folder>} />
        <Route path="/forgot" element={<ForgetPassword></ForgetPassword>} />
        <Route path="/reset" element={<ChangePassword></ChangePassword>} />
        <Route path="/" element={<Folder></Folder>} />
        <Route path="/folder" element={<Folder></Folder>} />
        <Route path="/note/*" element={<Note></Note>} />
        <Route path="/note/view/*" element={<NoteViewOnly></NoteViewOnly>} />
        <Route path="/noteviewpage" element={<NoteViewOnly></NoteViewOnly>} />
      </Routes>
    </div>
  );
}

export default App;
