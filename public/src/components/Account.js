import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useClient } from "./Client";

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const client = useClient();
  const [user, setUser] = useState(null);
  const [device, setDevice] = useState(null);
  const authenticated = useMemo(() => {
    if (user) {
      return true;
    } else if (user === null) {
      return null;
    } else if (user === false) {
      return false;
    }
  }, [user]);

  const login = async (email, password) => {
    let ret = await client.authenticate({
      strategy: "local",
      email: email,
      password: password
    });
    setUser(ret["user"]);
    return ret;
  }

  const check = useCallback(async (force) => {
    try {
      const res = await client.reAuthenticate(force);
      setUser(res["user"]);
    } catch (err) {
      console.error(err);
      setUser(false);
    }
  }, [client]);

  const logout = (force) => {
    return client.logout(force);
  };

  useEffect(() => {
    if (user === null) return;
    const device = {
      id: user["patient.device.id"],
      config: user["patient.device.config"],
      connectionStatus: user["patient.device.connectionStatus"],
      label: user["patient.device.label"],
    };
    setDevice(device);
  }, [user]);

  useEffect(() => {
    if (user) return;
    check();
  }, [user, check]);
  
  return (
    <AccountContext.Provider value={{
      user,
      device,
      authenticated,
      login,
      check,
      logout
    }}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  const account = useContext(AccountContext);
  return account;
}