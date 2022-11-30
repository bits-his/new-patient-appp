import { apiURL } from '../../../redux/actions'
import { _fetchApi, _fetchApi2, _postApi } from '../../../redux/actions/api'

export const queryLabSetup = (q = {}, success = (f) => f, error = (f) => f) => {
  // head=${head}&facilityId=${facilityId}
  _fetchApi2(
    `${apiURL()}/lab/lab-setup?${Object.keys(q)
      .map((a) => a + '=' + q[a])
      .join('&')}`,
    (resp) => {
      success(resp)
    },
    (err) => {
      error(err)
    },
  )
}

export const postLabSetup = (
  data = {},
  success = (f) => f,
  error = (f) => f,
) => {
  _postApi(
    `${apiURL()}/lab/lab-setup`,
    data,
    (resp) => {
      success(resp)
    },
    (err) => {
      error(err)
    },
  )
}

export const getSpecimenList = (callback = (f) => f) => {
  _fetchApi(
    `${apiURL()}/lab/specimen/list`,
    (data) => {
      if (data.success) {
        callback(data.results)
      }
    },
    (err) => {
      console.log(err)
    },
  )
}

export const getLabChildren = (
  head = '',
  callback = (f) => f,
  empty = (f) => f,
  error = (f) => f,
) => {
  _fetchApi(
    `${apiURL()}/lab/get-children/${head}`,
    (data) => {
      if (data.success) {
        if (data.results.length) {
          callback(data.results)
        } else {
          empty()
        }
      }
    },
    (err) => {
      error(err)
    },
  )
}

export const processBatchSetup = (
  list = [],
  query_type = '',
  success = (f) => f,
  error = (f) => f,
) => {
  console.log(list)
  _postApi(
    `${apiURL()}/lab/lab-setup/batch`,
    { list, query_type },
    (resp) => {
      success(resp)
    },
    (err) => {
      error(err)
    },
  )
}

export const queryTests = (q = {}, success = (f) => f, error = (f) => f) => {
  // alert(JSON.stringify(q))

  _fetchApi2(
    `${apiURL()}/lab/get-labsetup-account?${Object.keys(q)
      .map((a) => a + '=' + q[a])
      .join('&')}`,
    (resp) => {
      success(resp)
    },
    (err) => {
      error(err)
    },
  )
}
