import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTdiv } from '../state/slices'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'



export default function τCoordSelector() {
    const τ = useSelector((state) => state.tdiv.value)
    const simulationRunning = useSelector((state) => state.simulationRunning.value)

    const dispatch = useDispatch()
  
    const [tooltipOpen, setTooltipOpen] = React.useState(false)
    const [menuOpen, setMenuOpen] = React.useState(false)
    
    const handleMouseEnter = () => {
      setTooltipOpen(true)
    }
    
    const handleMouseLeave = () => {
      setTooltipOpen(false)
    }
    
    const handleMenuOpen = () => {
      setMenuOpen(true)
    }
    
    const handleMenuClose = () => {
      setMenuOpen(false)
      setTooltipOpen(false)
    }
    
    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip title="Proper time resolution" open={tooltipOpen && !menuOpen}>
        <div>
          <Typography align="center" variant="h6">τ for circular orbit</Typography>
          <Divider sx={{ height: '2px', backgroundColor: 'grey.500' }} />
          <FormControl fullWidth variant="standard"
            sx={{
              '& .MuiInput-underline:after': {
                borderBottom: 'none',
              },
              '& .MuiInput-underline:before': {
                borderBottom: 'none',
              },
            }}
          >
            <Select
              labelId="τ-label"
              value={τ}
              onChange={(event) => dispatch(setTdiv(event.target.value))}
              onOpen={handleMenuOpen}
              onClose={handleMenuClose}
              disabled = {simulationRunning}
              open={menuOpen}
                native={false}
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#1976d2',
                  },
                  '& .MuiSelect-select': {
                    textAlign: 'center',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
                <MenuItem value={5000}>5000</MenuItem>
                <MenuItem value={10000}>10000</MenuItem>
              </Select>
            </FormControl>
          </div>
      </Tooltip>
      </div>
    )
  }