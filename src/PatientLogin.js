import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {useHistory } from 'react-router-dom'
// import Navbars from '../navbar/Navbar'
// import { apiURL, _postApi } from '../redux/Api'
// import "./hey"
import "./login.css"
import { apiURL } from './redux/actions'
import { _postApi } from './redux/actions/api'
import { LOGIN } from './redux/actions/types'
function PLogin() {
    const navigate = useHistory()
    const [login,setLogin]=useState({
        email:"",
        password:""
    })

    const handleChange = ({target:{name,value}}) =>{
        setLogin((p)=>({...p, [name]:value}))
    }
    const dispatch =useDispatch()

    const handleSubmit = ()=>{
        console.log(login)
        _postApi(
            `${apiURL()}/hello/new-patient-login`,
            login,
              (data) => {
                console.log(data)
                 if (data.success) {
                   alert("sucess");
                   const newData = data.results[0]
                   console.log("hhhhhhhhhhhhhh",newData)
                   dispatch({ type: LOGIN, payload: newData });
                   localStorage.setItem("@@__token",JSON.stringify(newData));
                   
                   navigate.push("/me/patient/home");
                 }else(
                    alert("an error occured")
                 )
               },
        )
    }
  return (
    <div className='bodys'>
  {/* <Navbars /> */}
   
    <div className="login-page">
  <div className="form">
    {/* {JSON.stringify(login)} */}
    <div className="login-forms">
      <input type="email" placeholder="Email" name="email" value={login.email} onChange={handleChange}/>
      <input type="password" placeholder="password" name="password" value={login.password} onChange={handleChange} />
      <button onClick={handleSubmit}>login</button>
      <p className="message">Not registered? <span onClick={()=>navigate("/signup")} style={{cursor:"pointer",color:"blue"}}><a>Create an account</a></span></p>
    </div>
  </div>text
</div>
</div>
  )
}

export default PLogin