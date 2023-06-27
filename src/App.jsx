import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Hero from './components/Hero';
import Home from './components/Home.jsx';
import Feed from './components/Feed.jsx';

function App() {
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Header/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/" element={<Hero/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/channels/" element={<Home/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/users/:id/servers/:id" element={<Home/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/users/:id" element={<Home/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/users/:id/servers/:id/channels/:id" element={<Home/>}/> 
        </Routes>
        <Routes>
          <Route exact path="/users/:id/servers/:id/Feed" element={<Feed/>}/> 
        </Routes>
      </Router> 
  );
}

export default App;
