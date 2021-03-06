import { createContext, useContext } from "react";
import io from "socket.io-client";
import feathersjs from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";

const url = new URL(process["env"]["REACT_APP_SERVER_ORIGIN"]);

const socket = io(url.toString());
const feathers = feathersjs();

feathers.configure(socketio(socket));
feathers.configure(authentication({
  storage: localStorage
}));

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  return (
    <ClientContext.Provider value={feathers}>
      {children}
    </ClientContext.Provider>
  )
}

export const useClient = () => {
  const client = useContext(ClientContext);
  return client;
}