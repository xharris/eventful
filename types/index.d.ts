import { Types } from 'mongoose'

declare namespace Eventful {
  export type ID = Types.ObjectId
  export enum CATEGORY {
    None,
    Lodging,
    Carpool,
    Meet,
  }
  export interface LatLng {
    latitude: number
    longitude: number
  }
  export interface Time {
    start: Date
    end?: Date
    allday?: boolean
  }

  interface Document {
    _id: ID
    createdBy?: ID
    createdAt: Date
    updatedAt: Date
  }

  export interface Event extends Document {
    name: string
    rootGroup: ID
  }

  export interface Group extends Document {
    name: string
    category: CATEGORY
    event: ID
  }

  export interface Plan extends Document {
    what: string
    location: ID
    time: Time
    who: ID[]
  }

  export interface Location extends Document {
    label?: string
    coords: LatLng
    address: string
  }

  export interface User extends Document {
    username: string
    password: string
  }
}
