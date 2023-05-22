import React, {FC} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CreateDelievery from './components/create_delievery/CreateDelievery';
import Main from './components/main/Main';
import SignUp from './components/sign_up/SignUp';

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create-delivery" element={<CreateDelievery />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
