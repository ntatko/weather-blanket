import './App.css';
import { AppBar, Button, Checkbox, Dialog, DialogContent, DialogTitle, Table, TableCell, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import Confetti from 'react-dom-confetti';

const getMonth = (int) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'][int]

const getDaysArray = function(start, end) {
  let sinceLastMonth = 0
  for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      const thisDate = new Date(dt)
      arr.push(thisDate);
      sinceLastMonth++

      if (sinceLastMonth === daysInMonth(thisDate.getMonth(), thisDate.getFullYear())) {
        arr.push({
          toDateString: () => `${getMonth(thisDate.getMonth())} - ${getMonth(thisDate.getMonth() + 1)}}`,
          isDivider: true
        })
        sinceLastMonth = 0
      }

  }
  return arr;
};

const getColorFromTemp = (temp) => {
  if (temp < 25) {
    return {name: 'White', color: '#ffffff2e'}
  } else if (25 <= temp && temp < 32) {
    return {name: 'Purple', color: '#8000802e'}
  } else if (32 <= temp && temp < 39) {
    return {name: 'Royal Blue', color: '#4169e12e'}
  } else if (39 <= temp && temp < 46) {
    return {name: '"Lupis" Blue', color: '#26619c2e'}
  } else if (46 <= temp && temp < 53) {
    return {name: 'Aqua', color: '#00FFFF2e'}
  } else if (53 <= temp && temp < 60) {
    return {name: 'Green', color: '#0064002e'}
  } else if (60 <= temp && temp < 67) {
    return {name: 'Light Green', color: '#00ff002e'}
  } else if (67 <= temp && temp < 74) {
    return {name: 'Yellow', color: '#ffff002e'}
  } else if (74 <= temp && temp < 81) {
    return {name: 'Gold', color: '#FFD7002e'}
  } else if (81 <= temp && temp < 88) {
    return {name: 'Orange', color: '#ffa5002e'}
  } else if (88 <= temp) {
    return {name: 'Red', color: '#ff00002e'}
  }
}

const daysInMonth = (month, year) => { // Use 1 for January, 2 for February, etc.
  return new Date(year, month, 0).getDate();
}

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

function App() {

  window.getColorFromTemp = getColorFromTemp

  if (!localStorage.getItem('dates')) localStorage.setItem('dates', JSON.stringify({}))
  if (!localStorage.getItem('weather')) localStorage.setItem('weather', JSON.stringify({}))
  if (!localStorage.getItem('dividers')) localStorage.setItem('dividers', JSON.stringify({}))

  const [ usedDates, setUsedDates ] = useState(JSON.parse(localStorage.getItem('dates')))
  const [ weatherDates, setWeatherDates ] = useState(JSON.parse(localStorage.getItem('weather')))
  const [ dividers, setDividers ] = useState(JSON.parse(localStorage.getItem('dividers')))

  const [ uploadDialogOpen, setUploadDialogOpen ] = useState(false)

  const updateDate = (date, value) => {
    if (date.isDivider) {
      const newUsedDividers = {
        ...dividers,
        [date.toDateString()]: value
      }
      setDividers(newUsedDividers)
      localStorage.setItem('dividers', JSON.stringify(newUsedDividers))
    } else {
      const newUsedDates = {
        ...usedDates,
        [date.toDateString()]: value
      }
      setUsedDates(newUsedDates)
      localStorage.setItem('dates', JSON.stringify(newUsedDates))
    }
  }

  const isDone = (date) => {
    if (date.isDivider) {
      console.log(date.toDateString())
      return Object.keys(dividers).includes(date.toDateString()) && dividers[date.toDateString()]
    }
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
            🔥🔥🔥🔥TEMPERATURE-BLANKET-INATOR🔥🔥🔥🔥
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20 }}>
        <Table stickyHeader>
          <TableHead>
            <TableCell>
              Completed?
            </TableCell>
            <TableCell>
              Date
            </TableCell>
            <TableCell>
              High Temp
            </TableCell>
            <TableCell>
              Color
            </TableCell>
          </TableHead>
          {getDaysArray(new Date("August 6, 2020 21:00:00"), Date.now()).map(date => (
            <>
              <Confetti active={ isDone(date) } config={ config } />
              <TableRow style={{ opacity: isDone(date) ? 0.5: 1, backgroundColor: weatherDates[date.toDateString()] ? getColorFromTemp(weatherDates[date.toDateString()]).color : 'white'}}>
                <TableCell>
                  <Checkbox onChange={() => updateDate(date, !isDone(date))} checked={isDone(date)} />
                </TableCell>
                <TableCell>
                  {date.isDivider ? 'DIVIDER' : date.toDateString()}
                </TableCell>
                <TableCell>
                  { date.isDivider
                    ? 'DIVIDER'
                    : weatherDates[date.toDateString()] ? <Typography>{weatherDates[date.toDateString()]}</Typography> : <Button onClick={() => setUploadDialogOpen(true)}>Add Missing Data</Button>}
                </TableCell>
                <TableCell>
                  { date.isDivider
                    ? 'DIVIDER PURPLE'
                    : weatherDates[date.toDateString()] ? getColorFromTemp(weatherDates[date.toDateString()]).name : 'Need Temp Data' }
                </TableCell>
              </TableRow>
            </>
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
