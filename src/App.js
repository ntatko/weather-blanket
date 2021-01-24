import logo from './logo.svg';
import './App.css';
import { AppBar, Button, Checkbox, Dialog, DialogContent, DialogTitle, Input, Table, TableCell, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react'


const getDaysArray = function(start, end) {
  for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

const getColorFromTemp = (temp) => {
  if (temp < 25) {
    return {name: 'Purple', color: '#'}
  } else if (32 < temp && temp <= 25) {
    return {name: 'Blue', color: '#'}
  } else if (32 <= temp && temp < 39) {
    return {name: 'Royal Blue', color: '#'}
  } else if (39 <= temp && temp < 46) {
    return {name: '"Lupis" Blue', color: '#'}
  } else if (46 <= temp && temp < 53) {
    return {name: 'Aqua', color: '#'}
  } else if (53 <= temp && temp < 60) {
    return {name: 'green', color: '#'}
  } else if (60 <= temp && temp < 67) {
    return {name: 'Light Green', color: '#'}
  } else if (67 <= temp && temp < 74) {
    return {name: 'Yellow', color: '#'}
  } else if (74 <= temp && temp < 81) {
    return {name: 'Gold', color: '#'}
  } else if (81 <= temp && temp< 88) {
    return {name: 'Orange', color: '#'}
  } else if (88 <= temp) {
    return {name: 'Red', color: '#'}
  }
}

function App() {

  window.getColorFromTemp = getColorFromTemp

  if (!localStorage.getItem('dates')) localStorage.setItem('dates', JSON.stringify({}))
  if (!localStorage.getItem('weather')) localStorage.setItem('weather', JSON.stringify({}))

  const [ usedDates, setUsedDates ] = useState(JSON.parse(localStorage.getItem('dates')))
  const [ weatherDates, setWeatherDates ] = useState(JSON.parse(localStorage.getItem('weather')))
  const [ uploadDialogOpen, setUploadDialogOpen ] = useState(false)

  const updateDate = (date, value) => {
    const newUsedDates = {
      ...usedDates,
      [date.toDateString()]: value
    }
    setUsedDates(newUsedDates)
    localStorage.setItem('dates', JSON.stringify(newUsedDates))
  }

  const isDone = (date) => {
    return Object.keys(usedDates).includes(date.toDateString()) && usedDates[date.toDateString()]
  }

  const handleWeatherAdd = (event) => {
    const text = event.target.value

    console.log("text", text)
    const monthString = text.split(' ')[0]
    const weatherData = text.split('Max\tAvg\tMin')[0].split(' ').splice(1).map(e => e.trim()).filter(e => e).reduce((acc, e, i) => {
      let year = 2021
      if (Date.now() - new Date(`${e} ${monthString} ${year}`) < 0) {
        year = 2020
      }

      const date = new Date(`${e} ${monthString} ${year}`)
      const high = text.split('Max\tAvg\tMin')[1].split(' ').filter(e => e)[i].split('\t')[0]

      console.log(date, high)
      return {
        ...acc,
        [date.toDateString()]: high
      }
    }, {})

    const newWeatherData = {...weatherDates, ...weatherData}
    setWeatherDates(newWeatherData)
    localStorage.setItem('weather', JSON.stringify(newWeatherData))
    setUploadDialogOpen(false)
  }

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography>
            🔥🔥🔥🔥TEMPERATUREBLANKETINATOR🔥🔥🔥🔥
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20 }}>
        <Table>
          {getDaysArray(new Date("August 6, 2020 21:00:00"), Date.now()).map(date => (
            <TableRow style={{ opacity: isDone(date) ? 0.5: 1}}>
              <TableCell>
                <Checkbox onChange={() => updateDate(date, !isDone(date))} checked={isDone(date)} />
              </TableCell>
              <TableCell>
                {date.toDateString()}
              </TableCell>
              <TableCell>
                {weatherDates[date.toDateString()] ? <Typography>{weatherDates[date.toDateString()]}</Typography> : <Button onClick={() => setUploadDialogOpen(true)}>Add Missing Data</Button>}
              </TableCell>
              <TableCell>
                { weatherDates[date.toDateString()] ? getColorFromTemp(weatherDates[date.toDateString()]).name : 'Need Temp Data' }
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
      <Dialog open={uploadDialogOpen}>
        <DialogTitle>
          Paste in weather data from Wunderground
        </DialogTitle>
        <DialogContent>
          <TextField variant='outlined' onChange={handleWeatherAdd} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
