import { css, styled } from 'src/libs/styled'
import ReactSelect, { components } from 'react-select'
import { ComponentProps } from 'react'
import { Flex } from './Flex'

export const selectCss = css({
  flex: 1,
  '.rs__control': {
    border: 'none',
    backgroundColor: '$inputBackground',
    fontSize: '$control',
    borderRadius: '$control',
    padding: '0 $controlPadding',
    minHeight: '32px'
  },
  '.rs__indicators': {
    alignSelf: 'center'
  },
  '.rs__indicator': {
    padding: 0,
  },
  '.rs__indicator-separator': {
    display: 'none'
  },
  '.rs__indicator > svg': {
    width: '$control',
    height: "$control"
  }
})

interface Option  {
  value: unknown 
  label: string
  isFixed?: boolean
}

interface ISelectProps<O extends Option, isMulti extends boolean = false> extends ComponentProps<typeof ReactSelect<O, isMulti>> {}

export const Select = <O extends Option, isMulti extends boolean = false>({ ...props }: ISelectProps<O, isMulti>) => {
  return (
  <Flex data-testid="select">
    <ReactSelect<O, isMulti> {...props} 
      components={{
        MultiValueRemove: (props) => props.data.isFixed ? null : <components.MultiValueRemove {...props} />
      }}
      className={selectCss()} classNamePrefix='rs' 
    />
  </Flex>
  )
}
