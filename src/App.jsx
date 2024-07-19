import './App.css'
import Dashboard from './pages/Dashboard/dashboard'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard/*' element={<Dashboard />} />
    </Routes>
  )
}

export default App
