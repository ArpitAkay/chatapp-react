import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { UserInfo, UserInfoResponse } from '../../types/UserInfo';
import { getItem } from '../../storage/SessionStorage';

interface ListProps {
    chatBox: UserInfoResponse
    handleSelectedChatBoxClick: (id: number, name: string, profileImageUrl: string | undefined) => void
}

const Index = (props: ListProps) => {
    const [showKeyboardArrowDownIcon, setShowKeyboardArrowDownIcon] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const reformatDate = (date: string) => {
        if(!date) {
            return "";
        }

        const isoDate = new Date(date);
        const currentDate = new Date();
      
        const isSameDay = (date1: Date, date2 : Date) =>
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate();
      
        const isYesterday = (date1 : Date, date2 : Date) =>
          isSameDay(new Date(date1.getTime() - 86400000), date2);
      
        if (isSameDay(isoDate, currentDate)) {
          // Today
          const hour = String(isoDate.getHours()).padStart(2, '0');
          const minute = String(isoDate.getMinutes()).padStart(2, '0');
          return `${hour}:${minute}`;
        } else if (isYesterday(isoDate, currentDate)) {
          // Yesterday
          return "Yesterday";
        } else if (
          isoDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()) &&
          isoDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()))
        ) {
          // Within the current week
          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return daysOfWeek[isoDate.getDay()];
        } else {
          // Outside of today, yesterday, and the current week
          const month = String(isoDate.getMonth() + 1).padStart(2, '0');
          const day = String(isoDate.getDate()).padStart(2, '0');
          const year = isoDate.getFullYear();
          return `${day}/${month}/${year}`;
        }
    }

  return (
    <Box>
        <List disablePadding>
            <Divider variant='inset' />
            <ListItem onMouseEnter={() => setShowKeyboardArrowDownIcon(true)} onMouseLeave={() => setShowKeyboardArrowDownIcon(false)} disablePadding secondaryAction={
                <Stack>
                    <Typography variant='caption'>{reformatDate(props.chatBox.latestMessageTime)}</Typography>
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
                <ListItemButton selected={getItem<UserInfo>('selectedChatBox')?.id === props.chatBox.id} onClick={() => props.handleSelectedChatBoxClick(props.chatBox.id, props.chatBox.name, props.chatBox.profileImageUrl)}>
                    <ListItemIcon>
                        <ListItemAvatar>
                            <Avatar src={props.chatBox.profileImageUrl}  alt='Error' sx={{width: 48, height: 48}}/>
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
