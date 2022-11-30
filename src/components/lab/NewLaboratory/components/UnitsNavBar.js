import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useQuery } from '../../../../hooks'
import { apiURL } from '../../../../redux/actions'
import { _fetchApi2 } from '../../../../redux/actions/api'
import HorizontalMenu from '../../../comp/components/horizontal-menu/HorizontalMenu'
import HorizontalMenuItem from '../../../comp/components/horizontal-menu/HorizontalMenuItem'

function UnitsNavBar() {
  const location = useLocation()
  const query = useQuery()
  const code = query.get('code')
  const request_id = query.get('request_id')
  const receiptNo = query.get('receiptNo')
  const currentUnit = query.get('unit')

  const userDepartment = useSelector((state) => state.auth.user.department)

  const isCollection = location.pathname.includes('collection')
  const isChempath = location.pathname.includes('chemical-pathology')
  const isHema = location.pathname.includes('hematology')
  const isMicro = location.pathname.includes('microbiology')
  const isRadio = location.pathname.includes('radiology')
  const isDoctor = location.pathname.includes('doctor')

  const [units, setUnits] = useState([])

  const getUnits = useCallback(() => {
    let department = isChempath
      ? 'Chemical Pathology'
      : isHema
      ? 'Hematology'
      : isMicro
      ? 'Microbiology'
      : isRadio
      ? 'Radiology'
      : isDoctor
      ? userDepartment
      : ''
    _fetchApi2(
      `${apiURL()}/department/get-units?query_type=units&department=${department}`,
      (data) => {
        if (data.results) {
          setUnits(data.results)
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }, [isHema, isChempath, isMicro, isRadio])

  useEffect(() => {
    getUnits()
  }, [getUnits])

  if (units && units.length && units.length > 1) {
    return (
      <div>
        {/* {JSON.stringify(units)} */}
        <HorizontalMenu>
          {units.map((u) => (
            <HorizontalMenuItem
              active={currentUnit === u.unit_name}
              route={`${location.pathname}?unit=${u.unit_name}&code=${code}&request_id=${request_id}&receiptNo=${receiptNo}`}
            >
              {u.unit_name}
            </HorizontalMenuItem>
          ))}
        </HorizontalMenu>
      </div>
    )
  }
  return null
}

export default UnitsNavBar
