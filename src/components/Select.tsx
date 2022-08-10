import { css, styled } from 'src/libs/styled'
import ReactSelect from 'react-select'
import { ComponentProps } from 'react'

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

interface ISelectProps<O, isMulti extends boolean = false> extends ComponentProps<typeof ReactSelect<O, isMulti>> {}

export const Select = <O, isMulti extends boolean = false>({ ...props }: ISelectProps<O, isMulti>) => {
  return <ReactSelect<O, isMulti> {...props} className={selectCss()} classNamePrefix='rs' />
}
