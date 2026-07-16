import Home from './home/component/Home'
import Login from './auth/component/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
  <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Login" element={<Login />}></Route>
      </Routes>
  </>
  )
}

export default App
