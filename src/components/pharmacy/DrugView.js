import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useQuery from "../../hooks/useQuery";
import { getDrugView } from "../../redux/actions/pharmacy";
import { CustomTable } from "../comp/components";
import CustomCard from "../comp/components/CustomCard";
import CustomScrollbar from "../comp/components/CustomScrollbar";
import DaterangeSelector from "../comp/components/DaterangeSelector";

export default function DrugView() {
  const today = moment().format("YYYY-MM-DD");
  const query = useQuery();
  const item_code = query.get("item_code");
  const store = query.get("store");
  const drug_name = query.get("drug_name");
  const expiry_date = query.get("expiry_date");
  const dispatch = useDispatch();
  const drugView = useSelector((state) => state.pharmacy.purchaseItems);
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const aMonthAgo = moment(today)
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD");
  const [form, setForm] = useState({
    from: aMonthAgo,
    to: today,
  });

  const _getItemBalance = useCallback(() => {
    dispatch(
      getDrugView(
        store,
        item_code,
        form.from,
        form.to,
        facilityId,
        drug_name,
        expiry_date
      )
    );
  }, [
    dispatch,
    form.from,
    form.to,
    item_code,
    store,
    facilityId,
    drug_name,
    expiry_date,
  ]);

  useEffect(() => {
    _getItemBalance();
  }, [_getItemBalance]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };
  const fields = [
    { title: "Drug Name", value: "drug_name" },

    {
      title: "Qty In",
      custom: true,
      component: (item) => item.qty_in,
      className: "text-center",
    },
    {
      title: "Qty Out",
      custom: true,
      component: (item) => item.qty_out,
      className: "text-center",
    },
    {
      title: "Selling Price (₦)",
      custom: true,
      component: (item) => item.selling_price,
      className: "text-right",
    },
    {
      title: "Expiry Date",
      custom: true,
      component: (item) => item.expiry_date,
      // className: 'text-right',
    },
    { title: "Store", value: "store" },
    { title: "Type", value: "sales_type" },
  ];
  return (
    <>
      <CustomCard header="Drug View" back>
        <DaterangeSelector
          handleChange={handleChange}
          from={form.from}
          to={form.to}
        />
        <CustomScrollbar>
          <CustomTable size="sm" bordered fields={fields} data={drugView} />
        </CustomScrollbar>
      </CustomCard>
    </>
  );
}
