import React from 'react';

import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import { useSubscription } from './components/Subscription';

const socket = io("http://localhost:3030");
const client = feathers();

client.configure(socketio(socket));

function App() {
  const { isSubscripted } = useSubscription();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {isSubscripted && <div>subscribed</div>}
      </header>
    </div >
  );
}

export default App;
