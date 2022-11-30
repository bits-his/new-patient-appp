import React, { useState } from 'react'
import { Checkbox, CustomButton } from '../../../components/UI'
import LoginImage from '../../../assets/images/login.png'
import Logo from '../../../assets/images/logo.png'
import { Form, FormGroup, Input, Label, Row } from 'reactstrap'
import './Login.css'
import { useDispatch } from 'react-redux'
import { login } from '../../../redux/action/auth'
import { useHistory } from 'react-router'
import { _customNotify, _warningNotify } from '../../utils/helpers'
import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
import { SAVE_PATIENT_TO_LIST } from '../../doc_dash/types'

// import _customNotification from "../../../components/UI/_customNotification";
// import { useToasts } from "react-toast-notifications";
export const Login = () => {
  const navigate = useHistory()
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  // const { addToast } = useToasts();
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    dispatch(
      login(
        { email: form.email, password: form.password },
        (data) => {
          console.log(data)
          if (data && data.success) {
            setLoading(false)
            _customNotify('Successfully Saved')
            navigate('/me/pharmacy/dashboard')

            _fetchApi2(
              `${apiURL()}/get/patients?query_type=all`,
              (data) => {
                if (data.success) {
                  dispatch({ type: SAVE_PATIENT_TO_LIST, payload: data.results })

                }
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            if (data) {
              _customNotify(JSON.stringify(Object.values(data)[0]))
              setLoading(false)
            } else {
              setLoading(false)
              _warningNotify('An error occured!')
            }
          }
        },
        (err) => {
          _warningNotify(
            JSON.stringify(Object.values(err)[0]) || 'error occured',
          )
          setLoading(false)
          console.log('err', err)
        },
      ),
    )
  }
  return (
    <div className="m-0 row" style={{ fontFamily: 'sans-serif' }}>
      <div className="bubbles">
        <div className="bubble" />
        <div className="bubble1" />
        <div className="bubble2" />
        <div className="bubble3" />
      </div>
      <div className="col-md-7 m-0 p-0">
        <div
          src={LoginImage}
          alt="login"
          style={{
            height: '100vh',
            backgroundImage: `url(${LoginImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      </div>
      <div className="d-flex flex-column justify-content-x  border-0 card col-md-5  ">
        <div
          style={{
            height: '40vh',
          }}
          className="ml-2"
        >
          <div className="text-center">
            <img
              src={Logo}
              alt="logo"
              className="text-center"
              style={{ width: '30vh', height: '6vh', marginTop: '13vh' }}
            />
          </div>
          <div
            className="card mt-4 shadow-sm  p-4 bg-transparent rounded "
            style={{ backgroundColor: 'red' }}
          >
            <span
              className="text-center"
              style={{ fontWeight: 'bold', fontSize: '30px' }}
            >
              Welcome Back!
            </span>
            <Form onSubmit={handleSubmit}>
              <Row>
                <FormGroup>
                  <Label style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Username or Phone
                  </Label>
                  <Input
                    className="p-2 py-2 shadow-sm form-control border-primary"
                    style={{
                      fontSize: '15px',
                      borderWidth: '2px',
                    }}
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={({ target: { name, value } }) => {
                      setForm((p) => ({ ...p, [name]: value }))
                    }}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Label style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Password
                    </Label>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: '16px' }}
                      className="text-primary"
                    >
                      Forgot Password?
                    </Label>
                  </div>
                  <Input
                    className="p-2 py-2 shadow-sm form-control border-primary"
                    style={{
                      fontSize: '15px',
                      borderWidth: '2px',
                    }}
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={({ target: { name, value } }) => {
                      setForm((p) => ({ ...p, [name]: value }))
                    }}
                  />
                </FormGroup>
              </Row>
              <Row style={{ margin: '2px' }} className="mt-1 mb-2">
                <CustomButton
                  loading={loading}
                  className="shadow-sm"
                  type="submit"
                >
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Sign In
                  </span>
                </CustomButton>
              </Row>
              <Row>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Checkbox
                    label={
                      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Remember me
                      </span>
                    }
                  />
                  <Label
                    style={{ fontWeight: 'bold', fontSize: '16px' }}
                    className="text-primary"
                  >
                    Need Help?
                  </Label>
                </div>
              </Row>
            </Form>
          </div>

          <div className="card shadow-sm p-3  bg-white rounded mt-2">
            <div
              className="text-center"
              style={{ fontWeight: 'bold', fontSize: '16px' }}
            >
              Or{' '}
              <Label
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/sign-up')}
              >
                click here
              </Label>{' '}
              to create your free account.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
