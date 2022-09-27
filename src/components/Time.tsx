import { ComponentProps } from '@stitches/react'
import moment from 'moment'
import { ReactNode, useMemo } from 'react'
import { Eventful } from 'types'
import { Flex } from './Flex'
import { H5, H6 } from './Typography'

interface TimeProps extends ComponentProps<typeof Flex> {
  time: Eventful.Time
  timeOnly?: boolean
}

const calendarFormat = {
  lastDay: '[Yesterday]',
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  lastWeek: '[last] dddd',
  nextWeek: 'dddd',
  sameElse: 'L',
}
const calendarFormatTime = {
  lastDay: '[Yesterday at] LT',
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  lastWeek: '[last] dddd [at] LT',
  nextWeek: 'dddd [at] LT',
  sameElse: 'LT',
}

export const formatStart = (time: Eventful.Time) =>
  time.start
    ? moment(time.start.date).calendar(time.start?.allday ? calendarFormat : calendarFormatTime)
    : null

export const Time = ({ time, css, timeOnly, ...props }: TimeProps) => {
  const str = useMemo(() => {
    const start = time.start ? moment(time.start.date) : null
    const end = time.end ? moment(time.end.date) : null

    return [
      start?.calendar(time.start?.allday ? calendarFormat : calendarFormatTime),
      end?.calendar(time.end?.allday ? calendarFormat : calendarFormatTime),
    ]
      .filter((t) => t)
      .join(' - ')
  }, [time])

  return !timeOnly || !time.start?.allday ? (
    <Flex
      flex={0}
      css={{ gap: '$small', alignItems: 'center', whiteSpace: 'nowrap', ...css }}
      {...props}
    >
      {time.start && <H6>{str}</H6>}
    </Flex>
  ) : null
}
