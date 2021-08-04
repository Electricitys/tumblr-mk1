import { useEffect, useState } from "react";
import moment from "moment";
import { useAccount } from "../../components/Account"

export const NextAlarm = () => {
  const { device } = useAccount();
  const [value, setValue] = useState("Calculating...");
  useEffect(() => {
    if (device === null) return;
    const listener = setInterval(() => {
      const time = Object.keys(device["config"]).map((key) => {
        return device["config"][key]["time"];
      }).reduce((p, time) => {
        if (p) return p;
        const now = moment();
        const t = moment(time, "HH:mm");
        if (t.isAfter(now)) {
          return `Your next alarm is ${t.format("hh:mm A")}`;
        } else {
          return p;
        }
      }, null);
      setValue(time);
    }, 5000);
    return () => {
      clearInterval(listener);
    }
  }, [device]);
  return value;
}