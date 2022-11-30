import { useHistory } from "react-router-dom";
// import live from "./livestreamimage.jpg";
import { JitsiMeeting } from "@jitsi/react-sdk";
// import { HeaderSpace } from "./HeaderSpace";
import { useEffect, useState } from "react";
import { Button, Spinner } from "reactstrap";
import { BsBack } from "react-icons/bs";
// import { Input } fro "reactstrap";

export const Video = () => {
  const [loading, setLoading] = useState(false);
  // const clientId =
  //   "760000377025-jk4dbjjc544afbfvkhv6tj0viv0cpbb1.apps.googleusercontent.com";
  // secretID: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
  const navigate = useHistory();
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);
  const user = JSON.parse(localStorage.getItem("@@__token"))
let name  = user&&user[0].fullName

  return (
    <>
      {/* <HeaderSpace navigate={navigate} /> */}
      <Button color="primary" onClick={()=>{navigate(-1)}}><BsBack /> Back</Button>
      <center className="p-0">
        {/* <img className="h-50 w-75" src={live} alt="logo" /> */}
        {/* <Input type="text"/> */}
        {loading && <Spinner color="primary" />}
        <JitsiMeeting
          // appId={"YOUR_APP_ID"}
          roomName={name}
          // useStaging={true}
          configOverwrite={{
            startWithAudioMuted: true,
            hiddenPremeetingButtons: ["microphone"],
          }}
          getIFrameRef={(node) => (node.style.height = "800px")}
        />
        {/* <button onclick={() => authenticate().then(loadClient)}>
          authorize and load
        </button>
        <button onclick={execute}>execute</button> */}
      </center>
    </>
  );
};