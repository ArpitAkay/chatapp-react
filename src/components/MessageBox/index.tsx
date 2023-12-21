import { Box, Typography } from '@mui/material'

interface MessageBoxProps {
    position: 'end' | 'start'
    backgroundColor: string
    message: string
    timpstamp: string
}

const Index = (props: MessageBoxProps) => {

  const formatTime = (date: string) => {
    const isoDate = new Date(date);
    const hour = String(isoDate.getHours()).padStart(2, '0');
    const minute = String(isoDate.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  }

  return (
    <Box display={'flex'} justifyContent={props.position}>
        <Box sx={{
            display: 'inline-block',
            paddingX: '10px',
            paddingTop: '4px',
            marginTop: 1,
            backgroundColor: props.backgroundColor,
            borderRadius: 2,
            maxWidth: '65%'
        }}>
            <Typography variant="body1" sx={{whiteSpace: 'pre-line'}}>
              {props.message}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'end'}}>
                  <Typography variant="subtitle2" color='grey' fontSize='12px'>
                    {formatTime(props.timpstamp)}
                  </Typography>
            </Box>  
        </Box>
    </Box>
  )
}

export default Index
