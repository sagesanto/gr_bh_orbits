import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


export default function ProperTimeDisplay() {
    const properTime = useSelector((state) => state.properTime.value)
    return (
    <Box>
        <Typography align="center" variant="h6" fontFamily={"'Roboto Condensed', sans-serif "} fontSize={"1.5rem"} lineHeight={1.5} letterSpacing={"0.00938em"} >τ = {properTime.toFixed(3)} GM</Typography>
    </Box>
    )
}