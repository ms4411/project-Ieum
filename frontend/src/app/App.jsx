import { Routes, Route } from 'react-router-dom';
import { Home } from '../features/home';
import { Login, SignUp } from '../features/auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
