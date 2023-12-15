import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { WebServiceInvokerRest } from "../../util/WebServiceInvokerRest";
import { useNavigate } from "react-router-dom";
import { APIResponse } from "../../types/ApiResponse";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slices/UserInfoSlice";

interface UserInfoRequestBody {
  name: string
}
 
const Index = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Something went wrong');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(false);
  }

  const handleChatEnterButton = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userInfo: UserInfoRequestBody = {
      name: name
    };

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_SAVE_USER_INFO
    if(hostname === undefined || urlContent === undefined) {
      setError(true)
      return;
    }

    const response: APIResponse = await WebServiceInvokerRest<null, UserInfoRequestBody, null, APIResponse>(
      hostname,
      urlContent,
      "POST",
      null,
      userInfo,
      null
    );

    if (response.status === 200) {
      dispatch(
        setUserInfo({
          id: response.data.id,
          name: response.data.name,
          active: response.data?.active
        })
      );
      navigate('/chat');
    }
    else {
      setError(true);
      setErrorMessage(response.data.detail);
    }
  }

  return (
    <form style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onSubmit={handleChatEnterButton}
    >
    <Stack spacing={6} direction={'column'} p={2}>
      <Stack textAlign={'center'}>
          <Typography variant='h4' fontSize={{
            xs: 'h5.fontSize',
            sm: 'h4.fontSize'
          }}>Welcome to Chat App</Typography>
      </Stack>
      <Stack spacing={3} direction={'column'} >
        <TextField
          variant='outlined'
          label={'Enter your name'}
          size='small'
          fullWidth
          required
          value={name}
          onChange={handleNameChange}
          error={error}
          helperText={error ? errorMessage : null}
        />
        <Button type="submit" variant="contained">Enter</Button>
      </Stack>
    </Stack>
    </form>
  );
};

export default Index;
