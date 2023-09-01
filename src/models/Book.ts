import { Replace } from '../helpers/replace'

type Props = {
  name: string
  price: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Book {
  private _id: string | undefined
  private props: Props

  constructor(props: Replace<Props, { createdAt?: Date }>, id?: string) {
    this._id = id ?? undefined
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }
  }

  public get id(): string | undefined {
    return this._id
  }

  public get name(): string {
    return this.props.name
  }

  public set name(name: string) {
    this.props.name = name
  }

  public get price(): number {
    return this.props.price
  }

  public set price(price: number) {
    this.props.price = price
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  public touch() {
    this.props.updatedAt = new Date()
  }
}
