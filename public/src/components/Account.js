import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useClient } from "./Client";

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  const client = useClient();
  const [user, setUser] = useState(null);
  const authenticated = useMemo(() => {
    if (user) {
      return true;
    } else if (user === null) {
      return null;
    } else if (user === false ) {
      return false;
    }
  }, [user]);
  const login = async (email, password) => {
    let ret = await client.authenticate({
      strategy: "local",
      email: email,
      password: password
    });
    console.log(ret);
    return ret;
  }

  const check = useCallback(async (force) => {
    if (client === null) return;
    try {
      const user = await client.reAuthenticate(force);
      setUser(user);
    } catch (err) {
      console.error(err);
      setUser(false);
    }
  }, [client]);

  useEffect(() => {
    if (user) return;
    check();
  }, [user, check]);
  return (
    <AccountContext.Provider value={{
      user,
      authenticated,
      login,
      check
    }}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {

}