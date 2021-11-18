import { CountrySelection, Formatter, log, phoneNumberFormatter, toUpperCaseFormatter } from 'input/formatting/shared'
import React, { ChangeEvent, CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { select, toSelectionDirection, useSelection } from 'react/hooks/use-selection'

interface FormattedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const inputFormattedWith =
  <Props extends FormattedInputProps = FormattedInputProps, Context = void>(
    formatter: Formatter<Context>,
    context: (props: Props) => Context,
  ): React.FC<Props> =>
  (props) => {
    const [value, setValue] = useState(props.value)
    const textInputRef = useRef<HTMLInputElement>(null)
    const [selection, setSelection] = useSelection()
    const formatterContext = context(props)

    const { onChange } = props

    useEffect(() => {
      console.log('trigger  re format ' + formatterContext)
    }, [formatterContext])

    const handleChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        const inputElement = ev.target
        const caretFallback = inputElement.value.length
        const selectionAfterChange = select(
          inputElement.selectionStart ?? caretFallback,
          inputElement.selectionEnd ?? caretFallback,
          toSelectionDirection(inputElement.selectionDirection),
        )
        const previous = { selection, value }
        const toFormat = { selection: selectionAfterChange, value: inputElement.value, context: formatterContext }
        const formatted = formatter(previous, toFormat)
        // selection has to be stored to give the formatter a chance to position the
        // caret left of a formatting character
        setSelection(() => formatted.selection)
        if (previous.value === formatted.value) {
          // todo there was a change made in the dom that we have
          // 1. to revert because formatting the changed input resulted in the previous text
          // 2. restore the selection
          return
        }
        setValue(() => formatted.value)
        onChange(formatted.value)
      },
      [selection, setSelection, value, onChange, formatterContext],
    )

    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
    }
    return (
      <div style={style}>
        <input ref={textInputRef} type="text" placeholder={props.placeholder} onChange={handleChange} value={value} />
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    )
  }

const UppercaseCharacters: React.FC<FormattedInputProps> = inputFormattedWith(log(toUpperCaseFormatter), () => {})

interface PhoneNumberDigitsProps extends FormattedInputProps {
  countryCode: string
}

const PhoneNumberDigits: React.FC<PhoneNumberDigitsProps> = inputFormattedWith<PhoneNumberDigitsProps, string>(
  phoneNumberFormatter,
  (props: PhoneNumberDigitsProps) => props.countryCode,
)

const PhoneNumberInput: React.FC = () => {
  const [countryCode, setCountryCode] = useState('DE')
  const [formattedDigits, setFormattedDigits] = useState('')

  const onCountryCodeChange = useCallback((countryCode) => {
    setCountryCode(() => countryCode)
  }, [])
  const onFormattedDigitsChange = useCallback((formattedDigits) => {
    setFormattedDigits(() => formattedDigits)
  }, [])

  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
  }
  return (
    <div style={style}>
      <CountrySelection onChange={onCountryCodeChange} value={countryCode} />
      <PhoneNumberDigits value={formattedDigits} onChange={onFormattedDigitsChange} countryCode={countryCode} />
    </div>
  )
}

const onChange = (value: string) => console.log(value)
export const formattedInputOne = () => () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <ul>
      <li>
        <button onClick={() => setEnabled((old) => !old)}> magic</button>
      </li>
      <li>
        <CountrySelection onChange={onChange} value="FR" />
      </li>
      <li>
        <PhoneNumberDigits onChange={onChange} value="" placeholder="(213) 373-4253" countryCode={'US'} />
      </li>
      <li>
        <UppercaseCharacters onChange={onChange} value={'banana'} />
      </li>
      <li>{enabled ? <PhoneNumberInput /> : null}</li>
    </ul>
  )
}
