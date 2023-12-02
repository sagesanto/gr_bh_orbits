import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setInitialRadius } from '../state/slices'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export default function RCoordSelector() {
    const r = useSelector((state) => state.initialRadius.value)
    const dispatch = useDispatch()  
    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel id="r-label">r</InputLabel>
        <Select
          labelId="r-label"
          value={r}
          onChange={(event) => dispatch(setInitialRadius(event.target.value))}
          label="r"
          native={false}
          sx={{
            '& .MuiSelect-icon': {
              color: '#1976d2',
            },
          }}
        >
          <MenuItem value={5}>5 GM</MenuItem>
          <MenuItem value={15}>15 GM</MenuItem>
          <MenuItem value={50}>50 GM</MenuItem>
          <MenuItem value={150}>150 GM</MenuItem>
        </Select>
      </FormControl>
    )
  }