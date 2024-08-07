import { provideLocalStorageDataClass } from '../../../utils/provideLocalStorageDataClass'
import { DataClassAttributes } from '../../types'

export function localQuoteDataClass(attributes: DataClassAttributes) {
  return provideLocalStorageDataClass('Quote', {
    attributes,
    initialContent: [
      {
        _id: '0F80EB689F5AC10BE040A8C00F0173D3',
        keyword: 'Überholung Schmieranlage Metallbau MAX/40',
        number: 'P-06.002492',
        type: 'PSA_QUO_STY_GEN_OVR',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '052601BEBCEC39C8E040A8C00D0107AC',
        technicalAgent: 'D456ACF6FF405922E030A8C02A010C68',
        salesPartner: 'Hono Gerätebau GmbH (Grafing)',
        status: 'PSA_PRO_QUO_WON',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_CRE',
        open: false,
        quoteAt: '2022-11-24T20:38:43Z',
        orderAt: '2023-01-02T19:03:08Z',
        deliveryAt: null,
        termsOfDelivery: '',
        termsOfPayment: 'PSI_TOP_30',
        totalPrice: 18400.0,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-10-27T18:40:40Z',
      },
      {
        _id: '18EEDF590CBA51BFE040A8C00F012317',
        keyword: 'Angebot über 8 Zentral-Schmieranlagen MAX/20',
        number: 'P-06.003405',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F87BDC400E41D630E030A8C00D01158A',
        technicalAgent: '5C6E286751B67125E040007F01001F63',
        salesPartner: '',
        status: 'PSA_PRO_QUO_EP',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_EPH',
        open: true,
        quoteAt: '2022-09-20T22:00:00Z',
        orderAt: '2024-04-01T11:00:00Z',
        deliveryAt: null,
        termsOfDelivery: 'FOR',
        termsOfPayment: 'RFC_TOP_NT60',
        totalPrice: 75273.76157817413,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2024-03-19T22:00:00Z',
      },
      {
        _id: '18EEEAECD1777397E040A8C00F012319',
        keyword: 'Angebot über 4 Zentral-Schmieranlagen MAX/20',
        number: 'P-06.003405',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F87BDC400E41D630E030A8C00D01158A',
        technicalAgent: '390BB8B5DC17255BE040A8C00F012B32',
        salesPartner: 'aap Deutsche mbH (Minden)',
        status: 'PSA_PRO_QUO_VER',
        mainStatus: '',
        open: false,
        quoteAt: '2023-01-23T09:56:09Z',
        orderAt: '2023-05-03T10:55:56Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_DAF',
        termsOfPayment: 'RFC_TOP_NT60',
        totalPrice: 36097.082404249704,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-03-23T09:56:10Z',
      },
      {
        _id: '2969FBD752154BC399ED8CC624BF0345',
        keyword: 'Schmieranlage Max40 für Maier Schmiertechnik GmbH',
        number: 'P-11-008081',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '052601BEBCEC39C8E040A8C00D0107AC',
        technicalAgent: '18EEEAEC56D37397E040A8C00F012319',
        salesPartner: '',
        status: 'PSA_PRO_QUO_LST',
        mainStatus: 'PSA_SAP_MAI_QUO_LST',
        open: false,
        quoteAt: '2023-10-25T14:42:47Z',
        orderAt: '2023-10-29T14:30:28Z',
        deliveryAt: '2023-11-25T15:10:15Z',
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: 'PSI_TOP_40',
        totalPrice: 261.9047619047618,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-11-16T15:09:43Z',
      },
      {
        _id: '2977CC5DB70E4CD59CDA206AD2998F23',
        keyword: 'Angebot 10 x Schmieranlage Max 40',
        number: 'P-11-007882',
        type: 'PSA_QUO_STY_STD',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '052601BEBCEC39C8E040A8C00D0107AC',
        technicalAgent: '18EEEAEC56D37397E040A8C00F012319',
        salesPartner: '',
        status: 'PSA_PRO_QUO_CPE',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_EPH',
        open: true,
        quoteAt: '2023-10-21T12:48:14Z',
        orderAt: '2024-01-03T10:00:00Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: 'PSA_TOP_10',
        totalPrice: 252464.76190476178,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: '2B6146FA2CFCF632E040A8C00F014D30',
        keyword: 'Angebot Pumpen Anlage',
        number: 'P-07.004389',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '228C5C6067EF486FB72F8D4BAAE6AB08',
        technicalAgent: '5C6E286751B67125E040007F01001F63',
        salesPartner: 'Hono Gerätebau GmbH (Grafing)',
        status: 'PSA_PRO_QUO_CMV',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_PRP_ZUR',
        open: false,
        quoteAt: '2023-08-15T19:31:34Z',
        orderAt: '2023-10-17T18:30:51Z',
        deliveryAt: null,
        termsOfDelivery: '',
        termsOfPayment: 'RFC_TOP_NT60',
        totalPrice: 0.0,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: '46C5ED412553436D838D0547771D9258',
        keyword: 'Neue Schmieranlage für Maier Schmiertechnik',
        number: 'P-11-007840',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F87BDC400E41D630E030A8C00D01158A',
        technicalAgent: '',
        salesPartner: '',
        status: 'PSA_PRO_QUO_LST',
        mainStatus: 'PSA_SAP_MAI_QUO_LST',
        open: false,
        quoteAt: '2023-10-05T10:53:36Z',
        orderAt: '2023-11-15T10:00:00Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: 'PSI_TOP_40',
        totalPrice: 1826.2380952380947,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: '4E1FEAAC57E7DFC7E040007F010032F5',
        keyword: 'Angebot Schmieranlage Metallbau MAX/60',
        number: 'P-08.006495',
        type: 'PSA_QUO_STY_GEN_OVR',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F87BDC400E41D630E030A8C00D01158A',
        technicalAgent: 'D456ACF6FF405922E030A8C02A010C68',
        salesPartner: 'Hono Gerätebau GmbH (Grafing)',
        status: 'PSA_PRO_QUO_WON',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_CRE',
        open: false,
        quoteAt: '2023-10-17T10:30:58Z',
        orderAt: '2023-10-17T10:33:03Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CIF',
        termsOfPayment: 'PSI_TOP_30',
        totalPrice: 18400.0,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-10-27T18:40:40Z',
      },
      {
        _id: '512F34E2F2D3FBDEE040007F01002EBD',
        keyword: 'Angebot Maier Schmiertechnik Vacustar',
        number: 'P-08.006527',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'D456ACF6FF405922E030A8C02A010C68',
        technicalAgent: '5C6E286751B67125E040007F01001F63',
        salesPartner: 'Hono Gerätebau GmbH (Grafing)',
        status: 'PSA_PRO_QUO_WON',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_CRE',
        open: false,
        quoteAt: '2023-10-14T08:52:02Z',
        orderAt: '2023-10-14T09:07:06Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: 'RFC_TOP_NT60',
        totalPrice: 21580.0,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-10-28T08:52:21Z',
      },
      {
        _id: '5A6A1576CD3841AE8A35E1FF714486D5',
        keyword: 'Kompressoranlage 400 bar',
        number: '00097',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F87BDC400E41D630E030A8C00D01158A',
        technicalAgent: '5C6EDDBA2459CAB4E040007F0100275E',
        salesPartner: '',
        status: 'PSA_PRO_QUO_WRK',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_CER',
        open: true,
        quoteAt: '2023-05-03T00:00:00Z',
        orderAt: '2023-05-03T00:00:00Z',
        deliveryAt: '2023-05-27T00:00:00Z',
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: 'PSI_TOP_40',
        totalPrice: 67417.14285714284,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: '81282658BDCF471FB2ED3051D6528597',
        keyword: 'Angebot Schmieranlage für Maier',
        number: 'P-20-009128',
        type: 'PSA_QUO_STY_STD',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '052601BEBCEC39C8E040A8C00D0107AC',
        technicalAgent: '18EEEAEC56D37397E040A8C00F012319',
        salesPartner: 'Hono Gerätebau GmbH (Grafing)',
        status: 'PSA_PRO_QUO_WON',
        mainStatus: 'PSA_SAP_MAI_QUO_ORD_CRE',
        open: false,
        quoteAt: '2023-12-10T12:48:42Z',
        orderAt: '2023-12-10T13:05:58Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: '',
        totalPrice: 25657.904761904745,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: 'C6D30A8964AF42C795529F1CCEB3484E',
        keyword: 'Angebot Max 40',
        number: 'P-18-009104',
        type: 'PSA_QUO_STY_STD',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: '052601BEBCEC39C8E040A8C00D0107AC',
        technicalAgent: 'F87BDC400E41D630E030A8C00D01158A',
        salesPartner: '',
        status: 'PSA_PRO_QUO_LST',
        mainStatus: 'PSA_SAP_MAI_QUO_LST',
        open: false,
        quoteAt: '2023-12-12T12:11:02Z',
        orderAt: '2024-02-11T10:00:00Z',
        deliveryAt: null,
        termsOfDelivery: 'RFC_TOD_CFR',
        termsOfPayment: '',
        totalPrice: 182367.38,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: null,
      },
      {
        _id: 'F04A98B9DD5F1534E030A8C00C013E99',
        keyword: 'Angebot Schmieranlage für Maier Schmiertechnik',
        number: 'P-05.000211',
        type: 'PSA_QUO_STY_NEW',
        customer: 'Maier Schmiertechnik GmbH (München)',
        commercialAgent: 'F9E1B255871A5EEEE030A8C00D012D39',
        technicalAgent: '',
        salesPartner: '',
        status: 'PSA_PRO_QUO_VER',
        mainStatus: '',
        open: false,
        quoteAt: '2023-07-11T08:29:14Z',
        orderAt: '2023-09-26T13:12:11Z',
        deliveryAt: '2023-10-24T07:29:14Z',
        termsOfDelivery: '',
        termsOfPayment: '',
        totalPrice: 10118.404639175222,
        totalPriceCurrency: 'EUR',
        description: '',
        validUntil: '2023-09-20T07:29:14Z',
      },
    ],
  })
}
