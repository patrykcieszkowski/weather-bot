const request = require('request')

let settings = {
  key: null,
  unit: null
}

let units = [
  {name: 'Kelvin', short: 'K', code: 'default'},
  {name: 'Celsius', short: 'C', code: 'metric'},
  {name: 'Fahrenheit', short: 'F', code: 'imperial'}
]

function setUnit(unit)
{
  let unitObj = units[0]
  if (unit)
  {
    unit = unit.toLowerCase()
    for (let i = 0; i < units.length; i++)
    {
      let _unit = units[i]
      if (_unit.code && _unit.name && _unit.name.toLowerCase() === unit)
      {
        unitObj = _unit
      }
    }
  }

  return unitObj
}

function WeatherAPI(obj)
{
  settings.unit = setUnit(obj.unit)
  settings.key = obj.key

  this.byCityId = (id, handler) =>
  {
    if (!id) return handler(null)

    let foundData = ''
    request
      .get(`http://api.openweathermap.org/data/2.5/weather?appid=${settings.key}&units=${settings.unit.code}&id=${id}`)
      .on('data', (data) =>
      {
        foundData += data
      })

      .on('end', () =>
      {
        return handler(JSON.parse(foundData))
      })
  }

  this.byCityName = (name, handler) =>
  {
    if (!name) return handler(null)
    let foundData = ''
    request
      .get(`http://api.openweathermap.org/data/2.5/weather?appid=${settings.key}&units=${settings.unit.code}&q=${name}`)
      .on('data', (data) =>
      {
        foundData += data
      })

      .on('end', () =>
      {
        return handler(JSON.parse(foundData))
      })
  }

  this.getUnit = () =>
  {
    return settings.unit
  }

  this.setUnit = (unit) =>
  {
    if (!unit) return false
    settings.unit = setUnit(unit)
    return true
  }

  this.setApiKey = (key) =>
  {
    if (!key) return false
    settings.key = key
    return true
  }

  return this
}

module.exports = WeatherAPI
