import {
  ComponentProps,
  HTMLProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, CancelButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { Icon, IconSide } from 'src/components/Icon'
import { TextArea } from 'src/components/Input'
import { useMessages } from 'src/eventfulLib/message'
import { Eventful } from 'types'
import { FiCornerUpLeft, FiEdit2, FiMessageSquare, FiSend } from 'react-icons/fi'
import { H4, H5, H6 } from 'src/components/Typography'
import { Avatar } from 'src/components/Avatar'
import { css, keyframes } from 'src/libs/styled'
import type * as Stitches from '@stitches/react'
import { createStateContext } from 'react-use'
import { useSession } from 'src/eventfulLib/session'
import * as Dialog from '@radix-ui/react-dialog'
import { useLocation, useNavigate } from 'react-router-dom'
import { InlineDialog } from 'src/components/Dialog/InlineDialog'
import { useBackListener } from 'src/libs/backListener'

const newTextMessage = (height: number) =>
  keyframes({
    '0%': {
      overflow: 'hidden',
      height: 0,
      transform: 'translate(-2px, -2px)',
    },
    '25%': {
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
  '25%': {
    borderColor: '$controlBorder',
    boxShadow: '$card',
  },
  '100%': {
    borderColor: 'transparent',
    boxShadow: '$none',
  },
})

const [useChatCtx, ChatCtxProvider] = createStateContext<{
  editing?: Eventful.API.MessageGet
  replying?: Eventful.API.MessageGet
}>({
  editing: undefined,
  replying: undefined,
})

interface MessageProps extends HTMLProps<HTMLDivElement> {
  message?: Eventful.API.MessageGet
  preview?: boolean
}

export const Message = ({ message, preview, ...props }: MessageProps) => {
  const refInner = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<Stitches.CSS>()
  const [{ editing, replying }, setChatCtx] = useChatCtx()
  const { session } = useSession()

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
    <div className={style ? css(style)() : undefined} {...props}>
      <Flex
        ref={refInner}
        css={{
          padding: 2,
          border: '1px solid transparent',
          borderRadius: '$control',
          alignItems: 'flex-start',
          '& .controls': {
            opacity: 0,
            transition: 'all ease-in-out 0.2s',
          },
          '&:hover .controls': {
            opacity: 1,
          },
        }}
      >
        <Flex column css={{ gap: '$small' }}>
          {message?.replyTo && (
            <Flex css={{ opacity: 0.5, marginLeft: 36, alignItems: 'center', gap: '$small' }}>
              <Icon icon={FiCornerUpLeft} />
              <H6 css={{ fontWeight: 500 }}>{message?.replyTo.createdBy.username}</H6>
              <H6>{message?.replyTo.text}</H6>
            </Flex>
          )}
          <Flex css={{ gap: preview ? '$small' : undefined }}>
            <Avatar
              username={message?.createdBy.username}
              to={`/u/${message?.createdBy.username}`}
            />
            <H5 css={{ whiteSpace: preview ? 'nowrap' : 'pre-wrap', flex: 1 }}>{message?.text}</H5>
            {!preview && (
              <Flex className="controls" flex="0" css={{ gap: '$small' }}>
                {session?._id === message?.createdBy._id && (
                  <Button
                    variant="outline"
                    square={24}
                    onClick={() => setChatCtx((prev) => ({ ...prev, editing: message }))}
                  >
                    <Icon icon={FiEdit2} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  square={24}
                  onClick={() => setChatCtx((prev) => ({ ...prev, replying: message }))}
                >
                  <Icon icon={FiCornerUpLeft} />
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

interface ChatInputProps {
  event?: Eventful.ID
}

const ChatInput = ({ event }: ChatInputProps) => {
  const { addMessage, updateMessage } = useMessages({ event })
  const [text, setText] = useState('')
  const [{ editing, replying }, setChatCtx] = useChatCtx()

  const submitMessage = useCallback(() => {
    if (editing) {
      updateMessage({
        _id: editing._id,
        text,
        replyTo: replying?._id,
      })
    } else {
      addMessage({
        text,
        replyTo: replying?._id,
      })
    }
    setText('')
    setChatCtx({})
  }, [replying, editing, text])

  useEffect(() => {
    if (editing) {
      setText(editing.text)
    } else {
      setText('')
    }
  }, [editing])

  return (
    <Flex
      flex="0"
      column
      css={{
        position: 'sticky',
        bottom: 0, // '-$small',
        padding: '$small 0',
        background: `linear-gradient(transparent, $background 10%)`,
        gap: '$small',
        width: '100%',
      }}
    >
      {!!replying && (
        <Flex css={{ alignItems: 'center', gap: '$small' }}>
          <CancelButton
            variant="outline"
            onClick={() => setChatCtx((prev) => ({ ...prev, replying: undefined }))}
          >
            <Icon icon={FiCornerUpLeft} />
          </CancelButton>
          <H6 css={{ fontWeight: 500 }}>{replying?.createdBy.username}</H6>
          <H6>{replying?.text}</H6>
        </Flex>
      )}
      <Flex
        css={{
          alignItems: 'center',
          gap: '$small',
        }}
      >
        {!!editing && (
          <CancelButton
            variant="outline"
            onClick={() => setChatCtx((prev) => ({ ...prev, editing: undefined }))}
          >
            <Icon icon={FiEdit2} />
          </CancelButton>
        )}
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
    </Flex>
  )
}

interface ChatProps {
  event?: Eventful.ID
  small?: boolean
}

export const Chat = ({ event, small }: ChatProps) => {
  const { data: messages } = useMessages({ event })
  const [collapseChat, setCollapseChat] = useState(true)

  const latestMessage = useMemo(() => messages?.at(0), [messages])

  const [addChatHash] = useBackListener({
    hash: 'chat',
    onFirstBack() {
      setCollapseChat(true)
    },
  })

  return (
    <ChatCtxProvider>
      {small && collapseChat && (
        <Flex
          flex="0"
          css={{
            cursor: 'pointer',
            border: '1px solid $controlBorder',
            borderRadius: '$control',
            padding: '0 $controlPadding',
            gap: '$small',
          }}
          onClick={() => {
            setCollapseChat(false)
            addChatHash()
          }}
        >
          <Icon icon={FiMessageSquare} />
          {latestMessage ? (
            <Message
              key={latestMessage._id.toString()}
              message={latestMessage}
              style={{
                pointerEvents: 'none',
                flex: 1,
                overflow: 'hidden',
              }}
              preview
            />
          ) : (
            <H4>Chat</H4>
          )}
        </Flex>
      )}
      <InlineDialog open={small && !collapseChat} onOpenChange={(v) => setCollapseChat(!v)}>
        <Flex
          column="reverse"
          css={{
            flex: small ? '0 auto' : undefined,
            height: small ? 'auto' : '100%',
            padding: '0 $small',
            overflowY: 'auto',
            gap: '$small',
            overflowX: 'hidden',
          }}
        >
          <ChatInput event={event} />
          <Flex column="reverse" css={{ gap: '$small' }}>
            {messages?.map((message) => (
              <Message key={message._id.toString()} message={message} />
            ))}
          </Flex>
        </Flex>
      </InlineDialog>
    </ChatCtxProvider>
  )
}
