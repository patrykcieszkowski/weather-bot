# WeatherOne
### Sample bot written on top of Microsoft Bot Framework
[![license](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/patrykcieszkowski/weatherOne)
[![paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Z75DMS8AVZY5Y)

# Contents
  - [Installation](#installation-)
  - [Start-Up](#startup-)
  - [Commands](#commands-)

# Installation [^](#installation-)
  ```js
    $ git clone https://github.com/patrykcieszkowski/weatherOne.git
  ```

  Once you do so, remember to config your app. You need to generate API Key for [OpenWeatherMap.org](http://openweathermap.org/). You can this in ` app.js ` file.

# Start-Up [^](#startup-)
  ```
    node app.js
  ```

  Here's list of start-up params.
  
  - ` NAME ` - App name. Optional. (default: WeatherOne)
  - ` PORT ` - port to run app on. Optional. (default: 8080)
  - ` MICROSOFT_APP_ID ` - microsoft app id. Required in order to run bot online.
  - ` MICROSOFT_APP_PASSWORD` - microsoft password. Required in order to run bot online.
  - ` OPEN_WEATHER_MAP_KEY ` - API Key for [OpenWeatherMap.org](http://openweathermap.org/). Required.

# Commands [^](#commands-)

  - ` help ` 
  - ` settings|set `
    * ` unit ` - changes temperature unit (` Kalvin `, ` Celsius `, ` Fahrenheit `) (default: Celsius)
    * ` toggle ` - toggle booleans settings
     * ` country ` - adds country short to weather result
     * ` details ` - enables details in weather result
     * ` humidity ` - adds humidity info to weather result
     * ` wind ` - adds wind info to weather result
  - ` weather ` - Outputs weather for provided location
    
