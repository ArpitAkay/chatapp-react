import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material'
import Data from '../Data'
import { useEffect, useRef, useState } from 'react'
import { WebServiceInvokerRest } from '../../util/WebServiceInvokerRest'
import { APIResponse } from '../../types/ApiResponse'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserInfo } from '../../redux/slices/UserInfoSlice'

const Index = () => {
    const [username, setUsername] = useState<string>('');
    const [initialUsername, setInitialUsername] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [initialStatus, setInitialStatus] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [coordinates, setCoordinates] = useState<{x: number, y: number}>({x: 0, y: 0});
    const userInfoSelector = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch();
    const [profilePic, setProfilePic] = useState<File>();
    const [profilePicBase64, setProfilePicBase64] = useState<string>();
    const profilePictureRef = useRef<HTMLInputElement>(null);

    const fetchUserInfo = async () => {
      const hostname = process.env.REACT_APP_HOST_AND_PORT;
      const urlContent = process.env.REACT_APP_GET_USER_INFO
      if(hostname === undefined || urlContent === undefined) {
        return;
      }

      const userInfoParams: {
        id: number
      } = {
        id: userInfoSelector.id
      }

      const response: APIResponse = await WebServiceInvokerRest<null, null, {id: number}, APIResponse>(
        hostname,
        urlContent,
        "GET",
        null,
        null,
        userInfoParams
      );

      if(response.status === 200) {
        setUsername(response.data.name);
        setInitialUsername(response.data.name);
        setStatus(response.data.profileStatus ? response.data.profileStatus : '');
        setInitialStatus(response.data.profileStatus ? response.data.profileStatus : '');
      }
      else {
        console.log("Error while fetching chatting list");
      }
    }

    const updateUserInformation = async () => {
      const hostname = process.env.REACT_APP_HOST_AND_PORT;
      const urlContent = process.env.REACT_APP_UPDATE_USER_INFO
      if(hostname === undefined || urlContent === undefined) {
        return;
      }

      const userInfoParams: {
        id: number
      } = {
        id: userInfoSelector.id
      }

      const userInfoBody: {
        name?: string,
        profileStatus?: string
      } = {};

      if(username !== initialUsername) userInfoBody.name = username; 
      if(status !== initialStatus) userInfoBody.profileStatus = status;

      //check object is empty or not
      if(Object.keys(userInfoBody).length === 0) {
        return;
      }

      const response: APIResponse = await WebServiceInvokerRest<null, {name?: string, status?: string}, {id: number}, APIResponse>(
        hostname,
        urlContent,
        "PATCH",
        null,
        userInfoBody,
        userInfoParams
      );

      if(response.status === 200) {
        dispatch(updateUserInfo(
          {
            name: response.data.name
          }));
      }
      else {
        console.log("Error while fetching chatting list");
      }
    }

    const handleProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if(file) {
        setProfilePic(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (reader.result) setProfilePicBase64(reader.result.toString());
        }
      }
    }

    useEffect(() => {
      fetchUserInfo();
      // eslint-disable-next-line
    }, []);

  return (
    <Box >
        <Box sx={{display: 'flex', justifyContent: 'center', paddingY: 4}}>
            <Avatar 
            src={profilePicBase64}
            alt='Profile picture'
            sx={{width: '200px', height: '200px'}} 
            onClick={(e) => {
              setAnchorEl(e.currentTarget)
              setCoordinates({x: e.clientX, y: e.clientY})
            }}/>
            <input type='file' ref={profilePictureRef} onChange={handleProfilePicture} accept='image/x-png,image/gif,image/jpeg' hidden/>
            <Menu 
            anchorEl={anchorEl} 
            open={open} 
            onClose={() => setAnchorEl(null)}
            anchorPosition={{ top: coordinates.y, left: coordinates.x }}
            anchorReference="anchorPosition"
            >
              <MenuItem>Take Photo</MenuItem>
              <MenuItem onClick={() => {
                profilePictureRef.current?.click()
                setAnchorEl(null)
              }}>Upload Photo</MenuItem>
            </Menu>
        </Box>
        <Box sx={{backgroundColor: '#FFFFFF', paddingX: 4, paddingY: 2}}>
            <Data label={'Your name'} labelColor={'#008069'} value={username} setFunction={setUsername} updateUserInformation={updateUserInformation}/>
        </Box>
        <Box sx={{paddingX: 4, paddingTop: 2, paddingBottom: 4}}>
          <Typography variant='subtitle2'>
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </Typography>
        </Box>
        <Box sx={{backgroundColor: '#FFFFFF', paddingX: 4, paddingY: 2}}>
            <Data label={'About'} labelColor={'#008069'} value={status} setFunction={setStatus} updateUserInformation={updateUserInformation}/>
        </Box>
    </Box>
  )
}

export default Index
