import React, { useEffect, useState } from 'react';
import VideoChatView from './index';
// import ChatSetup from './twilio/ChatSetup';
// import { v4 as uuidV4 } from 'uuid';
// import { useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// import { getPatient } from '../actions/patientsActions';
// import { twilioServer } from '../../../redux/actions';
import { FaTimes } from 'react-icons/fa';
import { Pane, Popover, Button } from 'evergreen-ui';
import { apiURL } from '../../../redux/Api';
import { useHistory, useParams } from 'react-router';

function VideoChat() {
  // const [token, setToken] = useState(null);
  // const [user, setUser] = useState('');
  // const [roomId, setRoomId] = useState('DOCTOR');

  // const generateRoomId = () => {
  //   let rid = uuidV4();
  //   setRoomId(rid);
  // };

//   const match = useRouteMatch();
  const dispatch = useDispatch();
//   let { patientId } = match.params;
const params = useParams()
let id = params.id;
const user = JSON.parse(localStorage.getItem("@@__token"))
//   const doc = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     dispatch(getPatient(patientId));
//   }, []);

  // const handleEndCall = useCallback((event) => {
  //   setToken(null);
  // }, []);
  const [results,setResults]=useState([])
  const getDoctorList = ()=>{
    fetch(`${apiURL}/doctor/all/id?id=${id}`)
    .then((raw) => raw.json())
    .then(({ results }) => {
      setResults(results[0])
    }) .catch((err) => console.log(err));
  }
useEffect(() => {
  // dispatch(getApprovedDoctors());
  getDoctorList()
}, []);
const navigate = useHistory()

  return (
    // <Popover
    //   content={({ close }) => (
        <center >
            <div className="card mt-4">
        <Pane
          width={900}
          height={530}
          // paddingX={40}
          // display="flex"
          // alignItems="center"
          // justifyContent="center"
          // flexDirection="column"
        >

          <div className="d-flex flex-row justify-content-end">
            <button className="btn" onClick={()=>navigate(-1)} >
              <FaTimes className="text-danger" size={22} />
            </button>
          </div>
          <VideoChatView
            displayname={`${results&&results.firstname} ${results&&results.lastname}`.toUpperCase()}
            room={`${results&&results.username}-${user&&user[0].fullName}`.toUpperCase()}
          />
    </Pane>
    </div>
    </center>
    //   )}
    //   shouldCloseOnExternalClick={false}
    // >
    //   {/* <div className='mb-2 d-flex flex-row justify-content-end'> */}
    //   <Button
    //     iconBefore="video"
    //     appearance="primary"
    //     intent="success"
    //     marginBottom={5}
    //   >
    //     Start Video Call
    //   </Button>
    //   {/* </div> */}
    // </Popover>
  );
}

export default VideoChat;
