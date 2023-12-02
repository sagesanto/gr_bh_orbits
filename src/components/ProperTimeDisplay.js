import React from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


export default function ProperTimeDisplay() {
    const properTime = useSelector((state) => state.properTime.value)
    return (
    <Box>
        <Typography align="center" variant="h6">τ = {properTime.toFixed(3)} GM</Typography>
    </Box>
    )
}