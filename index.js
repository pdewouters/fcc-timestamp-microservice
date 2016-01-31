'use strict'
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const moment = require('moment')
const url = require('url')

app.set('port', (process.env.PORT || 5000))

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('Host')
    res.render('home', {url1: baseUrl + '/1450137600', url2: baseUrl + encodeURIComponent('/Dec 20, 2015')})
})

app.get('/:date', (req, res) => {
    
    // Set response type header for JSON
    res.header("Content-Type", "application/json")
    
    // Initialize the response with default values. This is the response for invalid dates
    let response = JSON.stringify({unix: null, natural: null})
    
    // Get the date passed as parameter and test if its a unix timestamp
    let m = moment.unix(req.params.date)
    
    // If we have a timestamp
    if(m.isValid()){
        // then create a natural date from it
        let natural = m.format('LL')
        
        // Build response string
        response = JSON.stringify({unix:req.params.date, natural:natural})
        
    // If we have a natural date
    } else if(moment(new Date(req.params.date))){
        
        // Convert to a timestamp
        let unix = moment(new Date(req.params.date)).unix()
        
        // Build our response string
        response = JSON.stringify({unix:unix, natural:moment(new Date(req.params.date)).format("LL")})
    }

    res.send(response)
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})