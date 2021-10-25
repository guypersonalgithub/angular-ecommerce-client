export class UpdateProduct {
    public constructor (
        public product_name?: string,
        public category_name?: string,
        public price?: number,
        public original_name?: string,
    ){}
}