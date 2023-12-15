import { Box } from '@mui/material'
import MessageBox from '../MessageBox'
import { Message } from '../../types/Message'
import { useSelector } from 'react-redux'

interface ChatInboxProps {
  messageList: Message[]
}

const Index = (props: ChatInboxProps) => {
  const userInfoSelector = useSelector((state: any) => state.userInfo);

  return (
    <Box sx={{
      marginX: 6,
      marginY: 2
    }}>
      {
        props.messageList.map((message: Message) => {
          return (
            <MessageBox
              key={message.id}
              position={message.senderName === userInfoSelector.name ? 'end' : 'start'}
              backgroundColor={message.senderName === userInfoSelector.name ? '#b9f6ca' : '#fafafa'}
              message={message.content}
              timpstamp={message.timestamp}
            />
          )
        })
      }
    </Box>
  )
}

export default Index
