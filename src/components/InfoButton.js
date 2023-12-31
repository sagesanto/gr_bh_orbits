import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

export default function InfoButton() {
    const [open, setOpen] = React.useState(false)
  
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            GR Orbit Simulator
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Sage Santomenna 2023. Based on original code by Professor Thomas Moore of Pomona College.
          </Typography>
        </Box>
      </Modal>
      </div>
    )
  }
