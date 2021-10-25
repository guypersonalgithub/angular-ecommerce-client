export class SuccesfullLoginServerResponse {
    public constructor (
        public token?:string,
        // public userType?:string,
        // public name?: string,
        public username_email?:string,
        public id_number?: number,
        public password?:string,
        public city?:string,
        public street?:string,
        public first_name?: string,
        public last_name?: string,
        public role?: string,
        public categories?: any[],
        public products?: any[],
        public orderStats?: number,
        public cart?: any
    ){}
}