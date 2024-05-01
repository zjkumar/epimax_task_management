import {BrowserRouter, Route, Routes} from 'react-router-dom'

import './App.css';
import Home from './components/Home';


function App() {
  return (
    <BrowserRouter>
      <div id='App' className="App">
       <Routes>
       <Route exact path='/'element={<Home />} />
       </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
