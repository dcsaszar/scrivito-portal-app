import { provideObjClass } from 'scrivito'

export const Shipment = provideObjClass('Shipment', {
  attributes: {
    carrier: 'string',
    carrierTrackingNumber: 'string',
    customerId: 'string',
    deliveryConfirmation: 'string',
    dimensions: 'string',
    from: 'string',
    orderId: 'string',
    pdfDownloadUrl: 'string',
    scheduledDate: 'string',
    shipmentId: 'string',
    status: 'string',
    to: 'string',
    weight: 'string',
  },
})
