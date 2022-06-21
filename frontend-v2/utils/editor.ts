import get from 'lodash.get'

export const isEmptyDataParse = (data) => {
  const dataParse = data && JSON.parse(data)

  // eslint-disable-next-line no-extra-boolean-cast
  if (!dataParse) return false

  const text = get(dataParse, 'blocks.[0].data.text')

  if (text === '&nbsp;') return false

  return true
}
