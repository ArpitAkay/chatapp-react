import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups';
import AutorenewSharpIcon from '@mui/icons-material/AutorenewSharp';
import WifiChannelSharpIcon from '@mui/icons-material/WifiChannelSharp';
import AnnouncementSharpIcon from '@mui/icons-material/AnnouncementSharp';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { UserInfo } from '../../types/UserInfo';
import { DrawerType } from '../../types/DrawerType';
import { useDispatch, useSelector } from 'react-redux';
import { WebServiceInvokerRest } from '../../util/WebServiceInvokerRest';
import { APIResponse } from '../../types/ApiResponse';
import { useNavigate } from 'react-router-dom';
import { removeUserInfo } from '../../redux/slices/UserInfoSlice';
import { setItem } from '../../storage/SessionStorage';
import CloseIcon from '@mui/icons-material/Close';

interface NavbarProps {
    avatar?: boolean;
    name?: string
    showName?: boolean;
    showSearchIcon?: boolean;
    showCommunityIcon?: boolean;
    showStatusIcon?: boolean;
    showChannelIcon?: boolean;
    showNewChatIcon?: boolean;
    showMoreVertSharpIcon?: boolean;
    chattingListMenuItem?: boolean;
    chattingInboxMenuItem?: boolean;
    setIsChatBoxClosed?: (value: boolean) => void
    setDrawerType: (drawerType: DrawerType | null) => void
}

