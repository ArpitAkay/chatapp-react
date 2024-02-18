import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useCallback, useRef, useState } from 'react';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { grey } from '@mui/material/colors';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch, useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvokerRest';
import { APIResponse } from '../../types/ApiResponse';
import { updateProfileImageUrl } from '../../redux/slices/UserInfoSlice';

interface DialogTakePhotoProps {
    isDialogBoxOpen: boolean;
    setIsDialogBoxOpen: (value: boolean) => void
}

const Index = (props: DialogTakePhotoProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const webcamRef = useRef<null | Webcam>(null);
  const capture = useCallback(
    () => {
      if(webcamRef.current === null) return;
      const image = webcamRef.current.getScreenshot();
      if(image !== null) setImageSrc(image);
    },
    [webcamRef]
  );
  const userInfoSelector = useSelector((state: any) => state.userInfo);
  const dispatch = useDispatch();

  const base64UriToFile = (base64Uri: string) => {
    const byteString = atob(base64Uri.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  const updateProfileImage = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_UPLOAD_PROFILE_IMAGE
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const headers: {
      'Content-Type': string
    } = {
      'Content-Type': 'multipart/form-data'
    }

    const formData = new FormData();
    formData.append('id', userInfoSelector.id.toString());
    formData.append('profileImage', base64UriToFile(imageSrc));

      const response: APIResponse = await WebServiceInvokerRest<{ 'Content-Type': string }, FormData, null, APIResponse>(
        hostname,
        urlContent,
        "POST",
        headers,
        formData,
        null
      );

      if(response.status === 200) {
        dispatch(updateProfileImageUrl({
          profileImageUrl: response.data.profileImageUrl
        }));
      }
      else {
        console.log("Error while fetching chatting list");
      }
      props.setIsDialogBoxOpen(false);
  }

  return (
    <Dialog open={props.isDialogBoxOpen}>
        <DialogTitle sx={{backgroundColor: '#008069'}}>
          <Stack direction={'row'} spacing={2}>
              <IconButton disableRipple sx={{padding: 0, color: grey[400]}} onClick={() => props.setIsDialogBoxOpen(false)}>
                <CloseIcon />
              </IconButton>
              <Box width={'17.5em'}>
                <Typography variant="body1" component="div" color={'white'}>
                  {imageSrc ? 'Drag the image to adjust' : 'Take Photo'}
                </Typography>
              </Box>
              {imageSrc && <Stack direction={"row"} spacing={0.5}>
                <IconButton 
                sx={{
                  rotate: '90deg',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: '#008069',
                    color: 'white'
                  },
                  color: 'white'
                }}
                onClick={() => setImageSrc('')}
                >
                  <UTurnLeftIcon />
                </IconButton>
                <Typography variant="subtitle2" component="div" color={'white'} onClick={() => setImageSrc('')} 
                sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}>Retake</Typography>
              </Stack>}
            </Stack>
        </DialogTitle>
        <DialogContent
        sx={{
          padding: 0
        }}
        >
          {imageSrc && <Box component='img' src={imageSrc} alt='Image captured'>
          </Box>}
          {!imageSrc && <Webcam
          audio={false}
          height={'400em'}
          width={'533em'}
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          /> }
          {!imageSrc && <IconButton 
          sx={{
            '&:hover': {
              backgroundColor: '#008069',
              color: 'white'
            },
            position: 'absolute', 
            bottom: '75px', 
            right: '250px', 
            color: 'white', 
            backgroundColor: '#008069'
          }} 
          size='large'
          onClick={capture}
          disableRipple
          >
            <CameraAltIcon />
          </IconButton>}
          {imageSrc && <IconButton
          size='large'
          sx={{
            '&:hover': {
              backgroundColor: '#008069',
              color: 'white'
            },
            position: 'absolute',
            bottom: '75px',
            right: '20px',
            color: 'white',
            backgroundColor: '#008069'
          }}
          onClick={updateProfileImage}
          >
            <DoneIcon />
          </IconButton>}
        </DialogContent>
        <DialogActions sx={{backgroundColor: "#E9EDEF", height: '5em'}}>

        </DialogActions>
    </Dialog>
  )
}

export default Index
