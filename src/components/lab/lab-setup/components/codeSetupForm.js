import React from 'react'
import Checkbox from '../../../comp/components/Checkbox'

export const fields = (form) => [
  {
    name: 'department',
    label: 'Select Department',
    value: form.department,
    col: 6,
  },
  {
    name: 'unit',
    label: 'Select Unit',
    value: form.unit,
    col: 6,
  },
  {
    name: 'test_group',
    label: 'Select Test Group',
    value: form.test_group,
    col: 6,
  },
]

export const codeSetupTable = (handleChange = (f) => f) => [
  { title: 'Test Name', value: 'description' },
  {
    title: 'Stand Alone Test',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name="single"
          onChange={() => handleChange('label_type', 'single', item)}
          checked={item.label_type === 'single'}
        />
      </div>
    ),
  },
  {
    title: 'Department-wise Grouping',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name="grouped"
          onChange={() => handleChange('label_type', 'grouped', item)}
          checked={item.label_type === 'grouped'}
        />
      </div>
    ),
  },
  {
    title: 'Test-wise Grouping',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name={'grouped_single'}
          onChange={() => handleChange('label_type', 'grouped_single', item)}
          checked={item.label_type === 'grouped_single'}
        />
      </div>
    ),
  },
]

export const bookingSetupTable = (handleChange = (f) => f) => [
  { title: 'Test Name', value: 'description' },
  {
    title: 'Stand Alone Booking No.',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name="single"
          checked={item.print_type === 'single'}
          onChange={() => handleChange('print_type', 'single', item)}
        />
      </div>
    ),
  },
  {
    title: 'Unit-wise Grouping',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name="grouped"
          checked={item.print_type === 'grouped'}
          onChange={() => handleChange('print_type', 'grouped', item)}
        />
      </div>
    ),
  },
  {
    title: 'Test-wise Grouping',
    component: (item) => (
      <div className="text-center">
        <input
          type="checkbox"
          name="singular_group"
          checked={item.print_type === 'singular_group'}
          onChange={() => handleChange('print_type', 'singular_group', item)}
        />
      </div>
    ),
  },
]
