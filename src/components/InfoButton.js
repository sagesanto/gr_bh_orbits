import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: '50vw',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

export default function InfoButton() {
    const [open, setOpen] = React.useState(true)
  
    return (
      <div>
      <IconButton onClick={() => setOpen(true)}> <InfoIcon /> </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx = {style}>
        <Typography id="modal-modal-title"  sx={{ mt: 2}}>
            GR Orbit Simulator
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, overflowWrap: 'break-word' }} style={{ fontWeight: 300 }}>
            This program simulates the motion of a test particle in orbit around a compact object with mass M centered at r = 0. The object begins at r = 15GM, τ = 0  at the top of the screen and begins to orbit with the specified parameters. <br />
            The gray circle indicates the event horizon of the compact object. The simulation ends if the object reaches the singularity at r=0.
          </Typography>
          <Typography id="modal-modal-description2" sx={{ mt: 2 }}>
            Sage Santomenna 2023-2024 <br />
            Based on original code by Professor Thomas Moore of Pomona College.
          </Typography>
        </Box>
      </Modal>
      </div>
    )
  }
