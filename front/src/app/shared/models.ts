
  export class HistoryModel{
    name:string
    description: string
    type: string
    date: Date
    userlogin: string
  }
  export class UserModel{
    _id: string
    name: string
    family: string
    surname: string
    username: string
    email: string
    password: string
    role:Role
    token?: string
    confirmpassword: string
  }
  export class Person{
    id: number
    name: string
    family: string
    surname: string
    INN: string
  }
  export enum Role {
    User = 'user',
    Admin = 'admin'
}