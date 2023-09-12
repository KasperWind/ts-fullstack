import {HasFormatter} from './Formatters.js'

export function fromObject(obj: any) : (Payment | Invoice | undefined) {
    const p = Payment.fromObject(obj)
    if (p) {return p}
    const i = Invoice.fromObject(obj)
    if (i) {return i}
    return undefined
}

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
        return `Sold '${this.details}' to '${this.client}' for '${this.amount}' `
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
        return `Bought '${this.details}' in '${this.recipient}' for '${this.amount}' `
    }
}
