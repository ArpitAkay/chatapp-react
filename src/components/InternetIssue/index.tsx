import PermScanWifiSharpIcon from '@mui/icons-material/PermScanWifiSharp';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { amber } from '@mui/material/colors';

const Index = () => {
  return (
    <Box sx={{padding: 1, backgroundColor: amber[200]}}>
        <Stack spacing={2} direction='row'>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconButton sx={{backgroundColor: 'white'}} size='large'>
                    <PermScanWifiSharpIcon sx={{color: amber[200]}}/>
                </IconButton>
            </Box>
            <Stack spacing={0} direction={'column'} alignItems={'start'}>
                <Typography variant="body1">Computer not connected</Typography>
                <Typography variant="body2">Make sure your computer has an active internet connection</Typography>
                <Button variant="text" size="small" endIcon={<ArrowForwardIosSharpIcon />} sx={{color: 'black', fontSize: '12px',padding: 0, marginY: '4px', '&:hover': {
                    ":focus": {
                        backgroundColor: 'transparent'
                    }
                }}} disableRipple>
                    Reconnect
                </Button>
            </Stack>
        </Stack>
    </Box>
  )
}

export default Index
