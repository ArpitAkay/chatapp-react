import { CircularProgress, IconButton, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";

interface SearchBarProps {
  value: string;
  setValue: (value: string) => void;
  loading: boolean;
}

const Index = (props: SearchBarProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <TextField 
    variant="outlined" 
    fullWidth size="small"
    placeholder="Search or start new chat"
    value={props.value}
    onChange={(e) => {
      setSelected(true);
      props.setValue(e.target.value)
    }}
    InputProps={{
      startAdornment: (
        <Stack direction={'row'} paddingRight={'20px'}>
          { !props.value && !selected &&<IconButton disableRipple >
            <SearchIcon sx={{color: 'grey'}}/>
          </IconButton> }
          { selected &&<IconButton disableRipple onClick={() => {
            setSelected(false)
            props.setValue('')
          }}>
            <ArrowBackIcon sx={{color: '#008069'}}/>
          </IconButton>}
        </Stack>
      ),
      endAdornment: (
        <Stack direction={'row'}>
          { props.value && !props.loading && <IconButton disableRipple onClick={() => {
              setSelected(false)
              props.setValue('')
            }}>
            <ClearIcon sx={{color: 'grey'}}/>
          </IconButton> }
          { props.loading && <CircularProgress 
          size='20px' 
          sx={{
            color: '#008069',
            marginTop: '10px'
          }}
          /> }
        </Stack>
      )
    }}
    sx={{
      backgroundColor: '#F0F2F5',
      border: 'none',
      borderRadius: '8px',
      '& .MuiOutlinedInput-root': {
        paddingLeft: '0px',
        paddingRight: '0px',
        '& fieldset': {
          border: 'none',
        },
        '&:hover fieldset': {
          border: 'none',
        },
        '&.Mui-focused fieldset': {
          border: 'none',
        },
      },
    }}
    />
  );
};

export default Index;
