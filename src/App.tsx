// @/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notebook from './pages/Notebook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/notebook" element={<Notebook />} />
      </Routes>
    </Router>
  );
}

export default App;
