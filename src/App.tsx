import React, {FC} from 'react';
import './App.css';
import CreateDelievery from './components/create_delievery/CreateDelievery';
import Main from './components/main/Main';
import SignUp from './components/sign_up/SignUp';

const App: FC = () => {
  return (
    <div className="App">
      <CreateDelievery
      />
    </div>
  );
}

export default App;
