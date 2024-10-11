import { uiContext, canEdit, Widget, Obj, connect } from 'scrivito'
import './ScrivitoIconEditor.css'
import { BootstrapIconPicker } from './BootstrapIconPicker'

export const ScrivitoBootstrapIconEditor = getScrivitoBootstrapIconEditor({})

export function getScrivitoBootstrapIconEditor(staticProps: {
  attribute?: string
  description?: string
  previewTitle?: string
  showClearButton?: boolean
}): (iconEditorProps: IconEditorProps) => JSX.Element {
  return function ScrivitoBootstrapIconEditor(
    iconEditorProps: IconEditorProps,
  ) {
    return (
      <IconPropertiesGroupComponent {...staticProps} {...iconEditorProps} />
    )
  }
}

type IconEditorProps =
  | { obj?: never; widget: Widget }
  | { obj: Obj; widget?: never }

const IconPropertiesGroupComponent = connect(
  function IconPropertiesGroupComponent({
    attribute,
    description,
    obj,
    previewTitle,
    showClearButton,
    widget,
  }: IconEditorProps & {
    attribute?: string
    description?: string
    previewTitle?: string
    showClearButton?: boolean
  }): JSX.Element | null {
    const attributeName = attribute || 'icon'
    const content = obj || widget
    const value = content.get(attributeName)
    const theme = uiContext()?.theme

    return theme ? (
      <div
        className={`scrivito_${theme} scrivito_detail_content icon-editor-tab`}
      >
        <div className="scrivito_notice_body">{description}</div>
        <div className="scrivito_detail_label">
          <span>{previewTitle ?? 'Preview'}</span>
        </div>
        <BootstrapIconPicker
          disabled={!canEdit(obj || widget.obj())}
          onChange={(name) =>
            content.update({ [attributeName]: name ? `bi-${name}` : '' })
          }
          showClearButton={showClearButton}
          value={
            typeof value === 'string' ? value.replace(/^bi-/, '') : undefined
          }
        />
      </div>
    ) : null
  },
)
