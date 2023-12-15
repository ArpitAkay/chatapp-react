import { IconButton, Stack, Typography } from '@mui/material'
import TextField from '../TextField';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import DoneIcon from '@mui/icons-material/Done';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useState } from 'react';
import EmojiPicker from '../EmojiPicker';

interface DataProps {
    label: string
    value: string
    setFunction: (value: string) => void;
    updateUserInformation: () => Promise<void>;
}

const Index = (props: DataProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack spacing={1}>
        <Typography variant='subtitle2' color={'#008069'}>{props.label}</Typography>
        <EmojiPicker anchorEl={anchorEl} setAnchorEl={setAnchorEl} value={props.value} setFunction={props.setFunction}/>
        <TextField variant={'standard'} label='' value={props.value} setFunction={props.setFunction} endAdornment={
          <Stack direction='row' spacing={0}>
          {
            edit && <IconButton
            edge="end"
            disableRipple
            onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoodOutlinedIcon />
            </IconButton>
          }
          {
            edit  && <IconButton
            edge="end"
            disableRipple
            onClick={() => {
              setEdit(!edit)
              props.updateUserInformation()
            }}
            >
              <DoneIcon />
            </IconButton>
          }
          {
            !edit  && <IconButton
            edge="end"
            disableRipple
            onClick={() => setEdit(!edit)}
            >
              <ModeEditOutlineIcon />
            </IconButton>
          }
        </Stack>
        } edit={edit} setEdit={setEdit}/>
    </Stack>
  )
}

export default Index
