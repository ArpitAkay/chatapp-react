import { Box, Divider, IconButton, Link, Paper, Stack, Typography } from "@mui/material";
import FilterListSharpIcon from "@mui/icons-material/FilterListSharp";
import Navbar from "../Navbar";
import Searchbar from "../Searchbar";
import List from "../List";
import { useEffect, useRef, useState } from "react";
import { UserInfo, UserInfoResponse } from "../../types/UserInfo";
import LockIcon from '@mui/icons-material/Lock';
import Dialog from "../Dialog";
import ChatInbox from "../ChatInbox";
import ChatInboxFooter from "../ChatInboxFooter";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import chatInboxBackgroundImage from '../../images/chatInboxBackgroundImage.png';
import { useDispatch, useSelector } from "react-redux";
import { APIResponse } from "../../types/ApiResponse";
import { WebServiceInvokerRest } from "../../util/WebServiceInvokerRest";
import { Message } from "../../types/Message";
import Drawer from "../Drawer";
import { DrawerType } from "../../types/DrawerType";
import { setNotificationPermission } from "../../redux/slices/NotificationPermission";
import InternetIssue from "../InternetIssue";
import { getItem, setItem } from "../../storage/SessionStorage";
import { updateProfileImageUrl, updateUserInfo } from "../../redux/slices/UserInfoSlice";

interface ChatParam {
  pageNo: number,
  pageSize: number,
  senderId: number,
  receiverId: number
}

