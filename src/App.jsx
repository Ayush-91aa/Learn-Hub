import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LessonListPage from './pages/LessonListPage';
import VideoPage from './pages/VideoPage';

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen" style={{ backgroundColor: '#080c14' }}>
                <Navbar />
                <main className="w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/course/:courseId" element={<LessonListPage />} />
                        <Route path="/course/:courseId/lesson/:lessonId" element={<VideoPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
