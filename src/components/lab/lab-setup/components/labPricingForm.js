export const mainOptions = [{}];

export const accountFormFields = (form) => [
  {
    name: "department",
    label: "Select Department",
    value: form.department,
    type: "autocomplete",
    options: form.options.departmentList,
    labelKey:"description",
    _ref:form._ref

  },
  {
    name: "account_type",
    label: "Acount Type",
    value: form.account_head,
    type: "autocomplete",
    options: form.options.accountType,
    labelKey:"description"
  },
  {
    name: "account_head",
    label: "Select Account Head",
    value: form.account_head,
    type: "autocomplete",
    options:form.options.revenueHead,
    labelKey:"description"
  },
];
