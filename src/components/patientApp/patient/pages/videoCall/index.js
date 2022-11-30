import { JitsiMeeting } from '@jitsi/react-sdk';
import React, { useState } from 'react';
import Jitsi from 'react-jitsi';
import { Spinner } from 'reactstrap';
import { apiURL, _postApi } from '../../../redux/Api';
// import Loading from '../../../comp/components/Loading';

const JitsiVideo = ({ room = '', displayname = '' }) => {
  // const [displayName, setDisplayName] = useState('');
  // const [roomName, setRoomName] = useState('');
  // const [password, setPassword] = useState('');
  const [onCall, setOnCall] = useState(false);
  const user = JSON.parse(localStorage.getItem("@@__token"))
  const handleSubmit = ()=>{
    _postApi(
        `${apiURL}/auth/patient/notification?query_type=insert&userId=${user&&user[0].userId}&dr_name=${user&&user[0].fullName}&message=${`https://meet.jit.si/${room}`}`,
        {},
          (data) => {
             if (data.success) {
               alert("sucess");
            //    navigate(-1);
             }
           },
    )

  }
  return onCall ? (
    <JitsiMeeting
          // appId={"YOUR_APP_ID"}
          roomName={room}
          // useStaging={true}
          value={room}
          displayName={displayname}
          configOverwrite={{
            startWithAudioMuted: true,
            hiddenPremeetingButtons: ["microphone"],
          }}
          getIFrameRef={(node) => (node.style.height = "500px")}
        />
    // <Jitsi
    // // config={{startAudioOnly: true, enableClosePage: true}}
    // // interfaceConfig={{ filmStripOnly: true }}
    //   roomName={room}
    //   displayName={displayname}
    //   // password={password}
    //   loadingComponent={() => <Spinner color="primary" />}
    //   onAPILoad={(JitsiMeetAPI) => console.log('Good Morning everyone!')}
    // />
  ) : (
    <div className="d-flex flex-column align-items-center p-3">
      <h6>Meeting Details</h6>
      <p className="form-control text-center mt-2">Meeting ID: {room}</p>
      <p className="form-control text-center mt-2">
        Display Name: {displayname}
      </p>
      {/* <input
        type="text"
        className="form-control"
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="text"
        className="form-control"
        placeholder="Your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      /> */}
      <div>
        <button className="btn">Send Invitation Message</button>
        <button className="btn btn-success" onClick={() => {setOnCall(true);handleSubmit()}}>
          {' '}
          Let&apos;s start!
        </button>
      </div>
    </div>
  );
};

export default JitsiVideo;
