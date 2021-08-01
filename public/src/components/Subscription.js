import { createContext, useContext, useEffect, useState } from 'react';
import { useClient } from './Client';
import { urlB64ToUint8Array } from './helper';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const client = useClient();
  const [isSubscripted, setIsSubscripted] = useState(null);
  const subscribe = async () => {
    const serviceWorker = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(process.env["REACT_APP_VAPID_KEY"])
    }
    const pushSubscription = await serviceWorker.pushManager.subscribe(subscribeOptions);
    try {
      await client.service("subscription").create(pushSubscription);
    } catch (err) {
      console.error(err);
    }
  }
  const checkSubscription = async () => {
    try {
      const serviceWorker = await navigator.serviceWorker.ready;
      const subscription = await serviceWorker.pushManager.getSubscription();
      const subscriptionResponse = await client.service("subscription").find({
        query: {
          endpoint: subscription.endpoint
        }
      })
      if (subscriptionResponse.data.length > 0)
        setIsSubscripted(true);
    } catch (err) {
      console.error(err);
      setIsSubscripted(false);
    }
  }

  useEffect(() => {
    if (isSubscripted) return;
    subscribe();
    checkSubscription();
  }, [isSubscripted]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <SubscriptionContext.Provider value={{
      isSubscripted,
      subscribe
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const subscribe = useContext(SubscriptionContext);
  return subscribe;
}