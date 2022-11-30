import React, { useState, useCallback } from "react";
import BasicInformation from "./components/client-form";
import { useEffect } from "react";
import { apiURL } from "../../redux/actions";
import { useSelector } from "react-redux";
// import Button from "../comp/components/Button";
import { _customNotify, generateReceiptNo } from "../utils/helpers";
import moment from "moment";
import CustomButton from "../comp/components/Button";

function AddClient() {
  // eslint-disable-next-line no-unused-vars
  const [nextClientID, setNextClientID] = useState("");
  const [loading, setLoading] = useState(false);
  const facilityId = useSelector((state) => state.facility.info.facility_id);
  const userId = useSelector((state) => state.auth.user.username);

  const [client, setClient] = useState({
    fullname: "",
    gender: "",
    dob: "",
    deposit: "",
    maritalStatus: "",
    occupation: "",
    clientAccount: "",
    clientBeneficiaryAcc: "",
    depositAmount: "0",
    modeOfPayment: "Cash",
    date: moment().format("YYYY-MM-DD"),
    donorNo: "",
    donorName: "",
    address: "",
    contactName: "",
    phone: "",
    email: "",
    website: "",
    // deposite: '',
    contactAddress: "",
    accountType: "Family",
    contact: "self",
    patientId: "",
  });

  //   const [collect, setCollect] = useState('self')
  // const [regType, setRegType] = useState('Family')

  // const handleRadio = (e) =>{
  //   setCollect(e.target.value)
  // }

  const getNextPatientId = async () => {
    try {
      const response = await fetch(
        `${apiURL()}/client/next-patient-id/${facilityId}`
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  const resetForm = () => {
    setClient({
      fullname: "",
      gender: "",
      dob: "",
      maritalStatus: "",
      occupation: "",
      deposit: "",
      onInputChange: "",
      depositAmount: "0",
      modeOfPayment: "Cash",
      accountType: "Family",
      contact: "self",
    });
    getIds();
  };

  const getNextClientID = useCallback(
    async () => {
      try {
        const response = await fetch(`${apiURL()}/client/nextId/${facilityId}`);
        return await response.json();
      } catch (error) {
        return error;
      }
    },
    [facilityId]
  );

  const getNextBeneficiaryId = useCallback(
    async (acc) => {
      try {
        const response = await fetch(
          `${apiURL()}/client/nextBeneficiaryId/${acc}/${facilityId}`
        );
        return await response.json();
      } catch (error) {
        return error;
      }
    },
    [facilityId]
  );

  const handleChange = ({ target: { name, value } }) => {
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const getIds = useCallback(
    () => {
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
      getNextPatientId()
        .then((data) => {
          if (data.success) {
            setClient((p) => ({ ...p, patientId: data.results.id }));
          }
        })
        .catch((err) => console.log(err));
    },
    [getNextClientID, getNextBeneficiaryId]
  );

  useEffect(
    () => {
      getIds();
    },
    [getIds]
  );

  // const saveNewClient = async (client) => {
  //   try {
  //     let response = await fetch(`${apiURL()}/client/new`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(client),
  //     });
  //     return response.json();
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const saveAsBeneficiary = async (client) => {
    try {
      let response = await fetch(`${apiURL()}/client/beneficiary/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      return response.json();
    } catch (error) {
      return error;
    }
  };

  const saveNewClient = async (client) => {
    try {
      // let response = await fetch(`${apiURL()}/lab/client/account/new`, {
      let response = await fetch(`${apiURL()}/org-client/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      client.modeOfPayment.toLowerCase() === "cash" ? "Cash" : "Bank";

    generateReceiptNo((rec, receiptNo) => {
      let [surname, ...firstname] = client.fullname.split(" ");
      const obj = {
        ...client,
        firstname,
        surname,
        id: `${client.clientAccount}-${client.clientBeneficiaryAcc}`,
        facId: facilityId,
        userId,
        source: "Deposit",
        destination,
        receiptsn: rec,
        receiptno: receiptNo,
        description: `Deposit from account ${client.clientAccount}`,
      };
      // if (client.accountType === 'Family') {
      if (client.clientBeneficiaryAcc === 1) {
        // saveNewClient(obj);
        saveNewClient(obj)
          .then((data) => {
            setLoading(false);
            if (data.success) {
              // _customNotify()
              // clear form
              // alert('Success');
              _customNotify("New Account created for client");
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
              _customNotify("Beneficiary added to Client Account");
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
      // }
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

  const formIsValid = client.fullname !== "";

  return (
    <div>
      {/* {client.clientBeneficiaryAcc === 1 ? <h1>NEw Acc</h1> : <h2>New beneficiary</h2>} */}
      {/* {JSON.stringify(client)} */}
      <BasicInformation
        patientHospitalId={nextClientID}
        id_label="Client ID"
        client={client}
        onInputChange={handleChange}
        accNoChange={accNoChange}
        setContactPerson={(person) =>
          setClient((p) => ({ ...p, contact: person }))
        }
        setAccountType={(accType) =>
          setClient((p) => ({
            ...p,
            accountType: accType,
            contact: accType !== "Family" ? "other" : "self",
          }))
        }
        // collect={collect}
        // regType={regType}
        // setRegType={setRegType}
        // handleRadio={handleRadio}
      />

      <div className="d-flex flex-row justify-content-center">
        <CustomButton
          loading={loading}
          disabled={!formIsValid}
          onClick={handleSubmit}
        >
          Submit now
        </CustomButton>
      </div>
    </div>
  );
}

export default AddClient;
