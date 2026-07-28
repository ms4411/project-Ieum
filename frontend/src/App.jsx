import Home from './home/component/Home'
import Login from './auth/component/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './auth/component/SignUp';

function App() {
  return (
  <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
      </Routes>
  </>
  )
}

export default App