const Index = (props: NavbarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showTemporaryButton, setShowTemporaryButton] = useState<boolean>(true);
    const open = Boolean(anchorEl);
    const userInfoSelector: UserInfo = useSelector((state: any) => state.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDrawerOpenClick = (event: React.MouseEvent<HTMLElement>) => {
        const ariaLabel = event.currentTarget.ariaLabel;
        switch(ariaLabel) {
            case 'Communities':
            case 'Status':
            case 'Channels':
            case 'New chat':
            case 'Profile':
            case 'New group':
            case 'New community':
            case 'Starred messages':
            case 'Settings':
                props.setDrawerType({
                    variant: 'persistent',
                    anchor: 'left',
                    open: true,
                    buttonInfo: 'Profile'
                });
                break;
            case 'Contact info':
            case 'Disappearing messages':
                props.setDrawerType({
                    variant: 'persistent',
                    anchor: 'right',
                    open: true,
                    buttonInfo: 'Contact info'
                });
                break;
            default:
                break;
        }
    }

    const logoutUser = async () => {
        const hostname = process.env.REACT_APP_HOST_AND_PORT;
        const urlContent = process.env.REACT_APP_DELETE_USER_INFO;
        if(hostname === undefined || urlContent === undefined) {
          return;
        }
    
        const userInfoParams: {
          id: number
        } = {
          id: userInfoSelector.id
        }
    
        const response: APIResponse = await WebServiceInvokerRest<null, null, {id: number}, APIResponse>(
          hostname,
          urlContent,
          "POST",
          null,
          null,
          userInfoParams
        );
    
        if(response.status === 200) {
            navigate('/');
            dispatch(removeUserInfo())
        }
        else {
          console.log("Error while deleting user info");
        }
      }

    useEffect(() => {
        setTimeout(() => {
            setShowTemporaryButton(false);
        }, 5000);
    }, [])

  return (
    <AppBar position='static' sx={{backgroundColor: '#F0F2F5'}}>
        <Toolbar>
            <Stack spacing={2} direction={'row'} sx={{flexGrow: 1}}>
                { props.avatar && <IconButton aria-label='Profile' sx={{padding: '0px'}} onClick={handleDrawerOpenClick} disableRipple>
                    <Avatar src='' alt='Profile' sx={{width: 42, height: 42}}/>
                </IconButton> }
                { !props.avatar && <IconButton aria-label='Profile' sx={{padding: '0px'}} onClick={() => props.setDrawerType(null)} disableRipple>
                    <CloseIcon color='inherit' />
                </IconButton> }
                <Stack sx={ !showTemporaryButton ? {display: 'flex', justifyContent: 'center'} : {}}>
                    {props.showName && <Typography aria-label='Contact info' variant='body1' color={'black'} onClick={handleDrawerOpenClick} sx={{
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }}>{props.name}</Typography>}
                    {(props.avatar && props.showName && showTemporaryButton) && <Typography aria-label='Contact info' variant='body2' color={'black'} onClick={handleDrawerOpenClick} sx={{
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }}>Click here for contact info</Typography>}
                </Stack>
            </Stack>
            <Stack spacing={1} direction={'row'}>
                {props.showSearchIcon && <Tooltip title='Search...' placement='bottom-start' enterDelay={1000} leaveDelay={200}>
                        <IconButton aria-label='Search...' size='small'>
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                }
                {props.showCommunityIcon && <Tooltip title='Communities' placement='bottom-start' enterDelay={1000} leaveDelay={200}>
                        <IconButton aria-label='Communities' size='small' onClick={handleDrawerOpenClick}>
                            <GroupsIcon />
                        </IconButton>
                    </Tooltip>
                }
                {props.showStatusIcon && <Tooltip title='Status' placement='bottom-start' enterDelay={1000} leaveDelay={200}> 
                        <IconButton aria-label='Status' size='small' onClick={handleDrawerOpenClick}>
                            <AutorenewSharpIcon />
                        </IconButton>
                    </Tooltip>
                }
                {props.showChannelIcon && <Tooltip title='Channels' placement='bottom-start' enterDelay={1000} leaveDelay={200}>
                        <IconButton aria-label='Channels' size='small' onClick={handleDrawerOpenClick}>
                            <WifiChannelSharpIcon />
                        </IconButton>
                    </Tooltip>
                }
                {props.showNewChatIcon && <Tooltip title='New chat' placement='bottom-start' enterDelay={1000} leaveDelay={200}>
                        <IconButton aria-label='New chat' size='small' onClick={handleDrawerOpenClick}>
                            <AnnouncementSharpIcon />
                        </IconButton>
                    </Tooltip>
                }
                {props.showMoreVertSharpIcon && <Tooltip title='Menu' placement='bottom-start' enterDelay={1000} leaveDelay={200}>
                        <IconButton id='more-vert-sharp-icon' aria-label='Status' size='small' onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MoreVertSharpIcon />
                        </IconButton>
                    </Tooltip>
                }
                <Menu id='more-vert-sharp-icon' anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                    {props.chattingListMenuItem && 
                        <Box>
                            <MenuItem aria-label='New group' onClick={handleDrawerOpenClick}>New group</MenuItem>
                            <MenuItem aria-label='New community' onClick={handleDrawerOpenClick}>New community</MenuItem>
                            <MenuItem aria-label='Starred messages' onClick={handleDrawerOpenClick}>Starred messages</MenuItem>
                            <MenuItem aria-label='Select chats'>Select chats</MenuItem>
                            <MenuItem aria-label='Settings' onClick={handleDrawerOpenClick}>Settings</MenuItem>
                            <MenuItem aria-label='Logout' onClick={logoutUser}>Logout</MenuItem>
                        </Box>
                    }
                    {props.chattingInboxMenuItem &&
                        <Box>
                            <MenuItem aria-label='Contact info' onClick={(event) => {
                                handleDrawerOpenClick(event);
                                setAnchorEl(null);
                            }}>Contact info</MenuItem>
                            <MenuItem aria-label='Select messages'>Select messages</MenuItem>
                            <MenuItem onClick={() => {
                                setItem('selectedChatBox', null)
                                props.setIsChatBoxClosed?.(true);
                            }}>Close chat</MenuItem >
                            <MenuItem aria-label='Mute notifications'>Mute notifications</MenuItem>
                            <MenuItem aria-label='Disappearing messages' onClick={handleDrawerOpenClick}>Disappearing messages</MenuItem>
                            <MenuItem aria-label='Clear chat'>Clear chat</MenuItem>
                            <MenuItem aria-label='Delete chat'>Delete chat</MenuItem>
                            <MenuItem aria-label='Report'>Report</MenuItem>
                            <MenuItem aria-label='Block'>Block</MenuItem>
                        </Box>
                    }
                </Menu>
            </Stack>
        </Toolbar>
    </AppBar>
  )
}

export default Index
