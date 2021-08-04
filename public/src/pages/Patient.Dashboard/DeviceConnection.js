import { useEffect, useState } from "react"
import { useAccount } from "../../components/Account";
import { useClient } from "../../components/Client";

export const DeviceConnection = () => {
  const { device } = useAccount();
  const [status, setStatus] = useState(false);
  const client = useClient();
  useEffect(() => {
    if (device === null) return;
    setStatus(device["connectionStatus"]);
    client.service("devices").on("patched", (d) => {
      setStatus(d["connectionStatus"]);
    });
  }, [client, device]);
  return status ? "Connected" : "Disconnect";
}