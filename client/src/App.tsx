import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopPage from './Portfolio/TopPage';
import "./CSS/TopPage.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} />
      </Routes>
    </Router>
  );
}

export default App;