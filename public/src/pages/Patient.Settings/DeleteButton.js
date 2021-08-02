import { Button } from "@blueprintjs/core"
import { useHistory } from "react-router-dom";
import { useAccount } from "../../components/Account";
import { useClient } from "../../components/Client"

export const DeleteButton = () => {
  const { user } = useAccount();
  const client = useClient();
  const history = useHistory();
  return (
    <Button
      intent="danger"
      text="Delete Account"
      onClick={async () => {
        const res = await client.service("users").remove(user["id"]);
        console.log(res);
        history.go(0);
      }}
    />
  )
}