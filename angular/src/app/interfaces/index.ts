export interface Istate {
    users: IUserState
}

export interface IUserState {
    loggedUser:Iuser
    users:Iuser[]
}

export interface IquestionState {

}

export interface IanswerState {

}

export interface Iuser {
    displayName:string
    email:string
    uid:string
    photoURL:string
}

export interface Iquestion {
    title:string
    description:string
    id?:string
}