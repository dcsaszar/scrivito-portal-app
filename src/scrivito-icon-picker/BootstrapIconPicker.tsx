import { useMemo } from 'react'
import { IconPicker } from './IconPicker'
import codepoints from 'bootstrap-icons/font/bootstrap-icons.json'
import 'bootstrap-icons/font/bootstrap-icons.css'

export function BootstrapIconPicker(props: {
  disabled?: boolean
  onChange: (value?: string) => void
  showClearButton?: boolean
  value?: string
}) {
  const icons = useMemo(() => Object.keys(codepoints).sort(), [])

  return (
    <IconPicker
      icons={icons}
      renderFunc={(icon) => <i className={`bi bi-${icon}`} />}
      {...props}
    />
  )
}
