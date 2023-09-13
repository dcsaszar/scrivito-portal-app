import {
  provideComponent,
  isInPlaceEditingActive,
  ContentTag,
  InPlaceEditingOff,
  useDataItem,
} from 'scrivito'
import { getFieldName } from '../FormContainerWidget/utils/getFieldName'
import { FormOptionsWidget } from './FormOptionsWidgetClass'

provideComponent(FormOptionsWidget, ({ widget }) => {
  const id = `form_checkbox_widget_${widget.id()}`

  const dataItem = useDataItem()
  const customFieldName = widget.get('customFieldName')

  const initialValue = dataItem?.get(customFieldName)

  const labelOptions: { htmlFor?: string } = {}
  if (!isInPlaceEditingActive()) labelOptions.htmlFor = id

  let mapping: Record<string, { title: string }> = {}
  try {
    mapping = JSON.parse(widget.get('mapping'))
  } catch {
    // skip
  }

  return (
    <select
      className="form-control"
      id={id}
      name={getFieldName(widget)}
      required={widget.get('required')}
      defaultValue={typeof initialValue === 'string' ? initialValue : undefined}
    >
      {Object.keys(mapping).map((key) => (
        <option key={key} value={key}>
          {mapping[key].title}
        </option>
      ))}
    </select>
  )
})
