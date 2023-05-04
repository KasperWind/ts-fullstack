import {HasFormatter} from './Formatters.js'

export class Invoice implements HasFormatter {
    constructor(
        readonly client: string,
        private details: string,
        public amount: number,
    ){}

    public static fromObject(obj:any):Invoice | undefined {
        if (obj.hasOwnProperty('client') && obj.hasOwnProperty('details') && obj.hasOwnProperty('amount')) {
            return new Invoice(obj.client, obj.details, obj.amount)
        }
        return undefined
    }

    format() {
        return `${this.details} bought from ${this.client} for ${this.amount} dkk`
    }
}

export class Payment implements HasFormatter {
    constructor(
        readonly recipient: string,
        private details: string,
        public amount: number
    ){}

    public static fromObject(obj:any):Payment | undefined {
        if (obj.hasOwnProperty('recipient') && obj.hasOwnProperty('details') && obj.hasOwnProperty('amount')) {
            return new Payment(obj.recipient, obj.details, obj.amount)
        }
        return undefined
    }

    format() {
        return `Payed ${this.recipient}  ${this.amount} dkk for ${this.details}`
    }
}
