import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import Main from './components/Home';
import OnlineContent from './components/OnlineContent';
import Unauthorized from './components/Unauthorized';
import TopicsPage from './components/Topics';
import NotesPage from './components/Notes';
import PublicTopics from './components/PublicTopics';
import PublicTopicPage from './components/PublicTopicPage';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Calendar from './components/Calendar';

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  return isLoggedIn ? children : <Navigate to='/login' />;
}

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path='/' element={<Main />} />
        <Route path="/subjects/:id/topics" element={<TopicsPage />} />
        <Route path="/topics/:id/notes" element={<NotesPage />} />
        <Route path="/public/topics" element={<PublicTopics />} />
        <Route path="/public/topics/:topicId" element={<PublicTopicPage />} />
        <Route path="/saved" element={<Saved /> } />
        <Route path="/liked" element={<Liked />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
