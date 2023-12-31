import { provideComponent, LinkTag } from 'scrivito'
import { WrapIfClassName } from '../../Components/WrapIfClassName'
import { alignmentClassNameWithBlock } from '../../utils/alignmentClassName'
import { ButtonWidget } from './ButtonWidgetClass'

provideComponent(ButtonWidget, ({ widget }) => {
  const target = widget.get('target')
  let text = target && target.title()
  if (!text) {
    text = 'Provide the button link and text in the widget properties.'
  }

  const buttonClassNames = ['btn']
  buttonClassNames.push(widget.get('buttonColor') || 'btn-primary')

  const buttonSize = buttonSizeClassName(widget.get('buttonSize'))
  if (buttonSize) buttonClassNames.push(buttonSize)

  return (
    <WrapIfClassName
      className={alignmentClassNameWithBlock(widget.get('alignment'))}
    >
      <LinkTag to={target} className={buttonClassNames.join(' ')}>
        {text}
      </LinkTag>
    </WrapIfClassName>
  )
})

function buttonSizeClassName(buttonSize: string | null) {
  if (buttonSize === 'small') return 'btn-sm'
  if (buttonSize === 'large') return 'btn-lg'
}
