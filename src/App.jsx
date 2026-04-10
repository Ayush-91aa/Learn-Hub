import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LessonListPage from './pages/LessonListPage';
import VideoPage from './pages/VideoPage';

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <main style={{ width: '100%' }}>
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
