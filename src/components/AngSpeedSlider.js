import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAngVel } from '../state/slices'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'

export default function AngSpeedSlider () {
  const angularVel = useSelector((state) => state.angularVel.value)
  const simulationRunning = useSelector((state) => state.simulationRunning.value)
  const dispatch = useDispatch()
  return (
    <Grid container direction="column" alignItems="stretch">
    <Tooltip title="Initial angular velocity, as a fraction of the speed required for a circular orbit at the given initial radius">
        <div>
        <Grid item container justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ marginRight: 2 }} >  -1 </Typography>
        <Grid item xs>
            <Slider 
            aria-labelledby="continuous-slider"
            defaultValue={0}
            min={-1}
            max={1}
            step={0.01}
            onChange={(_, newValue) => dispatch(setAngVel(newValue))}
            valueLabelDisplay="off"
            disabled={simulationRunning}
            />
        </Grid>
        <Typography variant="caption"  sx={{ marginLeft: 2 }}> +1 </Typography>
        </Grid>
        <Grid item container justifyContent="center">
            <Typography align="center" >
            {angularVel.toFixed(2)} ω<sub>c</sub>
            </Typography>
        </Grid>
        </div>
        </Tooltip>
        </Grid>
  )
}