const Index = () => {
  const [chattingList, setChattingList] = useState<UserInfoResponse[]>([]);
  const [encryptionInfoDialogBox, setEncryptionInfoDialogBox] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [socketState, setSocketState] = useState<boolean>(false);
  const [isChatBoxClosed, setIsChatBoxClosed] = useState<boolean>(true);
  const userInfoSelector = useSelector((state: any) => state.userInfo);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [leftDrawerType, setLeftDrawerType] = useState<DrawerType | null>(null);
  const [rightDrawerType, setRightDrawerType] = useState<DrawerType | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const audio = new Audio('/audio/chatapp_newmessage.mp3');
  const notificationPermissionSelector = useSelector((state: any) => state.notificationPermission);
  const hasInteractedWithDom = useRef<boolean>(false);
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const stompClient = useRef<Client | null>(null);
  const pageNo = useRef<number>(0);
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
  const [scrollToBottomForOlderMessages, setScrollToBottomForOlderMessages] = useState<boolean>(false);
  const isLastPage = useRef<boolean>(true);

  const checkWebSiteStatus = () => {
    window.addEventListener('online', () => {
      setIsOnline(true);
    });
    window.addEventListener('offline', () => {
      setIsOnline(false);
    });
    window.document.addEventListener('click', () => {
      hasInteractedWithDom.current = true;
    });

    return () => {
      window.removeEventListener('online', () => {
        setIsOnline(true);
      });
      window.removeEventListener('offline', () => {
        setIsOnline(false);
      });
      window.document.addEventListener('click', () => {
        hasInteractedWithDom.current = true;
      });
    };
  }

  const askNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if(permission === 'granted') {
      dispatch(setNotificationPermission({
        permission: true
      }));
    } else {
      dispatch(setNotificationPermission({
        permission: false
      }));
    }
  }

  const fetchChattingList = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_GET_ALL_USER_INFO
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const userInfoParams: UserInfo = {
      id: userInfoSelector.id,
      name: userInfoSelector.name
    }

    const response: APIResponse = await WebServiceInvokerRest<null, null, UserInfo, APIResponse>(
      hostname,
      urlContent,
      "GET",
      null,
      null,
      userInfoParams
    );

    if(response.status === 200) {
      const userInfoResponseList: UserInfoResponse[] = response.data;
      setChattingList(userInfoResponseList);
    }
    else {
      console.log("Error while fetching chatting list");
    }
  }

  const fetchOlderMessages = async () => {
    pageNo.current += 1;

    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_CHAT_PRIVATE_MESSAGES
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const receiverId = getItem<UserInfo>("selectedChatBox")?.id;
    if(receiverId === undefined) {
      return;
    }

    const chatParams: ChatParam = {
      pageNo: pageNo.current,
      pageSize: 50,
      senderId: userInfoSelector.id,
      receiverId: receiverId
    }

    const response: APIResponse = await WebServiceInvokerRest<null, null, ChatParam, APIResponse>(
      hostname,
      urlContent,
      "GET",
      null,
      null,
      chatParams
    );

    if(response.status === 200) {
      setMessageList((prevMessages) => response.data.messages.reverse().concat(prevMessages));
      isLastPage.current = response.data.lastPage;
    }
    else {
      console.log("Error while fetching chatting list");
    }

    setScrollToBottomForOlderMessages(true);
  }

  const fetchUserInfo = async () => {
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_GET_USER_INFO
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const userInfoParams: {
      id: number
    } = {
      id: userInfoSelector.id,
    }

    const response: APIResponse = await WebServiceInvokerRest<null, null, { id: number }, APIResponse>(
      hostname,
      urlContent,
      "GET",
      null,
      null,
      userInfoParams
    );

    if(response.status === 200) {
      dispatch(updateUserInfo({
        name: response.data.name,
        profileStatus: response.data.profileStatus
      }))
      dispatch(updateProfileImageUrl({
        profileImageUrl: response.data.profileImageUrl
      }))
    }
    else {
      console.log("Error while fetching chatting list");
    }
  }

  const connectToSocket = () => {
    if(socketState) {
      return;
    }
    const socketUrl = process.env.REACT_APP_SOCKET_URL;
    if(!socketUrl) {
      throw new Error("Socket URL is undefined");
    }

    const sock = new SockJS(socketUrl);
    const client = over(sock);
    stompClient.current = client;
    stompClient.current.connect({}, onConnected, onError);
  }

  const onConnected = () => {
    const id = userInfoSelector.id;
    const subscribeUrl = "/user/" + id + "/queue/messages";
    if(subscribeUrl === undefined) {
      throw new Error("Subscribe URL is undefined");
    }
    if(stompClient.current) {
      stompClient.current.subscribe(subscribeUrl, onMessageReceived);
      setSocketState(true);
    }
  }

  const onError = () => {
    console.log("Error while connecting to socket");
    setSocketState(false);
    connectToSocket();
  }

  const onMessageReceived = async (payload: any) => {
    const messageReceived: Message = JSON.parse(payload.body);
    if(notificationPermissionSelector.permission) {
      if(hasInteractedWithDom.current) {
        audio.play();
      }
    }
    else {
      askNotificationPermission();
    }

    // messageReceived.content = messageReceived.content.replace(/\\n/g, '\n');

    setChattingList((chattingList) => {
      return chattingList.map((chatting) => {
        if (chatting.id === messageReceived.senderId && chatting.name === messageReceived.senderName) {
          return {
            ...chatting,
            latestMessage: messageReceived.content,
            latestMessageTime: messageReceived.timestamp
          };
        }
        return chatting;
      });
    });

    const selectedChatBox = getItem<UserInfo>("selectedChatBox");

    if(selectedChatBox?.id === messageReceived.senderId && selectedChatBox?.name === messageReceived.senderName) {
      setMessageList((prevMessageList) => [...prevMessageList, messageReceived]);
    }

    setScrollToBottom(true);
  }

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!socketState) {
      connectToSocket();
    }

    if(message.trim() === '') {
      setMessage('');
      return;
    }

    if(stompClient.current) {

      const messageToSend: Message = {
        content: message,
        senderId: userInfoSelector.id,
        senderName: userInfoSelector.name,
        receiverId: getItem<UserInfo>("selectedChatBox")?.id,
        receiverName: getItem<UserInfo>("selectedChatBox")?.name,
        timestamp: new Date().toISOString(),
      };

      const sendMessageUrl = process.env.REACT_APP_SEND_MESSAGE_URL;
      if(sendMessageUrl === undefined) {
        throw new Error("Send message URL is undefined");
      }
      stompClient.current.send(sendMessageUrl, {}, JSON.stringify(messageToSend));
      setMessage('');

      setChattingList(chattingList => 
        chattingList.map(chatting => {
          if (chatting.id === messageToSend.receiverId && chatting.name === messageToSend.receiverName) {
            return {
              ...chatting,
              latestMessage: messageToSend.content,
              latestMessageTime: new Date().toISOString(),
            };
          }
          return chatting;
        })
      );

      setMessageList([...messageList, messageToSend]);
    }

    setScrollToBottom(true);
  }

  const handleSelectedChatBoxClick = async (id: number, name: string, profileImageUrl: string | undefined) => {
    pageNo.current = 0;
    setIsChatBoxClosed(false);
    const selectedChatBox: UserInfo = {
      id: id,
      name: name,
      profileImageUrl: profileImageUrl
    }
    setItem<UserInfo>("selectedChatBox", selectedChatBox);
    const hostname = process.env.REACT_APP_HOST_AND_PORT;
    const urlContent = process.env.REACT_APP_CHAT_PRIVATE_MESSAGES
    if(hostname === undefined || urlContent === undefined) {
      return;
    }

    const chatParams: ChatParam = {
      pageNo: pageNo.current,
      pageSize: 50,
      senderId: userInfoSelector.id,
      receiverId: id
    }

    const response: APIResponse = await WebServiceInvokerRest<null, null, ChatParam, APIResponse>(
      hostname,
      urlContent,
      "GET",
      null,
      null,
      chatParams
    );

    if(response.status === 200) {
      setMessageList(response.data.messages.reverse());
      isLastPage.current = response.data.lastPage;
    }
    else {
      console.log("Error while fetching chatting list");
    }

    const paperElem = paperRef.current;
    if(paperElem && !isLastPage.current) {
      paperElem.addEventListener('scroll', handleScrollOnPaperRef);
    }

    setScrollToBottom(true);
  }

  const handleScrollOnPaperRef = () => {
    const paperElem = paperRef.current;
    if(paperElem) {
      if(paperElem.scrollTop === 0 && !isLastPage.current) {
        fetchOlderMessages();
      } else if(isLastPage.current) {
        paperElem.removeEventListener('scroll', handleScrollOnPaperRef);
      }
    }
  }

  const scrollContentToBottom = () => {
    const paperRefElem = paperRef.current;
    if (paperRefElem) {
      paperRefElem.scrollTop = paperRefElem.scrollHeight;
    }
  };

  const handleFilterUnreadMessages = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.color = event.currentTarget.style.color === 'white' ? 'grey' : 'white';
    event.currentTarget.style.backgroundColor = event.currentTarget.style.backgroundColor === 'rgb(0, 128, 105)' ? 'white' : '#008069';
  }

  useEffect(() => {
    const cleanup = checkWebSiteStatus();
    askNotificationPermission();
    fetchChattingList();
    fetchUserInfo();
    connectToSocket();

    return () => {
      cleanup();
    };
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(scrollToBottom) {
      scrollContentToBottom();
      setScrollToBottom(false);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if(scrollToBottomForOlderMessages) {
      const paperElem = paperRef.current;
      if(paperElem) {
        paperElem.scrollTop = paperElem.scrollHeight / (pageNo.current + 1);
      }
      setScrollToBottomForOlderMessages(false);
    }
  }, [scrollToBottomForOlderMessages]);

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Box sx={{ width: "30%", height: "100%", minWidth: '30%' }}>
        <Navbar avatar={true} avatarUrl={userInfoSelector.imageUrl} showCommunityIcon={true} showStatusIcon={true} showChannelIcon={true} showNewChatIcon={true} showMoreVertSharpIcon={true} chattingListMenuItem={true} setIsChatBoxClosed={setIsChatBoxClosed} setDrawerType={setLeftDrawerType}/>
        <Stack spacing={1} direction={"row"} p={1}>
          <Box width={'88%'} padding={'2px'}>
              <Searchbar />
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <IconButton sx={{
              color: 'grey',
              backgroundColor: 'white'
            }} size="small" onClick={handleFilterUnreadMessages}>
              <FilterListSharpIcon />
            </IconButton>
          </Box>
        </Stack>
        <Paper sx={{maxHeight: '85%', overflowY: 'scroll', scrollbarGutter: 'stable'}}>
          {
            !isOnline && <Box>
              <InternetIssue />
            </Box>
          }
          {
            chattingList.map((chatting) => {
              return (
                <List key={chatting.id} chatBox={chatting} handleSelectedChatBoxClick={handleSelectedChatBoxClick} 
                />
              )
            })
          }
          <Divider />
          <Stack spacing={0} direction={'row'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={30}>
            <LockIcon fontSize="small"/>
            <Typography variant="caption">Your personal messages are <Link component={'button'} sx={{color: '#027EB5'}} underline="none" onClick={() => setEncryptionInfoDialogBox(true)}>end-to-end encrypted</Link>
            <Dialog encryptionInfoDialogBox={encryptionInfoDialogBox} setEncryptionInfoDialogBox={setEncryptionInfoDialogBox}/>
            </Typography>
          </Stack>
        </Paper>
      </Box>
      <Box
        sx={{ width: "70%", height: "100%", backgroundColor: "#F0F2F5" }}
      >
        {
          isChatBoxClosed && 
          <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
              <Stack spacing={0} textAlign={'center'}
              sx={{
                width: '50%',
                height: '60%',
                display: 'flex',
                justifyContent: 'end'
              }}
              >
                  <Typography variant="h4" color={'#41525D'} gutterBottom>ChatApp Web</Typography>
                  <Typography variant="body2" color={'#667781'}>Send and receive messages without keeping your phone online.</Typography>
                  <Typography variant="body2" color={'#667781'}>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</Typography>
              </Stack>
              <Box sx={{
                  color: '#667781',
                  height: '30%',
                  display: 'flex',
                  alignItems: 'end'
                }}>
                  <Stack direction={'row'}>
                    <LockIcon fontSize="small" />
                    <Typography variant="subtitle2">Your personal messages are end-to-end encrypted</Typography>
                  </Stack>
                </Box>
          </Box>
        }
        {!isChatBoxClosed && 
          <>
            <Navbar avatar={true} avatarUrl={getItem<UserInfo>('selectedChatBox')?.profileImageUrl} name={getItem<UserInfo>('selectedChatBox')?.name}  showName={true} showSearchIcon={true} showMoreVertSharpIcon={true} chattingInboxMenuItem={true} setIsChatBoxClosed={setIsChatBoxClosed} setDrawerType={setRightDrawerType}/>
            <Paper sx={{height: "83%", background: '#efebe9', backgroundImage: `url(${chatInboxBackgroundImage})`, overflow: 'auto', scrollbarGutter: 'stable' }} ref={paperRef}>
              <ChatInbox messageList={messageList}/>
            </Paper>
            <ChatInboxFooter sendMessage={sendMessage} messageValue={message} setMessageFunction={setMessage}/>
          </> 
        }
      </Box>
      <Box>
        { leftDrawerType?.anchor === 'left' &&  <Drawer drawerType={leftDrawerType} setDrawerType={setLeftDrawerType}/> }
        { rightDrawerType?.anchor === 'right' && <Drawer drawerType={rightDrawerType} setDrawerType={setRightDrawerType}/> }
      </Box>
    </Box>
  );
};

export default Index;
