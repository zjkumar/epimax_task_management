import {BrowserRouter, Route, Routes} from 'react-router-dom'

import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      
       <Routes>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/" element={<Home />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
       </Routes>
    
    </BrowserRouter>
  );
}

export default App;
