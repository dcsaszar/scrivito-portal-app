import { useId, useState } from 'react'

export function IconPicker({
  disabled,
  icons,
  onChange,
  renderFunc,
  showClearButton,
  value,
}: {
  disabled?: boolean
  icons: string[]
  onChange: (value: string | undefined) => void
  renderFunc: (value?: string) => JSX.Element
  showClearButton?: boolean
  value?: string
}) {
  const [matchingIcons, setMatchingIcons] = useState(icons)
  const inputId = useId()
  const searchLabel = 'Search'

  return (
    <div className="icon-picker">
      <label
        aria-label={disabled ? undefined : searchLabel}
        className="icon-preview"
        htmlFor={inputId}
        title={value}
      >
        {renderFunc(value)}
      </label>
      {!disabled && showClearButton && value && (
        <button className="icon-clear" onClick={() => onChange(undefined)}>
          ❌
        </button>
      )}
      {!disabled && (
        <div className="icon-dialog">
          <label className="icon-search" aria-label={searchLabel}>
            <input
              id={inputId}
              onChange={(e) => search(e.target.value.trim().split(/\s+/))}
              placeholder={value}
              type="search"
            />
          </label>
          <div className="icon-select">
            {matchingIcons.map((icon) => (
              <button
                className={icon === value ? 'active' : undefined}
                key={icon}
                onClick={() => onChange(icon)}
                title={icon}
              >
                {renderFunc(icon)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  function search(terms: string[]) {
    setMatchingIcons(
      icons.filter((icon) => terms.every((term) => icon.includes(term))),
    )
  }
}
