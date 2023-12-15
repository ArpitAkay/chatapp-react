import { Box, IconButton, Stack } from '@mui/material'
import SpeedDial from '../SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import GifIcon from '@mui/icons-material/Gif';
import StoreIcon from '@mui/icons-material/Store';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ContactsIcon from '@mui/icons-material/Contacts';
import PollIcon from '@mui/icons-material/Poll';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import TextField from '../TextField';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

interface ChatInboxFooterProps {
  messageValue: string
  setMessageFunction: (message: string) => void;
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Index = (props: ChatInboxFooterProps) => {
  const speedDialActionsForEmoji = [
    { icon: <SentimentSatisfiedAltIcon fontSize='small'/>, name: 'SentimentSatisfiedAltIcon' },
    { icon: <GifIcon fontSize='small'/>, name: 'GifIcon' },
    { icon: <StoreIcon fontSize='small'/>, name: 'StoreIcon' },
  ];
  const speedDialActionsForMedia = [
    {
      icon: <FiberNewIcon />,
      name: 'New Sticker'
    },
    {
      icon: <PollIcon />,
      name: 'Poll'
    },
    {
      icon: <ContactsIcon />,
      name: 'Contact'
    },
    {
      icon: <PhotoCameraIcon />,
      name: 'Camera'
    },
    {
      name: 'Photos & Videos',
      icon: <PermMediaIcon />
    },
    {
      icon: <FolderIcon />,
      name: 'Document'
    }
  ];

  return (
    <Stack direction={'row'} bgcolor={'#F0F2F5'} height={'9.2%'} display={'flex'}>
        <SpeedDial ariaLabel='SpeedDial' icon={<SpeedDialIcon openIcon={<CloseIcon />}/>} speedDialActions={speedDialActionsForEmoji} direction={'right'} />
        <SpeedDial ariaLabel='SpeedDial' icon={<SpeedDialIcon openIcon={<CloseIcon />}/>}  speedDialActions={speedDialActionsForMedia} direction={'right'} />
        <Box
        component={'form'} 
        style={{
          width: '85%',
          paddingLeft: '32px',
          paddingRight: '16px',
          display: 'flex',
          alignItems: 'center'
        }}
        onSubmit={(event) => props.sendMessage(event)}
        >
            <TextField variant={'outlined'} label={'Type a message'} value={props.messageValue} setFunction={props.setMessageFunction} multiline={true}/>
            {props.messageValue.trim() === '' && <IconButton aria-label='Mike-icon'>
                <MicIcon fontSize='large' color='inherit'/>
              </IconButton>
            }
            {props.messageValue.trim() !== '' && <IconButton type='submit' aria-label='Send-icon'>
                <SendIcon fontSize='large' color='inherit'/>
              </IconButton>
            }
        </Box>
    </Stack>
  )
}

export default Index
