import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
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
import { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { grey } from '@mui/material/colors';
import WaveSurfer from 'wavesurfer.js';

interface ChatInboxFooterProps {
  messageValue: string
  setMessageFunction: (message: string) => void;
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Index = (props: ChatInboxFooterProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder>();
  const audioStream = useRef<MediaStream>();
  const mediaRef = useRef<HTMLElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const audioUrl = useRef<string>('');
  const waveSurferRef = useRef<WaveSurfer>();

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

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunks.current = audioChunks.current.concat(event.data);
    }
  }

  const handleStop = () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    audioUrl.current = url;
    console.log(waveSurferRef.current);
    waveSurferRef.current?.load(url);
  }

  const setupMediaRecorder = () => {
    mediaRecorder.current?.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorder.current?.addEventListener('stop', handleStop);
  }

  const startRecording = async () => {
    if(!isRecording) {
      setIsRecording(true);
      try {
        audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(audioStream.current, { mimeType: "audio/webm;" });
        setupMediaRecorder();

        mediaRecorder.current.start();
      } catch(err) {
        console.error('Error accessing microphone:', err);
      }
    } else {
      setIsRecording(false);
      mediaRecorder.current?.pause();
    }
  }

  const deleteRecording = () => {
    if (mediaRecorder.current && isRecording) {
      setIsRecording(false);
      setIsPaused(false);
      audioChunks.current = [];
      mediaRecorder.current.removeEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.current.removeEventListener('stop', handleStop);
      mediaRecorder.current = undefined;
    }
  };
  
  const pauseRecording = () => {
    setIsPaused(true);
    setPlayAudio(false);
    if (mediaRecorder.current && isRecording) {
      setIsRecording(false);
      mediaRecorder.current?.stop();
      audioStream.current?.getTracks().forEach((track) => track.stop());
    }
  }

  const resumeRecording = () => {
    setIsPaused(false);
    setPlayAudio(!playAudio);
    if (mediaRecorder.current && !isRecording) {
      setIsRecording(true);
      startRecording();
    }
  };

  const playAudioRecording = () => {
    setPlayAudio(!playAudio);
    const audioElement = new Audio();
    audioRef.current = audioElement;
    audioElement.src = audioUrl.current;
    mediaRef.current?.appendChild(audioElement);
    audioRef.current.play();
  }

  const stopAudioRecording = () => {
    setPlayAudio(false);
    audioRef.current?.pause();
  }

  useEffect(() => {
    if(isRecording && !waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'grey',
        progressColor: 'purple',
        cursorColor: 'transparent',
        height: 40,
        normalize: true,
        backend: 'WebAudio',
        barWidth: 4,
        barGap: 2
      });
    }
  }, [isRecording]);

  return (
    <>
      {!isRecording && !isPaused && <Stack direction={'row'} bgcolor={'#F0F2F5'} height={'9.2%'} display={'flex'}>
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
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              props.sendMessage(event);
            }
          }}
          >
              <TextField variant={'outlined'} label={'Type a message'} value={props.messageValue} setFunction={props.setMessageFunction} multiline={true}/>
              {props.messageValue.trim() === '' && <IconButton aria-label='Mike-icon' onClick={startRecording} disableRipple>
                  <MicIcon fontSize='large' color='inherit'/>
                </IconButton>
              }
              {props.messageValue.trim() !== '' && <IconButton type='submit' aria-label='Send-icon'>
                  <SendIcon fontSize='large' color='inherit'/>
                </IconButton>
              }
          </Box>
      </Stack>}
      {(isRecording || isPaused) && 
      <Stack bgcolor={'#F0F2F5'} height={'9.2%'} alignItems={'end'} justifyContent={'center'}>
        <Stack direction={'row'} marginRight={2}>
          {/* Delete Recording */}
          <IconButton onClick={deleteRecording} disableRipple>
            <DeleteIcon fontSize='large'/>
          </IconButton>
          <Stack
          sx={{
            width: '20em',
            height: '3em',
            backgroundColor: 'white',
            borderRadius: 10,
            paddingLeft: 2
          }}
          direction={'row'}
          spacing={0}
          alignContent={'center'}
          >
            {/* <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Typography variant='h6' color={grey[800]}>0:11</Typography>
            </Box> */}
            {/* Play Audio */}
            {isPaused && !playAudio && <Box sx={{display: 'flex', alignItems: 'center'}}>
              <IconButton onClick={playAudioRecording} disableRipple>
                <PlayArrowIcon />
              </IconButton>
            </Box>}
            {/* Pause Audio */}
            {isPaused && playAudio && <Box sx={{display: 'flex', alignItems: 'center'}}>
              <IconButton onClick={stopAudioRecording} disableRipple>
                <PauseIcon />
              </IconButton>
            </Box>}
            <Paper sx={{
              overflowX: 'scroll',
              width: '13em',
              height: '3em',
              paddingX: 1,
              marginLeft: 1
            }}>
              <Box 
              id='waveform'
              ref={mediaRef}
              mt={'4px'}
              >
              </Box>
            </Paper>
          </Stack>
          {/* Resume Recording */}
          {isPaused && <IconButton disableRipple onClick={resumeRecording}>
            <MicIcon fontSize='large' color='error'/>
          </IconButton>}
          {/* Pause Recording */}
          {!isPaused && <IconButton disableRipple onClick={pauseRecording}>
            <PauseCircleOutlineIcon fontSize='large' color='error'/>
          </IconButton>}
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <IconButton sx={{backgroundColor: '#008069', color: 'white'}} disableRipple>
              <SendIcon fontSize='medium'/>
            </IconButton>
          </Box>
        </Stack>
      </Stack>}
    </>
  )
}

export default Index
