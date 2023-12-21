import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material'
import Data from '../Data'
import { useRef, useState } from 'react'
import { WebServiceInvokerRest } from '../../util/WebServiceInvokerRest'
import { APIResponse } from '../../types/ApiResponse'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileImageUrl, updateUserInfo } from '../../redux/slices/UserInfoSlice'

const Index = () => {
    const userInfoSelector = useSelector((state: any) => state.userInfo);
    const [username, setUsername] = useState<string>(userInfoSelector.name ? userInfoSelector.name : '');
    const [status, setStatus] = useState<string>(userInfoSelector.status ? userInfoSelector.status : '');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [coordinates, setCoordinates] = useState<{x: number, y: number}>({x: 0, y: 0});
    const dispatch = useDispatch();
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const profilePictureRef = useRef<HTMLInputElement>(null);
    console.log("userInfoSelector.status : " + userInfoSelector.status);

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

      if(username !== userInfoSelector.name) userInfoBody.name = username; 
      if(status !== userInfoSelector.status) userInfoBody.profileStatus = status;

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
            name: response.data.name,
            profileStatus: response.data.profileStatus
          }));
      }
      else {
        console.log("Error while fetching chatting list");
      }
    }

    const handleProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if(file) {
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
        formData.append('profileImage', file);

        const response: APIResponse = await WebServiceInvokerRest<{ 'Content-Type': string }, FormData, null, APIResponse>(
          hostname,
          urlContent,
          "POST",
          headers,
          formData,
          null
        );

        if(response.status === 200) {
          setProfileImageUrl(response.data.profileImageUrl);
          dispatch(updateProfileImageUrl({
            profileImageUrl: response.data.profileImageUrl
          }));
        }
        else {
          console.log("Error while fetching chatting list");
        }
      }
    }

  return (
    <Box >
        <Box sx={{display: 'flex', justifyContent: 'center', paddingY: 4}}>
            <Avatar
            src={userInfoSelector.imageUrl}
            alt='Profile picture'
            sx={{width: '200px', height: '200px'}} 
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
            <Data label={'Your name'} labelColor={'#008069'} value={username} setFunction={setUsername} maxLength={25} updateUserInformation={updateUserInformation}/>
        </Box>
        <Box sx={{paddingX: 4, paddingTop: 2, paddingBottom: 4}}>
          <Typography variant='subtitle2'>
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </Typography>
        </Box>
        <Box sx={{backgroundColor: '#FFFFFF', paddingX: 4, paddingY: 2}}>
            <Data label={'About'} labelColor={'#008069'} value={status} setFunction={setStatus}  multiline={true} maxRows={4} maxLength={139} updateUserInformation={updateUserInformation}/>
        </Box>
    </Box>
  )
}

export default Index
