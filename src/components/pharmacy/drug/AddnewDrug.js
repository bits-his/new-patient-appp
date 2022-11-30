import React, { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Prompt, useHistory } from 'react-router'
import {
  addPurchase,
  getAllDrugs,
  getPharmStore,
  getPurchaseItem,
  getSupplierInfo,
} from '../../../redux/actions/pharmacy'
import { CustomButton, CustomForm, CustomTable } from '../../comp/components'
import CustomCard from '../../comp/components/CustomCard'
import CustomModal from '../../comp/components/CustomModal'
import CustomTypeahead from '../../comp/components/CustomTypeahead'
import { formatNumber, _customNotify } from '../../utils/helpers'

export default function Newtask() {
  const navigate = useHistory()
  const drugNameRef = useRef()
  const drugNameRef1 = useRef()
  // const storeRef = useRef();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const supplierList = useSelector((state) => state.pharmacy.supplierInfo)
  const pharmStores = useSelector((state) => state.pharmacy.pharmStore)
  const purchaseItems = useSelector((state) => state.pharmacy.drugList)
  const userId = useSelector((state) => state.auth.user.username)
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    supplierName: '',
    supplier_code: '',
    store_code: '',
    store_name: '',
    sourceAcc: '',
    truckNo: '',
    drugCategory: '',
    selling_price: '',
    expiry_date: '',
    modeOfPayment: '',
    transfer_from: 'Purchase order',
    branch_name: '',
    transfer_to: '',
    drugCode: '',
    barcode: '',
    drugName: '',
    genericName: '',
    uom: '',
    otherDetails: '',
    waybillNo: '',
    quantity: 0,
    unitCost: 0,
    query_type: 'received',
    cost: 0,
    expiryDate: '',
    store: '',
    markup: 0,
    payment: '',
    status: '',
    item_code: '',
    reorder: '',
    generic_name: '',
    userId: userId,
  })
  const [tbls, setTbls] = useState([])
  const [drugs, setDrugs] = useState([])
  const [modalInfo, setModalInfo] = useState({ isOpen: false, message: '' })

  const _getDrugs = useCallback(() => {
    if (!drugs.length) {
      dispatch(getAllDrugs(setDrugs))
    }
  }, [drugs, dispatch])

  useEffect(() => {
    _getDrugs()
  }, [0])
  const _getSupplierInfo = useCallback(() => {
    dispatch(getSupplierInfo())
    // dispatch(getPharmStore());
    dispatch(getPurchaseItem(0, 0, 'all'))
  }, [dispatch])

  useEffect(() => {
    _getSupplierInfo()
  }, [_getSupplierInfo])

  useEffect(() => {
    dispatch(
      getPharmStore((d) =>
        setForm((p) => ({ ...p, receivedTo: d[0].store_name })),
      ),
    )
  }, [dispatch])

  const fields = [
    {
      label: 'Supplier Name',
      name: 'supplier_name',
      type: 'custom',
      component: () => (
        <CustomTypeahead
          label="Select Supplier"
          labelKey="supplier_name"
          options={supplierList}
          onChange={(s) => {
            if (s.length) {
              console.log(s)
              setForm((p) => ({
                ...p,
                supplierName: s[0].supplier_name,
                supplier_code: s[0].supplier_code,
              }))
            }
          }}
          onInputChange={(v) => {
            if (v.length) {
              console.log(v, 'KDDDDDDDK')
            }
          }}
        />
      ),
      col: 3,
    },
    {
      label: 'Drug Category',
      type: 'text',
      labelkey: 'item',
      name: 'drugCategory',
      value: form.drugCategory,
      col: 3,
    },
    {
      type: 'custom',
      component: () => (
        <CustomTypeahead
          label="Generic Name"
          labelKey="generic_name"
          options={drugs && drugs}
          _ref={drugNameRef1}
          allowNew
          onChange={(s) => {
            if (s && s.length) {
              console.log(s)
              setForm((p) => ({
                ...p,
                generic_name: s && s[0].generic_name,
              }))
            }
          }}
          onInputChange={(v) => {
            if (v && v.length) {
              setForm((p) => ({
                ...p,
                generic_name: v,
              }))
            }
          }}
        />
      ),
      col: 3,
    },
    {
      type: 'custom',
      component: () => (
        <CustomTypeahead
          label="Drug Name"
          labelKey="drug_name"
          options={purchaseItems ? purchaseItems : drugs}
          _ref={drugNameRef}
          allowNew
          onChange={(s) => {
            if (s.length) {
              console.log(s)
              setForm((p) => ({
                ...p,
                description: s[0].drug_name,
                drugName: s[0].drug_name,
                item_code: s[0].item_code ? s[0].item_code : '',
              }))
            }
          }}
          onInputChange={(v) => {
            if (v.length) {
              setForm((p) => ({
                ...p,
                description: v,
                drugName: v,
              }))
            }
          }}
        />
      ),
      col: 3,
    },
    {
      label: 'Unit of Measurement',
      labelkey: 'label',
      options: [{ label: '--unit--' }, { label: 'Other' }],
      name: 'uom',
      value: form.uom,
      col: 3,
    },
    {
      label: 'Barcode',
      name: 'barcode',
      value: form.barcode,
      col: 3,
      type: 'text',
    },
    {
      label: 'Cost Price',
      type: 'number',
      name: 'cost',
      value: form.cost,
      col: 3,
    },
    {
      label: 'Quantity',
      type: 'number',
      name: 'quantity',
      placeholder: 'QTY',
      value: form.quantity,
      required: true,
      col: 3,
    },
    {
      label: 'Selling Price',
      type: 'number',
      name: 'selling_price',
      value: form.selling_price,
      required: true,
      col: 3,
    },
    {
      label: 'Reorder Level',
      type: 'number',
      name: 'reorder',
      value: form.reorder,
      placeholder: '0',
      col: 3,
    },
    {
      label: 'Expiry Date',
      type: 'date',
      name: 'expiry_date',
      value: form.expiry_date,
      col: 3,
    },
    {
      label: 'Receiving Store',
      type: 'select',
      options: pharmStores.map((a) => a.store_name),
      // component: () => (
      // <CustomTypeahead
      //   label="Receiving Store"
      //   labelKey="store_name"
      //   options={pharmStores}
      //   _ref={storeRef}
      //   // defaultInputValue={pharmStores[0] ? pharmStores[0].store_name : ""}
      //   allowNew
      //   onChange={(s) => {
      //     if (s.length) {
      //       console.log(s);
      //       setForm((p) => ({
      //         ...p,
      //         branch_name: s[0].store_name,
      //         store_code: s[0].store_code,
      //         transfer_to: s[0].store_name,
      //       }));
      //     }
      //   }}
      //   onInputChange={(v) => {
      //     if (v.length) {
      //       console.log(v, "KDDDDDDDK");
      //     }
      //   }}
      // />
      // ),
      name: 'receivedTo',
      value: form.receivedTo,
      col: 3,
    },
  ]

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }))
  }
  const handleAdd = () => {
    if (
      form.supplierName === '' ||
      form.drugCategory === '' ||
      form.cost === '' ||
      form.quantity === '' ||
      form.selling_price === '' ||
      form.receivedTo === ''
    ) {
      alert('invalid form')
    } else {
      if (form.description === '') {
        _customNotify('Please Complete the Form', 'warning')
      } else {
        setTbls((p) => [...p, form])
        setForm((p) => ({
          ...p,
          waybillNo: '',
          quantity: 0,
          unitCost: 0,
          cost: 0,
          expiryDate: '',
          store: '',
          markup: 0,
          payment: '',
          status: '',
          reorder: '',
          uom: '',
          otherDetails: '',
          truckNo: '',
          expiry_date: '',
          modeOfPayment: '',
          barcode: '',
          selling_price: '',
          userId: userId,
        }))
        drugNameRef.current.clear()
        drugNameRef1.current.clear()
        // storeRef.current.clear();
        drugNameRef.current.focus()
        setShow(true)
      }
    }
  }
  const handleDelete = (idx) => {
    const data = tbls.filter((item, index) => idx !== index)

    setTbls(data)
  }

  const tbl = [
    {
      title: 'S/N',
      custom: true,
      component: (item, index) => index + 1,
      className: 'text-center',
    },
    {
      title: 'Name',
      value: 'description',
    },
    {
      title: 'Unit Cost',
      custom: true,
      component: (item) => formatNumber(item.cost),
      className: 'text-right',
    },
    {
      title: 'Quantity',
      custom: true,
      component: (item) => item.quantity,
      className: 'text-center',
    },
    {
      title: 'Amount',
      custom: true,
      component: (item) => formatNumber(item.quantity * item.cost),
      className: 'text-right',
    },
    {
      title: 'Action',
      custom: true,
      component: (item, idx) => (
        <div>
          <center>
            <CustomButton
              className="btn-danger"
              size="sm"
              onClick={() => {
                handleDelete(idx)
              }}
            >
              X
            </CustomButton>
          </center>
        </div>
      ),
    },
  ]
  const handleSubmit = () => {
    setLoading(true)
    addPurchase(
      tbls,
      (res) => {
        // console.log(res)
        if (res) {
          setModalInfo({
            isOpen: true,
            message: `GRN: ${res.grn}`,
          })
          console.log(res)
          setLoading(false)
          // alert("submitted successfully");
          _customNotify('Drug Purchase recorded successfully')
          setTbls([])
          navigate.push(-1)
        }
      },
      (err) => {
        console.log(err)
        alert('Error Occured')
        setLoading(false)
      },
    )
  }

  const preventNavigation = tbls.length
  return (
    <div className="p-1">
      {/* {JSON.stringify(form)} */}
      <CustomCard back header="Purchase Drugs">
        <CustomForm fields={fields} handleChange={handleChange} />
        <center>
          <CustomButton className="m-3" onClick={handleAdd}>
            Add to List
          </CustomButton>
        </center>
        {show === true ? (
          <>
            <CustomTable bordered size="sm" fields={tbl} data={tbls} />{' '}
            <center>
              <CustomButton loading={loading} onClick={handleSubmit}>
                Submit
              </CustomButton>
            </center>
          </>
        ) : (
          ''
        )}
      </CustomCard>
      <Prompt
        when={preventNavigation}
        message="Are you sure you want leave the page, data on this page will be lost?"
      />
      <CustomModal
        header="Success!"
        isOpen={modalInfo.isOpen}
        toggle={() => setModalInfo((p) => ({ ...p, isOpen: !p.isOpen }))}
        size='sm  '
      >
       <div className='text-center'> <FaCheck color={'green'} size={60} /></div>
        <h1 className='text-center mt-4'>{modalInfo.message}</h1>
        <h1 className='text-center'>Successfully Submitted</h1>
      </CustomModal>
    </div>
  )
}
