import './App.css'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import React, {Profiler,useState,useRef, useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PlotManager from './components/Plot'
import SpinSlider from './components/SpinSlider'
import AngSpeedSlider from './components/AngSpeedSlider'
import GR_Switch from './components/GR_Switch'
import RCoordSelector from './components/RCoordSelector'
import τCoordSelector from './components/TauCoordSelector'
import ProperTimeDisplay from './components/ProperTimeDisplay'
import SimSpeedSlider from './components/SimSpeedSlider'
import ResetButton from './components/ResetButton'
import InfoButton from './components/InfoButton'
import { setSimulationRunning,setResetSim } from './state/slices'
import {useDispatch, useSelector} from 'react-redux'
import { useFPS } from './state/FPSContext'
import { IconButton } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

function logProfile(id, phase, actualTime, baseTime, startTime, commitTime) {
  console.log(`--- ${id}'s ${phase} phase: ---`)
  console.log(`Actual time: ${actualTime}`)
  console.log(`Base time: ${baseTime}`)
  console.log(`Start time: ${startTime}`)
  console.log(`Commit time: ${commitTime}`)
}

function LabeledBox({ label, height=90, children }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: `${height}px`, m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#fff', px: 0.01 }}>
        {label}
      </Typography>
      <Card variant="outlined" sx={{ width: '100%', height: '100%', p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </Card>
    </Box>
  )
}

function FPSCounter() {
  const { fps } = useFPS()
  return (
    <Typography align="center" variant="h6">
      {fps} FPS
    </Typography>
  )
}

function PlayButton({ }) {
  const simulationRunning = useSelector((state) => state.simulationRunning.value)
  const collided = useSelector((state) => state.collided.value)

  const [buttonIcon, setButtonIcon] = useState(PauseIcon)
  const dispatch = useDispatch()

  const HandleClick = () => {
    if (collided) {
      dispatch(setResetSim(true))
    }
    setButtonIcon(!simulationRunning ? 'PauseIcon' : 'PlayArrowIcon')
    dispatch(setSimulationRunning(!simulationRunning))
  }
  useEffect(() => {
    if (simulationRunning) {
      setButtonIcon('PauseIcon')
    } else {
      setButtonIcon('PlayArrowIcon')
    } 
  },[simulationRunning])

  return (
    <IconButton onClick={HandleClick} style ={{color: '#1976d2',borderColor: '#1976d2', border: '1px solid', borderRadius:10}}>
      {buttonIcon === 'PauseIcon' ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  )
}

function App(props) {
  console.log("app init")
  const drawerWidth = 300

  const drawer = (
    <div>
    <Stack spacing={2} sx={{ width: {drawerWidth}, paddingY: 2, paddingX: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GR_Switch/>
        </Box>

        <LabeledBox label="Initial r coord">
          <RCoordSelector/>
        </LabeledBox>

        <LabeledBox label="ω₀">
          <AngSpeedSlider/>
        </LabeledBox>

        <LabeledBox label="Simulation Speed">
          <SimSpeedSlider/>
        </LabeledBox>

        <LabeledBox label="τ Resolution">
          <Box>
            <τCoordSelector/>
          </Box>
        </LabeledBox>

        <LabeledBox label="Central Object Spin">
          <SpinSlider/>
        </LabeledBox>

        <LabeledBox label="Elapsed τ" height={80} >
          <ProperTimeDisplay/>
        </LabeledBox>
        <PlayButton />
        <ResetButton/>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <InfoButton/>
        </Box>
        {/* <FPSCounter/> */}
      </Stack>
    </div>
  )

  return (
  <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box sx = {{flexGrow: 1, height: '100vh'}}>
        <PlotManager/>
      </Box>

  </Box>
  )
}
export default App
