import React from 'react'
import { useDispatch } from 'react-redux'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { setResetSim } from '../state/slices'

export default function ResetButton() {
    const dispatch = useDispatch()

    return (
        <Tooltip title="Resets the state of the simulation. Will not reset parameters.">
            <Button variant='outlined'
            color="secondary"
            onClick={() => dispatch(setResetSim(true))}
            sx={{ borderColor: 'red', color: 'red', '&:hover': { boxShadow: '0 0 10px red',} }}
            >
                Reset Simulation
            </Button>
        </Tooltip>
    )
}

