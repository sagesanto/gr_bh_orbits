import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSimSpeed } from '../state/slices'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'

export default function SimSpeedSlider () {
    const simSpeed = useSelector((state) => state.simSpeed.value)
    const dispatch = useDispatch()
    const max_fps = 60
    const min_fps = 0.1
    return (
        <Grid container direction="column" alignItems="stretch">
        <Tooltip title="Simulation speed, in ticks per second.">
            <div>
            <Grid item container justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ marginRight: 2 }}> {min_fps} </Typography>
            <Grid item xs>
                <Slider 
                aria-labelledby="continuous-slider"
                defaultValue={100}
                min={min_fps}
                max={max_fps}
                step={0.1}
                onChange={(_, newValue) => dispatch(setSimSpeed(newValue))}
                valueLabelDisplay="off"
                />
            </Grid>
            <Typography variant="caption" sx={{ marginLeft: 2 }}> {max_fps} </Typography>
            </Grid>
            <Grid item container justifyContent="center">
                <Typography align="center">
                {simSpeed} TPS
                </Typography>
            </Grid>
            </div>
            </Tooltip>
            </Grid>
    )
}