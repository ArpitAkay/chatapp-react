import { Avatar, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { APIResponse } from "../../types/ApiResponse";
import { WebServiceInvokerRest } from "../../util/WebServiceInvokerRest";
import { getItem } from "../../storage/SessionStorage";
import { UserInfo } from "../../types/UserInfo";
import Data from "../Data";

const Index = () => {
  const [userId, setUserId] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  const fetchContactInfo = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_GET_USER_INFO
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const id = getItem<UserInfo>('selectedChatBox')?.id;
    if(id === undefined) {
      return;
    }

    const userInfoParams: {
      id: number
    } = {
      id: id
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
      setUserId(response.data.id);
      setName(response.data.name);
      setStatus(response.data.profileStatus);
      setProfileImageUrl(response.data.profileImageUrl);
    }
    else {
      console.log("Error while fetching chatting list");
    }
  }

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return (
    <Box sx={{backgroundColor: '#F0F2F5', height: '100%'}}>
      <Box sx={{padding: 4, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
        <Avatar
        src={profileImageUrl}
        alt="Profile Image"
        sx={{width: '200px', height: '200px'}}
        />
        <Typography variant='h5' color='inherit' mt={2}>{name}</Typography>
        <Typography variant='subtitle2' color='grey'>User ID : {userId}</Typography>
      </Box>
      { status && <Box sx={{backgroundColor: '#FFFFFF', paddingX: 4, paddingY: 2, marginTop: 2}}>
        <Data label="About" labelColor={'grey'} value={status}/>
      </Box>}
    </Box>
  )
}

export default Index
