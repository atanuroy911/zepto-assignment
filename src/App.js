import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';


function App() {
  return (
    <Router>
      <nav className="flex justify-center space-x-4 bg-gray-100 p-4">
        <Link className="text-blue-500" to="/">Home</Link>
        {/* <Link className="text-blue-500" to="/about">About</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
