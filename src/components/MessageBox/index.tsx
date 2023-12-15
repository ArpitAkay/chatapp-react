import { Box, Typography } from '@mui/material'

interface MessageBoxProps {
    position: 'end' | 'start'
    backgroundColor: string
    message: string
    timpstamp: Date | undefined
}

const Index = (props: MessageBoxProps) => {
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
            <Typography variant="body1">
              {props.message}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'end'}}>
                  <Typography variant="caption" color='grey' fontSize='12px'>
                    11:30
                  </Typography>
            </Box>  
        </Box>
    </Box>
  )
}

export default Index
