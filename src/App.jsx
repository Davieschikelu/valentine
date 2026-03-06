import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreateQuiz from './pages/CreateQuiz';
import Dashboard from './pages/Dashboard';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import CreateLetter from './pages/CreateLetter';
import LetterDashboard from './pages/LetterDashboard';
import LetterView from './pages/LetterView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans bg-valentine-light text-valentine-dark selection:bg-valentine-primary selection:text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/dashboard/:quizId" element={<Dashboard />} />
          <Route path="/quiz/:quizId" element={<TakeQuiz />} />
          <Route path="/result/:attemptId" element={<Result />} />
          
          <Route path="/letter/create" element={<CreateLetter />} />
          <Route path="/letter/dashboard/:letterId" element={<LetterDashboard />} />
          <Route path="/letter/:letterId" element={<LetterView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
