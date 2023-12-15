import { InputAdornment, TextField } from '@mui/material'
import React from 'react';

interface TextFieldProps {
    variant: 'filled' | 'outlined' | 'standard'
    label: string
    value: string
    setFunction: (value: string) => void;
    multiline?: boolean
    endAdornment?: React.ReactNode
    edit?: boolean
    setEdit?: (value: boolean) => void;
}

const Index = (props: TextFieldProps) => {

  return (
    <TextField 
    label={props.label}
    variant={props.variant} 
    sx={{
      backgroundColor: '#FFFFFF', 
      borderRadius: 3
    }} 
    size='small' 
    fullWidth 
    value={props.value}
    onChange={(e) => props.setFunction(e.target.value)}
    multiline={props.multiline}
    maxRows={2}
    InputProps={{
      ...(props.variant !== 'outlined'
        ? { disableUnderline: props.edit !== undefined && !props.edit }
        : {}
      ),
      // disableUnderline: props.edit !== undefined && !props.edit,
      readOnly: props.edit !== undefined && !props.edit,
      endAdornment: ( props.endAdornment && 
        <InputAdornment position="start">
          {props.endAdornment}
        </InputAdornment>
      )
    }}
    ></TextField>
  )
}

export default Index
