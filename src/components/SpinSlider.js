import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSpin } from '../state/slices'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'

export default function SpinSlider () {
  const spin = useSelector((state) => state.spin.value)
  const simulationRunning = useSelector((state) => state.simulationRunning.value)

  const dispatch = useDispatch()
  return (
    <Grid container direction="column" alignItems="stretch">
        <Grid item container justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ marginRight: 2 }}> 0 </Typography>
        <Grid item xs>
            <Slider 
            aria-labelledby="continuous-slider"
            defaultValue={0}
            min={0}
            max={1}
            step={0.01}
            disabled = {simulationRunning}
            onChange={(_, newValue) => dispatch(setSpin(newValue))}
            valueLabelDisplay="off"
            />
        </Grid>
        <Typography variant="caption" sx={{ marginLeft: 2 }}> 1 </Typography>
        </Grid>
        <Grid item container justifyContent="center">
            <Typography align="center">
            {spin.toFixed(2)} GM
            </Typography>
        </Grid>
    </Grid>
  )
}