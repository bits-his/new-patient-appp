let otherOptions = [
  { label: 'Need Sample?', value: 'collect_sample' },
  { label: 'Need Analysis?', value: 'to_be_analyzed' },
  { label: 'Need Report?', value: 'to_be_reported' },
  { label: 'Upload DICOM Files?', value: 'upload_doc' },
]

export const standaloneTestFormFields = (
  form = {},
  report_types = [],
  specimenList = [],
  labHeads = [],
  headRef = null,
) => [
  {
    name: 'head',
    label: 'Lab Head',
    value: form.head,
    type: 'autocomplete',
    labelKey: 'description',
    options: labHeads,
    col: 6,
    _ref: headRef,
  },
  {
    name: 'subhead',
    label: 'Sub Head Code',
    value: form.subhead,
    col: 6,
  },
  {
    name: 'description',
    label: 'Test Name',
    value: form.description,
    col: 6,
  },

  {
    name: 'label_name',
    label: 'Label Print Text',
    value: form.label_name,
    col: 6,
  },
  { name: 'noOfLabels', label: 'No of Label', value: form.noOfLabels, col: 6 },
  {
    name: 'report_type',
    label: 'Report Type',
    value: form.report_type,
    col: 6,
    type: 'select',
    options: report_types,
  },
  {
    name: 'unit',
    label: 'Test Unit',
    value: form.unit,
    col: 6,
  },
  {
    name: 'range_from',
    label: 'Range From',
    value: form.range_from,
    col: 6,
  },
  {
    name: 'range_to',
    label: 'Range To',
    value: form.range_to,
    col: 6,
  },
  {
    name: 'specimen',
    label: 'Specimen Name',
    value: form.specimen,
    type: 'autocomplete',
    options: specimenList,
    allowNew: true,
    col: 6,
  },
  ...otherOptions.map((opt) => {
    return {
      name: opt.value,
      label: opt.label,
      value: form[opt.value],
      type: 'radio',
      options: [
        { label: 'Yes', name: 'yes' },
        { label: 'No', name: 'no' },
      ],
      col: 6,
    }
  }),

  //   {
  //     type: 'radio',
  //     name: 'noOfLabel',
  //     label: 'No of Label',
  //     value: form.noOfLabel,
  //     options: [''],
  //   },
]

export const groupedTestFormFields = (
  form = {},
  report_types = [],
  specimenList = [],
  labHeads = [],
) => [
  {
    name: 'head',
    label: 'Lab Head',
    value: form.head,
    col: 6,
    type: 'autocomplete',
    labelKey: 'description',
    options: labHeads,
  },
  {
    name: 'subhead',
    label: 'Sub Head Code',
    value: form.subhead,
    col: 6,
  },
  {
    name: 'description',
    label: 'Test Name',
    value: form.description,
    col: 6,
  },
  {
    name: 'report_type',
    label: 'Report Type',
    value: form.report_type,
    col: 6,
    type: 'select',
    options: report_types,
  },
  {
    name: 'label_name',
    label: 'Label Print Text',
    value: form.label_name,
    col: 6,
  },
  {
    name: 'specimen',
    label: 'Specimen Name',
    value: form.specimen,
    type: 'autocomplete',
    options: specimenList,
    allowNew: true,
    col: 6,
  },
  { name: 'noOfLabels', label: 'No of Label', value: form.noOfLabels, col: 6 },
  ...otherOptions.map((opt) => {
    return {
      name: opt.value,
      label: opt.label,
      value: form[opt.value],
      type: 'radio',
      options: [
        { label: 'Yes', name: 'yes' },
        { label: 'No', name: 'no' },
      ],
      col: 6,
    }
  }),
  //   {
  //     type: 'radio',
  //     name: 'noOfLabel',
  //     label: 'No of Label',
  //     value: form.noOfLabel,
  //     options: [''],
  //   },
]
