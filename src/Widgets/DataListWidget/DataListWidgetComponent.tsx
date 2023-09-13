import {
  ContentTag,
  isInPlaceEditingActive,
  provideComponent,
  useDataLocator,
} from 'scrivito'
import { DataListWidget } from './DataListWidgetClass'
import { useState } from 'react'

provideComponent(DataListWidget, ({ widget }) => {
  const [search, setSearch] = useState('')

  const data = widget.get('data')
  const dataScope = useDataLocator(data)

  const showSearch = widget.get('showSearch')

  const nrOfColumns = widget.get('nrOfColumns') || '1'

  return (
    <>
      {showSearch && (
        <div className="card mb-3 bg-light-grey">
          <div className="card-body">
            <input
              type="text"
              className="form-control"
              placeholder={widget.get('searchPlaceholder')}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </div>
      )}

      <div className={`row row-cols-1 row-cols-md-${nrOfColumns}`}>
        {dataScope
          .transform({ search })
          .take()
          .map((dataItem) => (
            <ContentTag
              content={widget}
              attribute="content"
              className="col"
              dataContext={dataItem}
              key={dataItem.id()}
            />
          ))}
      </div>
      {isInPlaceEditingActive() && (
        <div className="alert alert-warning d-flex m-auto">
          <i className="bi bi-exclamation-circle bi-2x" aria-hidden="true"></i>
          <div className="my-auto mx-2">
            <b>Editor note:</b> The following is only visible if
            &quot;data&quot; does not contains data.
          </div>
        </div>
      )}
      {(dataScope.isEmpty() || isInPlaceEditingActive()) && (
        <ContentTag content={widget} attribute="nothingFound" />
      )}
    </>
  )
})
