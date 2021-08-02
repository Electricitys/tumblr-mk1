import { FormGroup, InputGroup } from "@blueprintjs/core"
import { useEffect, useState } from "react";
import { useAccount } from "../../components/Account";
import { useClient } from "../../components/Client"

export const DeviceInfo = () => {
  const { user } = useAccount();
  const client = useClient();
  const [device, setDevice] = useState({
    id: "",
    label: ""
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await client.service("devices").find({
        query: {
          patientId: user["patient.id"]
        }
      });
      setDevice(res["data"][0]);
    }
    fetch();
  }, [user, client]);

  return (
    <FormGroup
      label="Device ID"
    >
      <InputGroup
        defaultValue={device["id"]}
        readOnly={true}
        type="text"
      />
    </FormGroup>
  )
}