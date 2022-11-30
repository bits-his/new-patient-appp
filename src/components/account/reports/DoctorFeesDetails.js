import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { CardBody, CardHeader } from "reactstrap";
import Card from "reactstrap/lib/Card";
import { useQuery } from "../../../hooks";
import { apiURL } from "../../../redux/actions";
import { _fetchApi, _fetchApi2 } from "../../../redux/actions/api";
import AutoComplete from "../../comp/components/AutoComplete";
import BackButton from "../../comp/components/BackButton";
import CustomButton from "../../comp/components/Button";
import CustomTable from "../../comp/components/CustomTable";
import DaterangeSelector from "../../comp/components/DaterangeSelector";
import Loading from "../../comp/components/Loading";
import PrintWrapper from "../../comp/components/print/PrintWrapper";
import { formatNumber } from "../../utils/helpers";

function DoctorFeesDetails() {
  const today = moment().format("YYYY-MM-DD");
  const monthStart = moment()
    .startOf("month")
    .format("YYYY-MM-DD");
  const { docId } = useParams();
  const query = useQuery();
  const doctor_name = query.get("doctor_name");
  const date_from = query.get("date_from");
  const date_to = query.get("date_to");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docList, setDocList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({
    username: docId,
    firstname: doctor_name,
    lastname: "",
  });
  const [txList, setTxList] = useState([]);
  const [range, setRange] = useState({
    from: date_from || monthStart,
    to: date_to || today,
  });

  const getDocList = () => {
    setLoading(true);
    _fetchApi(
      `${apiURL()}/doctors`,
      (data) => {
        setLoading(false);
        if (data && data.results) {
          setDocList(data.results);
        }
      },
      (err) => {
        setLoading(false);
        console.log(err);
      }
    );
  };

  const getDoctorReportFees = useCallback(() => {
    setSearching(true);
    _fetchApi2(
      `${apiURL()}/transactions/doctors/report-fees/${
        selectedDoctor.username
      }?from=${range.from}&to=${range.to}&query_type=details`,
      (data) => {
        setSearching(false);
        if (data && data.results) {
          let totalDebit = data.results.reduce((a, b) => a + parseInt(b.dr), 0);
          let totalCredit = data.results.reduce(
            (a, b) => a + parseInt(b.cr),
            0
          );
          let total = {
            createdAt: "",
            description: "Total",
            dr: totalDebit,
            cr: totalCredit,
            reference_no: "",
          };
          setTxList([...data.results, total]);
        }
      },
      (err) => {
        setSearching(false);
        console.log(err);
      }
    );
  }, [selectedDoctor.username, range.from, range.to]);

  const printReport = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "doctor-reporting-fees"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };

  useEffect(() => {
    getDocList();
    getDoctorReportFees();
  }, [getDoctorReportFees]);

  const fields = [
    {
      title: "Date",
      custom: true,
      // value: "createdAt",
      component: (d) => (
        <div>
          {d.createdAt === "" ? "" : moment(d.createdAt).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      title: "Description",
      value: "description",
    },
    // {
    //   title: "Debit",
    //   custom: true,
    //   component: (d) => <div className="text-right">{formatNumber(d.cr)}</div>,
    // },
    {
      title: "Amount",
      custom: true,
      component: (d) => <div className="text-right">{formatNumber(d.dr)}</div>,
    },
    {
      title: "Reference No.",
      component: (item) => (
        <div>
          {item.patient_name} {item.reference_no}
        </div>
      ),
    },
    {
      title: "Old Price",
      value: "old_price",
    },
  ];

  return (
    <Card>
      <CardHeader className="d-flex flex-direction-row align-items-center py-2">
        <BackButton text="Click to go back" className="mr-4" />{" "}
        <h6>Doctors Report Fees</h6>
      </CardHeader>
      <CardBody>
        <div>
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={({ target: { name, value } }) =>
              setRange((p) => ({ ...p, [name]: value }))
            }
          />
          {/* {JSON.stringify(txList)} */}
          <div className="row">
            <div className="col-md-6">
              <AutoComplete
                label="Select Doctor"
                options={docList}
                labelKey={(d) => `${d.firstname} ${d.lastname}`}
                onChange={(d) => {
                  if (d.length) {
                    setSelectedDoctor(d[0]);
                  }
                }}
              />
            </div>
            <div className="col-md-6 d-flex flex-direction-row justify-content-end align-items-center">
              {/* <CustomButton
                className="mr-2"
                onClick={getDoctorReportFees}
                loading={searching}
                disabled={checkEmpty(selectedDoctor)}
              >
                Get Report
              </CustomButton> */}

              <CustomButton
                color="success"
                disabled={!txList.length}
                onClick={printReport}
              >
                Print
              </CustomButton>
            </div>
          </div>
        </div>
        {loading && <Loading />}
        <div>
          <h6>
            Doctor's Name: {selectedDoctor.firstname} {selectedDoctor.lastname}
          </h6>
        </div>
        <div
          id="doctor-reporting-fees"
          style={{ height: "60vh", overflow: "scroll" }}
        >
          <PrintWrapper
            title={`Doctor's Reporting Fees (${selectedDoctor.firstname} ${selectedDoctor.lastname})`}
          >
            <CustomTable size="sm" bordered fields={fields} data={txList} />
          </PrintWrapper>
        </div>
      </CardBody>
      <iframe
        title="doctor-reporting-fees"
        name="print_frame"
        width="0"
        height="0"
        src="about:blank"
        // style={styles}
      />
    </Card>
  );
}

export default DoctorFeesDetails;
