import { ComponentProps } from '@stitches/react'
import moment from 'moment'
import { ReactNode, useMemo } from 'react'
import { Eventful } from 'types'
import { Flex } from './Flex'
import { H5, H6 } from './Typography'

interface TimeProps extends ComponentProps<typeof Flex> {
  time: Eventful.Time
}

const calendarFormat = {
  lastDay: '[Yesterday]',
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  lastWeek: '[last] dddd',
  nextWeek: 'dddd',
  sameElse: 'LT',
}
const calendarFormatTime = {
  lastDay: '[Yesterday at] LT',
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  lastWeek: '[last] dddd [at] LT',
  nextWeek: 'dddd [at] LT',
  sameElse: 'L',
}

export const formatStart = (time: Eventful.Time) =>
  time.start
    ? moment(time.start.date).calendar(time.start?.allday ? calendarFormat : calendarFormatTime)
    : null

export const Time = ({ time, css, ...props }: TimeProps) => {
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

  return (
    <Flex css={{ gap: '$small', alignItems: 'center', ...css }} {...props}>
      {time.start && <H5>{str}</H5>}
    </Flex>
  )
}
