import message from 'api/schemas/message'
import { useState } from 'react'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Icon } from 'src/components/Icon'
import { Input } from 'src/components/Input'
import { useMessages } from 'src/libs/message'
import { Eventful } from 'types'
import { FiSend } from 'react-icons/fi'
import { H5 } from 'src/components/Header'
import { Avatar } from 'src/components/Avatar'

interface MessageProps {
  message?: Eventful.API.MessageGet
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Flex
      flex="0"
      css={{ padding: 5, border: '1px solid $controlBorder', borderRadius: '$control' }}
    >
      <Avatar username={message?.createdBy.username} to={`/u/${message?.createdBy.username}`} />
      <H5>{message?.text}</H5>
    </Flex>
  )
}

interface ChatProps {
  event?: Eventful.ID
}

export const Chat = ({ event }: ChatProps) => {
  const { data: messages, addMessage } = useMessages({ event })
  const [text, setText] = useState('')

  return (
    <Flex column css={{ padding: 2 }}>
      <Flex column css={{ gap: '$small' }}>
        {messages?.map((message) => (
          <Message key={message._id.toString()} message={message} />
        ))}
      </Flex>
      <Flex flex="0">
        <Input
          name="text"
          placeholder="Post a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() =>
            addMessage({
              text,
            })
          }
          square
        >
          <Icon icon={FiSend} />
        </Button>
      </Flex>
    </Flex>
  )
}
