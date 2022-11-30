import React, { useEffect } from "react";
import {
  Row,
  Form,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  FormGroup,
} from "reactstrap";
import { useState } from "react";
import CustomButton from "../comp/components/Button";
import {
  today,
  formatNumber,
  _customNotify,
  generateReceiptNo,
} from "../utils/helpers";
import moment from "moment";
import InputGroup from "../comp/components/InputGroup";
import { useCallback } from "react";
import { apiURL } from "../../redux/actions";
import { _fetchApi, _postApi } from "../../redux/actions/api";
import AutoComplete from "../comp/components/AutoComplete";
import { useSelector } from "react-redux";

export default function CreateAsset() {
  const [formType, setFormType] = useState("asset");
  const [list, setList] = useState([]);
  const [assets, setAssets] = useState([]);
  // const [assetName, setAssetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [assetList, setAssetList] = useState([]);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const [form, setForm] = useState({
    code: "",
    assetName: "",
    startDate: today,
    endDate: today,
    assetCost: 0,
    percentage: 0,
    rate: 0,
  });

  const resetForm = () => {
    setForm({
      code: "",
      assetName: "",
      startDate: today,
      endDate: today,
      assetCost: 0,
      percentage: 0,
      rate: 0,
    });
  };

  const handleFormInputChange = ({ target: { value, name } }) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const getAssetHeads = () => {
    _fetchApi(
      `${apiURL()}/account/head/assets`,
      (data) => {
        if (data.success) {
          setAssets(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getAllAssets = useCallback(
    () => {
      fetch(`${apiURL()}/account/assets/all/${facilityId}`)
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            setAssetList(data.results);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [facilityId]
  );

  const getYears = useCallback(
    () => {
      // let { startDate, endDate } = form;
      let startDate = moment(form.startDate).format("YYYY");
      let endDate = moment(form.endDate).format("YYYY");
      var timeValues = [];
      // console.log('calling getYears()', startDate, endDate);

      for (
        let from = +startDate, to = +endDate, i = 0;
        from <= to;
        from++, i++
      ) {
        let calculatedNBV = form.assetCost - form.rate * i;
        timeValues.push({
          year: from,
          rate: form.rate,
          nbv: calculatedNBV === 0 ? 10 : calculatedNBV,
        });
      }
      setList(timeValues);
    },
    [form.startDate, form.endDate, form.assetCost, form.rate]
  );

  useEffect(
    () => {
      getYears();
      getAssetHeads();
      getAllAssets();
    },
    [getYears, getAllAssets]
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // let newList = [];
    // list.forEach((item) =>
    //   newList.push(
    generateReceiptNo((receiptno, receiptsn) => {
      let data = {
        code: form.code,
        description: form.assetName,
        cost: form.assetCost,
        rate: list[0].rate,
        daily_rate: list[0].rate,
        purchase_date: form.startDate,
        endDate: form.endDate,
        percentage_rate: form.percentage,
        nbv_yearly: list[0].nbv,
        years: list.length,
        nbv_monthly: parseInt(list[0].nbv) / 12,
        receiptno,
        receiptsn,
      };
      //   ),
      // );
      // console.log(newList);

      // for (let i = 0; i < newList.length; i++) {
      // let item = newList[i];
      _postApi(`${apiURL()}/account/asset-register`, data);
      // fetch(`${apiURL()}/account/asset-register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newList[i])
      // })

      // if (i === newList.length-1) {
      //   _customNotify('Register saved!');
      //   setLoading(false);
      // }
      // }

      setTimeout(() => {
        _customNotify("Register saved!");
        setLoading(false);
        resetForm();
        getAllAssets();
      }, 1000);
    });
  };

  const runDeduction = (item) => {
    generateReceiptNo((receiptno, receiptsn) => {
      let data = {
        code: item.code,
        description: item.description,
        cost: item.cost,
        receiptno,
        receiptsn,
        nbv: item.nbv_monthly,
      };
      _postApi(`${apiURL()}/account/register/asset-depreciation`, data);
    });
    // console.log(item)
    // amortization: ""
    // code: 400025
    // cost: 3000000
    // created_at: "2020-10-08T15:51:35.000Z"
    // created_by: "admin"
    // daily_rate: 750000
    // deduction_date: null
    // depreciation: "5"
    // description: "Office Complex"
    // end_date: "2024-10-08"
    // facilityId: "966a89f6-05d8-4564-b319-2f8863821e75"
    // nbv_monthly: 250000
    // nbv_yearly: 3000000
    // percentage_rate: 25
    // purchase_date: "2020-10-08"
    // rate: 750000
    // years: 5
  };

  const getRate = (amount, cent) =>
    Math.round(parseFloat(amount) * (parseFloat(cent) / 100), 0);

  const getEndDate = (cost, rate) =>
    moment(form.startDate)
      .add(parseInt(cost) / parseInt(rate), "years")
      .format("YYYY-MM-DD");

  //   .add(parseInt(p.percentage) / getRate(value, p.percentage), 'years')
  return (
    <>
      <Card>
        <CardHeader className="text-center h6">Add Asset</CardHeader>
        <CardBody>
          <div>
            <FormGroup>
              <label htmlFor="formType" className="mr-3">
                Select Register Type
              </label>
              <label className="mr-3">
                <input
                  type="radio"
                  name="formType"
                  checked={formType === "asset"}
                  onChange={() => setFormType("asset")}
                />{" "}
                Asset
              </label>
              <label>
                <input
                  type="radio"
                  name="formType"
                  checked={formType === "rent"}
                  onChange={() => setFormType("rent")}
                />{" "}
                Rent
              </label>
            </FormGroup>
          </div>

          {/* {JSON.stringify(form)} */}
          {/* <Form onSubmit={handleFormSubmit}> */}
          <Form>
            <Row>
              <InputGroup
                container="col-md-6 col-lg-6"
                label="Start Date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleFormInputChange}
              />
              <InputGroup
                container="col-md-6 col-lg-6"
                label="End Date"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleFormInputChange}
              />
              {formType === "asset" && (
                <AutoComplete
                  containerClass="col-md-6 col-lg-6"
                  label="Account Head"
                  options={assets}
                  labelKey="description"
                  onChange={(val) => {
                    if (val.length) {
                      let value = val[0];
                      setForm((p) => ({
                        ...p,
                        // assetName: value.head,
                        code: value.head,
                      }));
                    }
                  }}
                />
              )}

              {/* <InputGroup
                container="col-md-6 col-lg-6"
                label="Account Head"
                type="text"
                name="accountHead"
                value={form.accountHead}
                onChange={handleFormInputChange}
              /> */}

              <InputGroup
                container="col-md-6 col-lg-6"
                label="Name"
                type="text"
                name="assetName"
                value={form.assetName}
                onChange={handleFormInputChange}
              />

              <InputGroup
                container="col-md-6 col-lg-6"
                label="Cost"
                type="number"
                name="assetCost"
                value={form.assetCost}
                onFocus={() =>
                  setForm((p) => ({
                    ...p,
                    assetCost: p.assetCost === 0 ? "" : p.assetCost,
                  }))
                }
                onBlur={() =>
                  setForm((p) => ({
                    ...p,
                    assetCost: p.assetCost === "" ? "0" : p.assetCost,
                  }))
                }
                onChange={(e) => {
                  let value = e.target.value;
                  setForm((p) => ({
                    ...p,
                    assetCost: value,
                    rate: getRate(value, p.percentage),
                    endDate: getEndDate(value, getRate(value, p.percentage)),
                  }));
                }}
              />

              {formType === "asset" && (
                <InputGroup
                  container="col-md-6 col-lg-6"
                  label="Percentage"
                  type="number"
                  name="percentage"
                  value={form.percentage}
                  onFocus={() =>
                    setForm((p) => ({
                      ...p,
                      percentage: p.percentage === 0 ? "" : p.percentage,
                    }))
                  }
                  onBlur={() =>
                    setForm((p) => ({
                      ...p,
                      percentage: p.percentage === "" ? "0" : p.percentage,
                    }))
                  }
                  onChange={(e) => {
                    let value = e.target.value;
                    setForm((p) => ({
                      ...p,
                      percentage: value,
                      rate: getRate(p.assetCost, value),
                      endDate: getEndDate(
                        p.assetCost,
                        getRate(p.assetCost, value)
                      ),
                    }));
                  }}
                />
              )}

              {formType === "asset" && (
                <InputGroup
                  container="col-md-6 col-lg-6"
                  label="Rate"
                  type="text"
                  name="rate"
                  value={form.rate}
                  editable={false}
                />
              )}
            </Row>
            <center>
              <CustomButton
                loading={loading}
                type="submit"
                onClick={handleFormSubmit}
              >
                Save Asset Schedule
                {/* Generate Schedule */}
              </CustomButton>
            </center>
          </Form>

          <AssetTable list={assetList} runDeduction={runDeduction} />
        </CardBody>
      </Card>
    </>
  );
}

function AssetTable({ list, runDeduction }) {
  return (
    <Card className="mt-3">
      <CardTitle className="text-center h6 py-2">Assets</CardTitle>
      <Table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Year</th>
            <th>Rate</th>
            <th>NBV</th>
            <th>Action</th>
          </tr>
        </thead>
        <thead>
          {list.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.years}</td>
              <td>{formatNumber(item.percentage_rate) || 0}</td>
              <td>{formatNumber(item.nbv_yearly) || 0}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => runDeduction(item)}
                >
                  Run Deduction
                </button>
              </td>
            </tr>
          ))}
        </thead>
      </Table>
    </Card>
  );
}
