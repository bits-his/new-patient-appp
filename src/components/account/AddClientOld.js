import React, { useState } from 'react';
import BasicInformation from './components/client-form';
import { useEffect } from 'react';
import { apiURL } from '../../redux/actions';
import { useSelector } from 'react-redux';
import Button from '../comp/components/Button';
import { _customNotify, generateReceiptNo } from '../utils/helpers';

function AddClient() {
  const [nextClientID, ] = useState('');
  const [loading, setLoading] = useState(false);
  const facilityId = useSelector((state) => state.facility.info.facility_id);
  const userId = useSelector((state) => state.auth.user.id);

  const [client, setClient] = useState({
    firstname: '',
    surname: '',
    gender: '',
    dob: '',
    deposit: '',
    maritalStatus: '',
    occupation: '',
    onInputChange: '',
    clientAccount: '',
    clientBeneficiaryAcc: '',
    depositAmount: '0',
    modeOfPayment: 'Cash',
  });

  const resetForm = () => {
    setClient({
      firstname: '',
      surname: '',
      gender: '',
      dob: '',
      maritalStatus: '',
      occupation: '',
      deposit: '',
      onInputChange: '',
      depositAmount: '0',
      modeOfPayment: 'Cash',
    });
    getIds();
  };

  const getNextClientID = async () => {
    try {
      const response = await fetch(`${apiURL()}/client/nextId/${facilityId}`);
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  const getNextBeneficiaryId = async (acc) => {
    try {
      const response = await fetch(
        `${apiURL()}/client/nextBeneficiaryId/${acc}/${facilityId}`,
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const getIds = () => {
    getNextClientID()
      .then((d) => {
        // console.log(d);
        if (d.success) {
          let acc = d.results.accountNo;
          setClient((prev) => ({
            ...prev,
            clientAccount: acc,
          }));
          getNextBeneficiaryId(acc)
            .then((d) => {
              // console.log(d);
              if (d.success) {
                let ben = d.results.beneficiaryNo;
                setClient((prev) => ({
                  ...prev,
                  clientBeneficiaryAcc: ben,
                }));
              }
            })
            .catch((err) => {
              console.log(err);
            });
          // console.log(d.results.accountNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getIds();
  }, []);

  const saveNewClient = async (client) => {
    try {
      let response = await fetch(`${apiURL()}/client/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      return response.json();
    } catch (error) {
      return error;
    }
  };

  const saveAsBeneficiary = async (client) => {
    try {
      let response = await fetch(`${apiURL()}/client/beneficiary/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      return response.json();
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // const obj = {
    //   ...client,
    //   id: `${client.clientAccount}-${client.clientBeneficiaryAcc}`,
    //   facId: facilityId,
    // };

    let destination =
      client.modeOfPayment.toLowerCase() === 'cash' ? 'Cash' : 'Bank';

    generateReceiptNo((rec, receiptNo) => {
      const obj = {
        ...client,
        id: `${client.clientAccount}-${client.clientBeneficiaryAcc}`,
        facId: facilityId,
        userId,
        source: 'Deposit',
        destination,
        receiptsn: rec,
        receiptno: receiptNo,
      };
      if (client.clientBeneficiaryAcc === 1) {
        // saveNewClient(obj)
        saveNewClient(obj)
          .then((data) => {
            setLoading(false);
            if (data.success) {
              // _customNotify()
              // clear form
              // alert('Success');
              _customNotify('New Account created for client');
              resetForm();
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        saveAsBeneficiary(obj)
          .then((data) => {
            setLoading(false);
            if (data.success) {
              _customNotify('Beneficiary added to Client Account');
              // clear form
              // alert('Success');
              resetForm();
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    });
  };

  const accNoChange = (acc) => {
    setClient((prev) => ({ ...prev, clientAccount: acc }));
    getNextBeneficiaryId(acc)
      .then((resp) => {
        console.log(resp);
        if (resp.success) {
          setClient((prev) => ({
            ...prev,
            clientBeneficiaryAcc: resp.results.beneficiaryNo,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {/* {client.clientBeneficiaryAcc === 1 ? <h1>NEw Acc</h1> : <h2>New beneficiary</h2>} */}
      {/* {JSON.stringify(client)} */}
      <BasicInformation
        patientHospitalId={nextClientID}
        id_label="Client ID"
        firstname={client.firstname}
        surname={client.surname}
        gender={client.gender}
        dob={client.dob}
        maritalStatus={client.maritalStatus}
        clientAccount={client.clientAccount}
        clientBeneficiaryAcc={client.clientBeneficiaryAcc}
        depositAmount={client.depositAmount}
        occupation={client.occupation}
        modeOfPayment={client.modeOfPayment}
        deposit={client.deposit}
        onInputChange={handleChange}
        accNoChange={accNoChange}
      />

      <div className="d-flex flex-row justify-content-center">
        <Button loading={loading} onClick={handleSubmit}>
          Submit now
        </Button>
      </div>
    </div>
  );
}

export default AddClient;
