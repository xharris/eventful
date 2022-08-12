import moment from 'moment'
import { ReactNode, useEffect, useMemo } from 'react'
import { Flex } from 'src/components/Flex'
import { H1, H2, H3 } from 'src/components/Header'
import { Eventful } from 'types'

// TODO: show past days with less opacity

interface Item {
  time?: Eventful.Time
  createdAt: string
}

interface MonthProps<I extends Item> {
  label: string
  days: Record<string, I[]>
  renderItem: (item: I) => ReactNode
}

const Month = <I extends Item = Item>({ label, days, renderItem }: MonthProps<I>) => (
  <Flex column flex="0">
    <H2
      css={{
        marginLeft: '3rem',
        color: '#616161',
        background: 'linear-gradient(to bottom, $background 90%, transparent)',
        zIndex: 10,
        padding: '0.5rem 0',
        position: 'sticky',
        top: -2,
      }}
    >
      {label}
    </H2>
    <Flex column>
      <Flex column>
        {Object.entries(days).map(([day, items]) => (
          <Flex key={day} flex="0" css={{ position: 'relative', alignItems: 'flex-start' }}>
            <H3
              css={{
                color: '$disabled',
                position: 'sticky',
                left: 0,
                top: 0,
                padding: '0.2rem 0',
                minWidth: 35,
              }}
            >
              {day}
            </H3>
            <Flex column css={{ gap: '$controlPadding' }}>
              {items
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getMilliseconds() -
                    new Date(b.createdAt).getMilliseconds()
                )
                .map((item) => renderItem(item))}
            </Flex>
            <Flex flex="0" css={{ minWidth: 35 }} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  </Flex>
)

interface AgendaProps<I extends Item> {
  items?: I[]
  noTimeHeader: string
  noTimeSubheader?: string
  noItemsText?: string
  renderItem: (item: I) => ReactNode
  renderOnEveryDay?: boolean
}

export const Agenda = <I extends Item = Item>({
  items = [],
  noTimeHeader,
  noTimeSubheader,
  noItemsText,
  renderItem,
  //
  renderOnEveryDay = true,
}: AgendaProps<I>) => {
  const tbdItems = useMemo(
    () => ({
      [noTimeSubheader ?? '']: items
        .filter((item) => !item.time?.start)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getMilliseconds() - new Date(b.createdAt).getMilliseconds()
        ),
    }),
    [items, noTimeSubheader]
  )

  const datedItems = useMemo(
    () =>
      items
        .filter((item) => !!item.time?.start)
        .reduce((months, item) => {
          const start = moment(item.time?.start?.date)
          const end = moment(item.time?.end?.date ?? item.time?.start?.date)
          const month = start.format('MMMM')
          // store month
          if (!months[month]) {
            months[month] = {}
          }
          // store in each day
          const days = renderOnEveryDay ? end.diff(start, 'days') : 0
          for (let d = 0; d <= days; d++) {
            const day = parseInt(start.format('D')) + d
            if (!months[month][day]) {
              months[month][day] = []
            }
            months[month][day].push(item)
          }
          return months
        }, {} as Record<string, Record<string, I[]>>) ?? {},
    [items, renderOnEveryDay]
  )

  return (
    <Flex
      column
      css={{
        padding: '2px 0px',
        overflow: 'auto',
        justifyContent: !items.length ? 'center' : 'flex-start',
      }}
    >
      {!!items.length ? (
        <>
          {!!tbdItems[noTimeSubheader ?? ''].length && (
            <Month label={noTimeHeader} days={tbdItems} renderItem={renderItem} />
          )}
          {Object.entries(datedItems).map(([month, days]) => (
            <Month key={month} label={month} days={days} renderItem={renderItem} />
          ))}
        </>
      ) : noItemsText ? (
        <H1 css={{ color: '$disabled', fontStyle: 'italic', textAlign: 'center' }}>
          {noItemsText}
        </H1>
      ) : null}
    </Flex>
  )
}
