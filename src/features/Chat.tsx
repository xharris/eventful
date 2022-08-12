import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Button } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Icon } from 'src/components/Icon'
import { TextArea } from 'src/components/Input'
import { useMessages } from 'src/libs/message'
import { Eventful } from 'types'
import { FiSend } from 'react-icons/fi'
import { H5 } from 'src/components/Header'
import { Avatar } from 'src/components/Avatar'
import { css, keyframes } from 'src/libs/styled'
import type * as Stitches from '@stitches/react'

const newTextMessage = (height: number) =>
  keyframes({
    '0%': {
      overflow: 'hidden',
      height: 0,
      transform: 'translate(-2px, -2px)',
    },
    '50%': {
      overflow: 'initial',
      height,
      transform: 'translate(-2px, -2px)',
    },
    '100%': {
      transform: 'translate(0px, 0px)',
    },
  })

const newTextMessageInner = keyframes({
  '0%': {
    borderColor: '$controlBorder',
    boxShadow: '$card',
  },
  '50%': {
    borderColor: '$controlBorder',
    boxShadow: '$card',
  },
  '100%': {
    borderColor: 'transparent',
    boxShadow: '$none',
  },
})

interface MessageProps {
  message?: Eventful.API.MessageGet
}

export const Message = ({ message }: MessageProps) => {
  const refInner = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<Stitches.CSS>()

  useLayoutEffect(() => {
    if (refInner.current) {
      setStyle({
        flex: 0,
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        animation: `${newTextMessage(
          refInner.current.clientHeight
        )} 800ms cubic-bezier(0.16, 1, 0.3, 1)`,
        '& > div': {
          transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          animation: `${newTextMessageInner} 800ms cubic-bezier(0.16, 1, 0.3, 1)`,
        },
      })
    }
  }, [refInner])

  return (
    <div className={style ? css(style)() : undefined}>
      <Flex
        ref={refInner}
        css={{
          padding: 5,
          border: '1px solid transparent',
          borderRadius: '$control',
          alignItems: 'flex-start',
        }}
      >
        <Avatar username={message?.createdBy.username} to={`/u/${message?.createdBy.username}`} />
        <H5 css={{ whiteSpace: 'pre' }}>{message?.text}</H5>
      </Flex>
    </div>
  )
}

interface ChatProps {
  event?: Eventful.ID
}

export const Chat = ({ event }: ChatProps) => {
  const { data: messages, addMessage } = useMessages({ event })
  const [text, setText] = useState('')

  const submitMessage = useCallback(() => {
    addMessage({
      text,
    })
    setText('')
  }, [text])

  return (
    <Flex column="reverse" css={{ padding: 2, overflowY: 'auto', gap: '$small' }}>
      <Flex
        flex="0"
        css={{
          position: 'sticky',
          bottom: 0,
          background: `linear-gradient(transparent, $background 10%)`,
          alignItems: 'center',
          gap: '$small',
        }}
      >
        <TextArea
          name="text"
          placeholder="Post a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxRows={3}
          css={{ resize: 'none' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey === false) {
              e.preventDefault()
              submitMessage()
            }
          }}
        />
        <Button onClick={() => submitMessage()} square>
          <Icon icon={FiSend} />
        </Button>
      </Flex>
      <Flex column="reverse" css={{ gap: '$small' }}>
        {messages?.map((message) => (
          <Message key={message._id.toString()} message={message} />
        ))}
      </Flex>
    </Flex>
  )
}
