import React from 'react';
import { Card, CardHeader, CardBody, FormGroup } from 'reactstrap';
import PublicWrapper from '../../../routes/PublicWrapper';
import BackButton from '../../landing/BackButton';
import Input from './component/Input';
import PasswordInput from './component/PasswordInput';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { patientSignup } from '../../../redux/actions/auth';
import { useHistory } from 'react-router';
import {useParams} from 'react-router-dom'
import { apiURL } from '../../../redux/actions';

function PatientRegistration() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    retypePassword: '',
    username:"patient0006"
  });
  const [error, setError] = useState('');
  const [loading, toggle] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory()

  const onInputChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    if (
      form.fullname === '' ||
      form.email === '' ||
      form.password === '' ||
      form.retypePassword === ''
    ) {
      setError('Please complete the form');
    } else {
      if (form.password !== form.retypePassword) {
        setError('Passwords do not match');
      } else {
        toggle(true);
        fetch(`${apiURL()}/users/patient/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })
          .then((raw) => raw.json())
          .then((data) => {
            toggle(false);
            if (data.success) {
              console.log(data);
              // setMode('success');
            } else {
              toggle(false);
              if (data.username) {
                setError(data.username);
              }
              console.log('error => ', data);
            }
          })
          .catch((err) => {
            toggle(false);
            console.log('err');
          });
      }
    }
  };
  let params = useParams()
  return (
    <PublicWrapper>
      <div className="offset-md-3 col-md-6 col-lg-6 p-0">
        <BackButton />
        <Card>
          <CardHeader tag="h6">Register as a Patient</CardHeader>
          {JSON.stringify(params.patientId)}
          <CardBody>
            <FormGroup>
              <Input
                name="fullname"
                placeholder="Full name"
                label="Full name"
                onChange={(e) => onInputChange('fullname', e.target.value)}
                value={form.fullname}
                required
              />
              <Input
                name="email"
                placeholder="Email"
                label="Email"
                required
                onChange={(e) => onInputChange('email', e.target.value)}
                value={form.email}
              />
              <PasswordInput
                name="password"
                label="Password"
                required
                onChange={(e) => onInputChange('password', e.target.value)}
                value={form.password}
              />
              <PasswordInput
                name="retypePassword"
                label="Retype Password"
                onChange={(e) =>
                  onInputChange('retypePassword', e.target.value)
                }
                value={form.retypePassword}
              />
            </FormGroup>
            <p className="text-danger text-center">{error}</p>
          </CardBody>
          <div className="card-footer d-flex flex-row justify-content-end">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </Card>
      </div>
    </PublicWrapper>
  );
}

export default PatientRegistration;
