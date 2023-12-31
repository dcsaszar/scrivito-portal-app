import { provideObjClass } from 'scrivito'

export const Quote = provideObjClass('Quote', {
  attributes: {
    comments: 'string',
    content: 'string',
    createdAt: 'string',
    customerId: 'string',
    payment: 'string',
    pdfDownloadUrl: 'string',
    quoteId: 'string',
    status: 'string',
    termsAndConditions: 'string',
    total: 'string',
    validUntil: 'string',
  },
})
