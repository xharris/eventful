import { useFormik } from 'formik'
import { useEffect, useMemo } from 'react'
import { FiMinus } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import { Avatar } from 'src/components/Avatar'
import { AddButton, Button, RemoveButton } from 'src/components/Button'
import { Flex } from 'src/components/Flex'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Typography'
import { Icon } from 'src/components/Icon'
import { Select } from 'src/components/Select'
import { useContacts } from 'src/eventfulLib/contact'
import { useSession } from 'src/eventfulLib/session'
import { useSettings } from 'src/eventfulLib/setting'
import { useUser } from 'src/eventfulLib/user'
import { Eventful } from 'types'

export const User = () => {
  const { username } = useParams<{ username: string }>()
  const { session, logOut } = useSession()
  const isMe = useMemo(() => username === session?.username, [session, username])

  const history = useHistory()
  const { data: user } = useUser({ username })
  const { data: contacts, addContact, removeContact } = useContacts({ user: session?._id })
  const { data: settings, setSettings } = useSettings()

  const { setFieldValue, values, dirty, resetForm, submitForm } =
    useFormik<Eventful.API.SettingsGet>({
      initialValues: settings ?? {},
      enableReinitialize: true,
      onSubmit: (values) => {
        setSettings(values).then(() => resetForm())
      },
    })

  const searchVisOptions: { value: Eventful.API.SettingsGet['searchVisibility']; label: string }[] =
    [
      {
        value: 'any',
        label: 'Anyone',
      },
      {
        value: 'contacts',
        label: 'Contacts',
      },
    ]

  return user ? (
    <Flex
      fill
      css={{
        flexDirection: 'column',
        '@phablet': {
          flexDirection: 'row',
        },
      }}
    >
      <Flex column css={{ alignItems: 'flex-start' }}>
        <Flex css={{ alignItems: 'center' }}>
          <Avatar size="large" username={user.username} />
          <H1>{username}</H1>
        </Flex>
        {session?.username === username ? (
          <Flex column>
            <Button
              onClick={() =>
                window.confirm('Are you sure you want to log out?') &&
                logOut().then(() => history.push('/'))
              }
            >
              Log out
            </Button>
            <Flex>
              <H3>Account visibility:</H3>
              <Select
                defaultValue={
                  values.searchVisibility
                    ? searchVisOptions.find((opt) => opt.value === values.searchVisibility)
                    : {
                        value: 'any',
                        label: 'Anyone',
                      }
                }
                onChange={(v) => v && setFieldValue('searchVisibility', v.value)}
                options={searchVisOptions}
              />
            </Flex>
            {dirty && <Button onClick={submitForm}>Save</Button>}
          </Flex>
        ) : (
          <Flex column>
            {session &&
              contacts &&
              (!contacts.find((user) => user.username === username) ? (
                <AddButton onClick={() => addContact(user._id)} title="Add contact">
                  Add
                </AddButton>
              ) : (
                <RemoveButton
                  onClick={() =>
                    window.confirm('Are you sure you want to remove this contact?') &&
                    removeContact(user._id)
                  }
                  title="Remove contact"
                >
                  Remove
                </RemoveButton>
              ))}
          </Flex>
        )}
      </Flex>
      <Flex column>
        {isMe && (
          <Flex column>
            <H3>Contacts</H3>
            {!contacts?.length ? (
              <H4 subtle>None yet...</H4>
            ) : (
              <Flex column className="contacts" css={{ alignItems: 'flex-start' }}>
                {contacts.map((contact) => (
                  <Flex
                    key={contact._id.toString()}
                    css={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                    flex="0"
                  >
                    <Flex css={{ alignItems: 'center' }}>
                      <Avatar
                        username={contact.username}
                        size="medium"
                        to={`/u/${contact.username}`}
                      />
                      <H4>{contact.username}</H4>
                    </Flex>
                    <Button
                      onClick={() =>
                        window.confirm('Are you sure you want to remove this contact?') &&
                        removeContact(contact._id)
                      }
                    >
                      <Icon icon={FiMinus} />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  ) : (
    <Flex fill>
      <H2>Loading...</H2>
    </Flex>
  )
}
