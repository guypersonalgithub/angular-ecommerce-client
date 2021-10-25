export class UserDetails {
    public constructor(
        public id_number?: number,
        public city?:string,
        public street?:string,
        public first_name?: string,
        public last_name?: string,
        public role?: string,
        public cart?: any[]
    ){}
}