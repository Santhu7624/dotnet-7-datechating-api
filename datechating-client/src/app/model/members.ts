import { Photo } from "./photo"

export interface Member {
    userName: string
    Gender: string
    dateOfBirth: string
    knownAs: string
    createdDate: string
    lastActive: string
    introduction: string
    lookingFor: string
    interests: string
    city: string
    country: string
    photoUrl: string
    age : number
    photos: Photo[]
  }