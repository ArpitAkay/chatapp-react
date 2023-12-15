import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { UserInfo, UserInfoResponse } from '../../types/UserInfo';
import { getItem } from '../../storage/SessionStorage';

interface ListProps {
    chatBox: UserInfoResponse
    handleSelectedChatBoxClick: (id: number, name: string) => void
}

const Index = (props: ListProps) => {
    const [showKeyboardArrowDownIcon, setShowKeyboardArrowDownIcon] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

  return (
    <Box>
        <List disablePadding>
            <Divider variant='inset' />
            <ListItem onMouseEnter={() => setShowKeyboardArrowDownIcon(true)} onMouseLeave={() => setShowKeyboardArrowDownIcon(false)} disablePadding secondaryAction={
                <Stack>
                    <Typography variant='caption'>11/10/2023</Typography>
                    <Stack spacing={0} direction={'row-reverse'}>
                        {showKeyboardArrowDownIcon && <IconButton color='inherit' id='keyboard-down-icon' onClick={(e) => setAnchorEl(e.currentTarget)} edge='end' aria-label='keyboard down icon' size='small' disableRipple>
                            <KeyboardArrowDownIcon />
                        </IconButton>}
                        <IconButton color='inherit' edge='end' aria-label='Pin message' size='small'disableRipple>
                            <PushPinIcon />
                        </IconButton>
                        <Menu id='keyboard-down-icon' anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                            <MenuItem>Archive chat</MenuItem>
                            <MenuItem>Mute notifications</MenuItem>
                            <MenuItem>Delete chat</MenuItem>
                            <MenuItem>Pin chat</MenuItem>
                            <MenuItem>Mark as unread</MenuItem>
                        </Menu>
                    </Stack>
                </Stack>
            }>
                <ListItemButton selected={getItem<UserInfo>('selectedChatBox')?.id === props.chatBox.id} onClick={() => props.handleSelectedChatBoxClick(props.chatBox.id, props.chatBox.name)}>
                    <ListItemIcon>
                        <ListItemAvatar>
                            <Avatar sx={{width: 48, height: 48}}/>
                        </ListItemAvatar>
                    </ListItemIcon>
                    <ListItemText primary={props.chatBox.name} 
                    secondary={props.chatBox?.latestMessage}
                    sx={{marginLeft: 1}}
                    />
                </ListItemButton>
            </ListItem>
        </List>
    </Box>
  )
}

export default Index
