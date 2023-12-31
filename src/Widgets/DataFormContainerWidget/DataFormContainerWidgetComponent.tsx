import {
  ContentTag,
  navigateTo,
  provideComponent,
  useDataItem,
  // @ts-expect-error TODO: remove once officially released
  useDataScope,
} from 'scrivito'
import { DataFormContainerWidget } from './DataFormContainerWidgetClass'
import { toast } from 'react-toastify'
import { useRef, useState } from 'react'
import { snakeCase } from 'lodash-es'

provideComponent(DataFormContainerWidget, ({ widget }) => {
  const dataItem = useDataItem()
  const dataScope = useDataScope()
  const formRef = useRef() as React.MutableRefObject<HTMLFormElement>

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [keyCounter, setKeyCounter] = useState(0)
  const key = `DataFormContainerWidget-${widget.id()}-${keyCounter}`

  const redirectAfterCreate =
    widget.get('redirectAfterCreate') || widget.obj().parent()
  const createdMessage = widget.get('createdMessage')

  return (
    <form
      ref={formRef}
      key={key}
      onSubmit={onSubmit}
      onReset={onReset}
      className={isSubmitting ? 'form-loading' : ''}
    >
      <ContentTag content={widget} attribute="content" />
      {isSubmitting && <div className="loader" />}
    </form>
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()

    setIsSubmitting(true)

    const attributes = Object.fromEntries(
      new FormData(formRef.current).entries(),
    )

    try {
      if (dataItem) {
        await dataItem.update(attributes)
      } else {
        const createdItem = await dataScope.create(attributes)

        if (createdMessage) toast.success(createdMessage)

        if (redirectAfterCreate)
          // TODO: Remove this work around once #10212 is resolved
          navigateTo(redirectAfterCreate, {
            params: {
              [`${snakeCase(createdItem.dataClass().name())}_id`]:
                createdItem.id(),
            },
          })
      }
    } catch (error) {
      if (!(error instanceof Error)) return

      toast.error(
        <div>
          <h6>{error.message}</h6>
          <p>We&apos;re sorry for the inconvenience.</p>
        </div>,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function onReset(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()

    setKeyCounter((k) => k + 1)
  }
})
