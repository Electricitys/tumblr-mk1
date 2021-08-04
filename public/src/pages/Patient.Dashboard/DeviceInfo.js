import { useEffect, useState } from "react";
import moment from "moment";
import { useAccount } from "../../components/Account";
import { useClient } from "../../components/Client";
import { Box } from "../../components/Grid";
import { DeviceConnection } from "./DeviceConnection";

export const DeviceInfo = ({ selectedSegment, setSelectedSegment }) => {
  const { device } = useAccount();
  const client = useClient();
  const [medicine, setMedicine] = useState({});
  useEffect(() => {
    console.log(device);
    if (device === null) return;
    setMedicine(device["config"]);
  }, [client, device]);
  return (
    <>
      {[{
        type: "ctrl",
        field: "Controller",
        value: "Connected"
      }, {
        type: "lvl3",
        field: "00:00",
        value: "Not set"
      }, {
        type: "lvl2",
        field: "00:00",
        value: "Not set"
      }, {
        type: "lvl1",
        field: "00:00",
        value: "Not set"
      }, {
        type: "tank",
        field: "Tank",
        value: "Full"
      }].map((value, idx) => {
        const selected = selectedSegment === value["type"];
        const med = medicine[value["type"]];
        let str = {
          field: med ? moment(med["time"], "HH:mm").format("hh:mm A") : value["field"],
          value: med ? med["name"] : value["value"]
        }
        return (
          <Box
            key={idx}
            onClick={() => { setSelectedSegment(selected ? null : value["type"]) }}
          >
            <Box sx={{
              fontSize: 1,
              color: selected ? "blue.4" : "gray.4"
            }}>{str["field"]}</Box>
            <Box sx={{ fontSize: 2 }}>
              {value["type"] === "ctrl" ? <DeviceConnection /> : str["value"]}
            </Box>
          </Box>
        )
      })}
    </>
  )
}