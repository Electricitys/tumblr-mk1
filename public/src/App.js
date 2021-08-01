import React from 'react';
import { useAccount } from "./components/Account";
import { Doctor } from './pages/Doctor';
import { Patient } from './pages/Patient';

function App(props) {
  const { user } = useAccount();
  switch (user.role) {
    case "patient":
      return (<Patient {...props} />);
    case "doctor":
      return (<Doctor {...props} />);
    default:
      return (<div>APP</div>);
  }
}

export default App;
