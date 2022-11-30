import React, { useEffect } from 'react';
import {
  Row,
  Form,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
} from 'reactstrap';
import { useState } from 'react';
import CustomButton from '../comp/components/Button';
import { today, formatNumber, _customNotify } from '../utils/helpers';
import moment from 'moment';
import InputGroup from '../comp/components/InputGroup';
import { useCallback } from 'react';
import { apiURL } from '../../redux/actions';
import { _fetchApi, _postApi } from '../../redux/actions/api';
import AutoComplete from '../comp/components/AutoComplete';

export default function AssetRegister() {
  const [list, setList] = useState([]);
  const [assets, setAssets] = useState([]);
  // const [assetName, setAssetName] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: '',
    assetName: '',
    startDate: today,
    endDate: today,
    assetCost: 0,
    percentage: 0,
    rate: 0,
  });

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
      },
    );
  };

  const getYears = useCallback(
    () => {
      // let { startDate, endDate } = form;
      let startDate = moment(form.startDate).format('YYYY');
      let endDate = moment(form.endDate).format('YYYY');
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
    [form.startDate, form.endDate, form.assetCost, form.rate],
  );

  useEffect(
    () => {
      getYears();
      getAssetHeads();
    },
    [getYears],
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);
    let newList = [];
    list.forEach((item) =>
      newList.push({
        code: form.code,
        description: form.assetName,
        cost: form.assetCost,
        rate: item.rate,
        daily_rate: item.rate,
        purchase_date: form.startDate,
        endDate: form.endDate,
        percentage_rate: form.percentage,
        nbv_yearly: item.nbv,
        years: list.length,
        nbv_monthly: item.nbv,
      }),
    );
    // console.log(newList);

    for (let i = 0; i < newList.length; i++) {
      // let item = newList[i];
      _postApi(`${apiURL()}/account/asset-register`, newList[i]);
      // fetch(`${apiURL()}/account/asset-register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newList[i])
      // })

      // if (i === newList.length-1) {
      //   _customNotify('Register saved!');
      //   setLoading(false);
      // }
    }

    // setTimeout(() => {
    _customNotify('Register saved!');
    setLoading(false);
    // }, 2000);
  };

  const getRate = (amount, cent) =>
    Math.round(parseFloat(amount) * (parseFloat(cent) / 100), 0);

  const getEndDate = (cost, rate) =>
    moment(form.startDate)
      .add(parseInt(cost) / parseInt(rate), 'years')
      .format('YYYY-MM-DD');

  //   .add(parseInt(p.percentage) / getRate(value, p.percentage), 'years')
  return (
    <>
      <Card>
        <CardHeader className="text-center h6">
          Asset Schedule/Register
        </CardHeader>
        <CardBody>
          {/* <Form onSubmit={handleFormSubmit}> */}
          <Form>
            {/* {JSON.stringify(form)} */}
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
              <AutoComplete
                containerClass="col-md-6 col-lg-6"
                label="Account Head"
                options={assets}
                labelKey="head"
                onChange={(val) => {
                  if (val.length) {
                    let value = val[0];
                    setForm((p) => ({
                      ...p,
                      // assetName: value.head,
                      code: value.code,
                    }));
                  }
                }}
              />

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
                    assetCost: p.assetCost === 0 ? '' : p.assetCost,
                  }))
                }
                onBlur={() =>
                  setForm((p) => ({
                    ...p,
                    assetCost: p.assetCost === '' ? '0' : p.assetCost,
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

              <InputGroup
                container="col-md-6 col-lg-6"
                label="Percentage"
                type="number"
                name="percentage"
                value={form.percentage}
                onFocus={() =>
                  setForm((p) => ({
                    ...p,
                    percentage: p.percentage === 0 ? '' : p.percentage,
                  }))
                }
                onBlur={() =>
                  setForm((p) => ({
                    ...p,
                    percentage: p.percentage === '' ? '0' : p.percentage,
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
                      getRate(p.assetCost, value),
                    ),
                  }));
                }}
              />

              <InputGroup
                container="col-md-6 col-lg-6"
                label="Rate"
                type="text"
                name="rate"
                value={form.rate}
                editable={false}
              />
              {/* <div className="col-md-6 col-lg-6"> */}
              {/* <div htmlFor="" className="font-weight-bold">
                  Percentage
                </div> */}

              {/* <label className="mr-3" htmlFor="rate-percentage">
                  <input
                    type="radio"
                    className="mr-2"
                    name="rate"
                    id="rate-percentage"
                    onChange={() => setForm((d) => ({ ...d, rate: 'Years' }))}
                    checked={form.rate === 'Years'}
                  />
                  Years
                </label>
                <label className="mr-3" htmlFor="rate-percentage">
                  <input
                    type="radio"
                    className="mr-2"
                    name="rate"
                    id="rate-percentage"
                    onChange={() =>
                      setForm((d) => ({ ...d, rate: 'Percentage' }))
                    }
                    checked={form.rate === 'Percentage'}
                  />
                  Percentage
                </label> */}
              {/* </div> */}
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
          {/* {JSON.stringify(list)} */}
          <AssetTable list={list} />
        </CardBody>
      </Card>
    </>
  );
}

function AssetTable({ list }) {
  return (
    <Card className="mt-3">
      <CardTitle className="text-center h6 py-2">Asset (Preview)</CardTitle>
      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Rate</th>
            <th>NBV</th>
          </tr>
        </thead>
        <thead>
          {list.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{formatNumber(item.rate) || 0}</td>
              <td>{formatNumber(item.nbv) || 0}</td>
            </tr>
          ))}
        </thead>
      </Table>
    </Card>
  );
}
