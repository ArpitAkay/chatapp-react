import { Box, Menu } from '@mui/material'
import EmojiPicker from 'emoji-picker-react'

interface EmojiPickerProps {
    anchorEl: null | HTMLElement
    setAnchorEl: (value: null | HTMLElement) => void
    value: string
    setFunction?: (value: string) => void;
}

const Index = (props: EmojiPickerProps) => {
  const open = Boolean(props.anchorEl);

  return (
    <Box>
      <Menu anchorEl={props.anchorEl} open={open} onClose={() => props.setAnchorEl(null)} 
      slotProps={{
        paper: {
            sx: {
                borderRadius: "10px"
            }
        }
      }}
      MenuListProps={{ sx: { py: 0}}}
      anchorOrigin={
        {
          vertical: 'top',
          horizontal: 'center'
        }
      }
      transformOrigin={
        {
          vertical: 'bottom',
          horizontal: 'left'
        }
      }
      >
        <EmojiPicker onEmojiClick={(e) => props.setFunction?.(props.value.concat(" " + e.emoji))}/>
      </Menu>
    </Box>
  )
}

export default Index
