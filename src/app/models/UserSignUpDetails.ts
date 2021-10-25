export class UserSignUpDetails{
    public constructor (
        public id?:number,
        public email?:string,
        public endingEmail?:string,
        public password?:string,
        public city?:string,
        public street?:string,
        public name?: string,
        public lastName?: string
    ){}
}