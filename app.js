'use strict'
const builder = require('botbuilder');
const restify = require('restify')
const WeatherAPI = require('./lib/weather')
const weather = new WeatherAPI({key: 'YOUR KEY', unit: 'Celsius'})

let botDetails = {
  name: process.env.NAME || 'WeatherOne',
  port: process.env.PORT || 8080,
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
}

const server = restify.createServer()
server.name = botDetails.name
server.listen(botDetails.port, "127.0.0.1", () =>
{
  console.log("%s listens to %s", server.name, server.url);
})

const connector = new builder.ChatConnector({
  appId: botDetails.appId,
  appPassword: botDetails.appPassword
})

const bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())


bot.dialog('/', new builder.IntentDialog()
.matches(/^settings|set/i, '/settings')
.matches(/^weather/i, '/weather')
.matches(/^help/i, '/help')
.onDefault((session) => { session.endDialog(replyArr[0]) }))

bot.dialog('/help', [
  (session, args, next) =>
  {
    builder.Prompts.text(session, replyArr[1])
  }, (session, response) =>
  {
    let msg = response.response

    switch (msg)
    {
      case '2':
      case 'weather':

        session.endDialog(replyArr[2])
        break
      case '3':
      case 'settings':
        session.send(replyArr[3])
        session.send(replyArr[4])
        session.send(replyArr[5])
        session.endDialog()
        break
      default:
        return session.endDialog(replyArr[0])
    }
  }
])

bot.dialog('/settings', (session) =>
{
  let paramsObj = {unit: /unit\s(\w*)/, toggle: ['country', 'details', 'humidity', 'wind']}

  let msg = session.message.text
  let param = msg.match(/(settings|set)\s*([^\n\r]*)/)
  if (!param) return session.endDialog(replyArr[0])

  param = param[2].split(' ')

  if (!Object.keys(paramsObj).includes(param[0]))
  {
    return session.endDialog(replyArr[0])
  }

  switch(param[0])
  {
    case 'unit':
    {
      let unit = msg.match(paramsObj.unit)
      if (!unit[1]) return session.endDialog(replyArr[0])
      weather.setUnit(unit[1])
      break
    }
    case 'toggle':
    {
      if (!param[1] || !paramsObj.toggle.includes(param[1]))
      {
        return session.endDialog(replyArr[0])
      }

      switch (param[1])
      {
        case 'details':
          session.userData.details = !(session.userData.details)
          break
        case 'humidity':
          session.userData.humidity = !(session.userData.humidity)
          session.userData.details = false
          break
        case 'wind':
          session.userData.wind = !(session.userData.wind)
          session.userData.details = false
          break
        case 'country':
          session.userData.country = !(session.userData.country)
          break
      }
    }
  }

  session.endDialog("Saved!")
})

bot.dialog('/weather', (session) =>
{
  let preps = ['in', 'for']

  let msg = session.message.text
  let msgMatch = msg.match(/weather (.*)?/)
  if (!msgMatch[1]) return session.endDialog(replyArr[0])
  let location = msgMatch[1]
  for (let i = 0; i < preps.length; i++)
  {
    let _prep = preps[i]
    if (location.includes(_prep))
    {
      location = location.replace(_prep, '').trim()
    }
  }

  let showDetails = (msg.replace(msgMatch[1], '').includes('detail'))
  if (!location) return session.endDialog(replyArr[0])
  weather.byCityName(location, (data) =>
  {
    if (data.message) return session.endDialog(replyArr[0])

    let output = {
      location: data.name,
      resultStr: data.main.temp +' *'+ weather.getUnit().short,
    }

    if (session.userData.country) output.location += " ("+data.sys.country+")"
    if (showDetails || session.userData.details || session.userData.humidity)
    {
      output.resultStr += ", Humidity: "+data.main.humidity+"%"
    }
    if (showDetails || session.userData.details || session.userData.wind)
    {
      output.resultStr += ", Wind: "+data.wind.speed+" mph"
    }

    return session.endDialog(output.location+": "+ output.resultStr)
  })
})

let replyArr = [
  "Type !help for help guide",
  "Commands:\n\n0. help - displays this message\n\n1. weather <location> - \n\n2. settings",
  "Outputs weather for provided location\n\ne.g: detailed weather for Hatfield",
  "Configure your profile.\n\n\nAllowed params:",
  "unit - changes temperature unit (Kalvin, Celsius, Fahrenheit)\n\ne.g: set unit Kalvin",
  "toggle - toggle booleans settings\n\nAllowed params:\n\n - country - adds country short to weather result\n\n - details - enables details in weather result,\n\n - humidity - adds humidity info to weather result,\n\n - wind - adds wind info to weather result"
]
