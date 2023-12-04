import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setGR } from '../state/slices'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'


export default function GR_Switch() {
    const gr = useSelector((state) => state.gr.value)
    const simulationRunning = useSelector((state) => state.simulationRunning.value)
    const dispatch = useDispatch()  
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>Newtonian</Typography>
        <Switch checked={gr} disabled = {simulationRunning} onChange = {(_, newValue) => dispatch(setGR(newValue))} />
        <Typography>GR</Typography>
      </Box>
    )
}