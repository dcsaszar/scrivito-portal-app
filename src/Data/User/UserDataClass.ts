import { load } from 'scrivito'
import { localStorageUserDataClass } from './LocalStorage/localStorageUserDataClass'
import { CurrentUser } from '../CurrentUser/CurrentUserDataItem'
import { DataClassAttributes, RawItem } from '../types'
import { pisaUserDataClass } from './Pisa/pisaUserDataClass'

const attributes: DataClassAttributes = {
  email: 'string',
  familyName: 'string',
  givenName: 'string',
  name: 'string',
  position: 'string',
  salutation: 'string',
}

export const User = import.meta.env.ENABLE_PISA
  ? pisaUserDataClass(attributes)
  : localStorageUserDataClass(attributes)

export async function postProcessUserData(data: RawItem): Promise<RawItem> {
  // Use the data item cached by Scrivito instead of connecting to the backend directly
  const pisaUserId = await load(() => CurrentUser.get('pisaUserId'))
  if (data._id !== pisaUserId) return data

  return {
    _id: data._id,
    staff: false,
    email: await load(() => CurrentUser.get('email')),
    familyName: await load(() => CurrentUser.get('familyName')),
    givenName: await load(() => CurrentUser.get('givenName')),
    image: { url: await load(() => CurrentUser.get('picture')) },
    name: await load(() => CurrentUser.get('name')),
    salutation: await load(() => CurrentUser.get('salutation')),
  }
}
