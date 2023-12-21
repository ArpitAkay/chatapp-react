import { IconButton, Stack, Typography } from '@mui/material'
import TextField from '../TextField';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import DoneIcon from '@mui/icons-material/Done';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useState } from 'react';
import EmojiPicker from '../EmojiPicker';

interface DataProps {
    label: string
    labelColor: string
    value: string
    setFunction?: (value: string) => void;
    multiline?: boolean
    maxRows?: number
    maxLength?: number
    updateUserInformation?: () => Promise<void>;
}

const Index = (props: DataProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack spacing={1}>
        <Typography variant='body2' color={props.labelColor}>{props.label}</Typography>
        <EmojiPicker anchorEl={anchorEl} setAnchorEl={setAnchorEl} value={props.value} setFunction={props.setFunction}/>
        <TextField variant={'standard'} label='' value={props.value} setFunction={props.setFunction} 
        multiline={props.multiline} maxRows={props.maxRows} maxLength={props.maxLength}
        endAdornment={
          props.setFunction && <Stack direction='row' spacing={0}>
          {
            edit && <IconButton
            edge="end"
            disableRipple
            disabled
            >
              <Typography variant='body2'>{props.value.length}</Typography>
            </IconButton>
          }
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
              props.updateUserInformation?.()
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
        } edit={edit}/>
    </Stack>
  )
}

export default Index
