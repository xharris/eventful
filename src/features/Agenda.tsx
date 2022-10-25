import { useFormik } from 'formik'
import moment from 'moment'
import { ReactNode, useRef, useMemo, useState } from 'react'
import { Checkbox } from 'src/components/Checkbox'
import { Chip } from 'src/components/Chip'
import { Flex } from 'src/components/Flex'
import { H1, H2, H3, H4, H5, H6 } from 'src/components/Typography'
import { Icon } from 'src/components/Icon'
import { Eventful } from 'types'
import { FiCheck, FiList, FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import { Button } from 'src/components/Button'

// TODO: show past days with less opacity

interface Item {
  _id: Eventful.ID
  time?: Eventful.Time
  createdAt: string
}

interface DayItems<I extends Item> {
  key: string
  day: string
  dayOfWeek: string
  items: I[]
}

interface MonthItems<I extends Item> {
  month: string
  days: DayItems<I>[]
}

interface YearItems<I extends Item> {
  year: string
  months: MonthItems<I>[]
}

interface YearProps {
  label: string
}

const Year = ({ label }: YearProps) => (
  <Flex
    css={{
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}
  >
    <H2>{label}</H2>
  </Flex>
)

interface MonthProps<I extends Item> {
  label: string
  days: DayItems<I>[]
  renderItem: (item: I) => ReactNode
}

const Month = <I extends Item = Item>({ label, days, renderItem }: MonthProps<I>) => (
  <Flex column flex="0" css={{ gap: '$small' }}>
    <H4
      css={{
        textAlign: 'right',
        color: '#616161',
        background: 'linear-gradient(to bottom, $background 90%, transparent)',
        zIndex: 10,
        // padding: '0.5rem 0',
        position: 'sticky',
        top: -2,
      }}
    >
      {label}
    </H4>
    <Flex column css={{ gap: '$small' }}>
      {days.map((day) => (
        <Flex
          key={day.key}
          id={day.key}
          flex="0"
          css={{ position: 'relative', alignItems: 'flex-start' }}
        >
          <Flex
            column
            flex={0}
            css={{
              position: 'sticky',
              left: 0,
              top: 0,
              padding: '0.25rem 0',
              minWidth: 35,
              gap: 0,
              alignItems: 'center',
            }}
          >
            <H5
              css={{
                color: '$disabled',
              }}
            >
              {day.dayOfWeek}
            </H5>
            <H4
              css={{
                color: '$disabled',
              }}
            >
              {day.day}
            </H4>
          </Flex>
          <Flex column css={{ gap: 0, paddingTop: '$small' }}>
            {day.items.map((item) => (
              <Flex key={item._id.toString()}>{renderItem(item)}</Flex>
            ))}
          </Flex>
          <Flex flex="0" css={{ minWidth: '$small' }} />
        </Flex>
      ))}
    </Flex>
  </Flex>
)

interface AgendaOptions {
  tbd: boolean
  view: 'notime' | 'agenda'
}

interface AgendaProps<I extends Item> {
  items?: I[]
  noTimeHeader?: string
  noTimeSubheader?: string
  noItemsText?: string
  renderItem: (item: I) => ReactNode
  renderOnEveryDay?: boolean
  showYearSeparator?: boolean
  onAdd?: () => void
}

export const Agenda = <I extends Item = Item>({
  items = [],
  noTimeHeader = 'TBD',
  noTimeSubheader = '',
  noItemsText,
  renderItem,
  showYearSeparator = true,
  renderOnEveryDay = true,
  onAdd,
}: AgendaProps<I>) => {
  const [scrolled, setScrolled] = useState(false)
  const { values: options, setFieldValue } = useFormik<AgendaOptions>({
    initialValues: {
      tbd: true,
      view: 'agenda',
    },
    onSubmit: () => {},
  })

  const tbdItems = useMemo(
    () =>
      ({
        day: noTimeSubheader ?? '',
        items: items
          .filter((item) => !item.time?.start)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getMilliseconds() - new Date(b.createdAt).getMilliseconds()
          ),
      } as DayItems<I>),
    [items, noTimeSubheader]
  )

  const datedItems = useMemo(() => {
    const retItems =
      items
        .filter((item) => !!item.time?.start)
        .reduce((years, item) => {
          const start = moment(item.time?.start?.date)
          const end = moment(item.time?.end?.date ?? item.time?.start?.date)
          const year = start.format('YYYY')
          const month = start.format('MMMM')
          // store year
          if (!years[year]) {
            years[year] = {}
          }
          // store month
          if (!years[year][month]) {
            years[year][month] = {}
          }
          const months = years[year]
          // store in each day
          const days = renderOnEveryDay ? end.diff(start, 'days') : 0
          for (let d = 0; d <= days; d++) {
            const day = parseInt(start.format('D')) + d
            if (!months[month][day]) {
              months[month][day] = []
            }
            months[month][day].push(item)
          }
          return years
        }, {} as Record<string, Record<string, Record<string, I[]>>>) ?? {}

    return Object.entries(retItems)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([year, months]) => ({
        year,
        months: Object.entries(months)
          .sort((a, b) => moment(a[0], 'MMMM').month() - moment(b[0], 'MMMM').month())
          .map(([month, days]) => ({
            month: `${month} '${year.slice(2, 4)}`,
            days: Object.entries(days)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([day, items]) => ({
                key: `${year}-${month}-${day}`,
                day,
                dayOfWeek: moment(`${year}-${month}-${day}`, 'YYYY-MMMM-DD').format('ddd'),
                items,
              })),
          })),
      })) as YearItems<I>[]
  }, [items, renderOnEveryDay])

  const refComponent = useRef<HTMLDivElement>(null)

  return (
    <Flex
      ref={refComponent}
      column
      css={{
        padding: '2px 0px',
        overflow: 'auto',
        justifyContent: !items.length ? 'center' : 'flex-start',
        gap: '$small',
      }}
    >
      {!!items.length && (
        <Flex flex="0" style={{ justifyContent: 'space-between' }}>
          <Flex flex="0" css={{ alignItems: 'center', gap: '$small' }}>
            <Chip
              onClick={() => setFieldValue('view', 'notime')}
              clickable
              selected={options.view === 'notime'}
            >
              <Icon icon={FiMoreHorizontal} />
              <H6 style={{ whiteSpace: 'nowrap' }}>{`${noTimeHeader}${
                !!tbdItems.items.length ? ` (${tbdItems.items.length})` : ''
              }`}</H6>
            </Chip>
            <Chip
              onClick={() => setFieldValue('view', 'agenda')}
              clickable
              selected={options.view === 'agenda'}
            >
              <Icon icon={FiList} />
              <H6>Agenda</H6>
            </Chip>
          </Flex>
          {onAdd && (
            <Button variant="ghost" square={38} onClick={() => onAdd()}>
              <FiPlus />
            </Button>
          )}
          {/* <Checkbox
            name="notime"
            checked={options.view === 'notime'}
            onChange={() => setFieldValue('view', 'notime')}
            label={`${noTimeHeader}${!!tbdItems.items.length ? ` (${tbdItems.items.length})` : ''}`}
          />
          <Checkbox
            name="agenda"
            label="Agenda"
            checked={options.view === 'agenda'}
            onChange={() => setFieldValue('view', 'agenda')}
          /> */}
        </Flex>
      )}
      {options.view === 'notime' && (
        <Flex
          column
          css={{
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
            padding: '2px 0px',
            overflow: 'auto',
          }}
        >
          <Month label={noTimeHeader} days={[tbdItems]} renderItem={renderItem} />
        </Flex>
      )}
      {
        options.view === 'agenda' && (
          <Flex
            column
            css={{
              flexGrow: 1,
              flexShrink: 0,
              padding: '2px 0px',
              overflow: 'auto',
              overflowX: 'hidden',
              justifyContent: !items.length ? 'center' : 'flex-start',
            }}
          >
            {datedItems.map((year) => (
              <Flex key={year.year} column className="years" css={{ gap: '$small' }}>
                {showYearSeparator && <Year label={year.year} />}
                <Flex column className="months" css={{ gap: '$small' }}>
                  {year.months.map((month) => (
                    <Month
                      key={month.month}
                      label={month.month}
                      days={month.days}
                      renderItem={renderItem}
                    />
                  ))}
                </Flex>
              </Flex>
            ))}
            <Flex
              className="filler"
              css={{
                width: '100%',
                minHeight: refComponent.current?.getBoundingClientRect().height,
              }}
            />
          </Flex>
        )
        //  : noItemsText ? (
        //   <H1 css={{ color: '$disabled', fontStyle: 'italic', textAlign: 'center' }}>
        //     {noItemsText}
        //   </H1>
        // ) : null
      }
    </Flex>
  )
}
