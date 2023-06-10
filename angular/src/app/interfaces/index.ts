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
    name:string
    email:string
    id:string
    avatar:string
}