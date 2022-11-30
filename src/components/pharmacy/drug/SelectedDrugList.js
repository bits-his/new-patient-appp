import React from 'react'
import { CustomButton } from '../../comp/components'
import CustomCard from '../../comp/components/CustomCard'
import ItemsList from './ItemList'
import SalesForm from './SaleForm'

function SelectedDrugList({
  disabled,
  form = {
    filterText: '',
  },
  hide = false,
  itemList = {},
  addToCart = (f) => f,
  selectItem = (f) => f,
  qttyRef,
  itemNameRef,
  handleChange,
  handleSubmit = (f) => f,
  filterText,
  setFilterText,
  options,
  user_id,
}) {
  return (
    <CustomCard container="p-0" body="p-2" header="Point of Sales">
      <>
        <SalesForm
          options={options}
          form={form}
          qttyRef={qttyRef}
          itemNameRef={itemNameRef}
          handleChange={handleChange}
          filterText={filterText}
          setFilterText={setFilterText}
          disabled={disabled}
          user_id={user_id}
        />
        <ItemsList
          filterText={filterText}
          selectItem={selectItem}
          list={itemList}
          form={form}
        />
        <div className="d-flex flex-row justify-content-between">
          <div color="primary" className="btn btn-secondary">
            Press F10 to submit
          </div>
          <CustomButton
            color="primary"
            className="float-end"
            onClick={addToCart}
          >
            Press Enter to Add To Cart
          </CustomButton>
        </div>
      </>
    </CustomCard>
  )
}

export default SelectedDrugList
