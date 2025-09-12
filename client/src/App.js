import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import Main from './components/Home';
import OnlineContent from './components/OnlineContent';

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  return isLoggedIn ? children : <Navigate to='/login' />;
}

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path='/' element={<Main />} />
        <Route path='/online-content' element={<OnlineContent />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
