import { Db, ObjectId } from 'mongodb'
import { mongodb } from '../config/mongdb'
import { Book } from '../models/Book'

export class BooksRepository {
  private db: Db

  constructor() {
    this.db = mongodb.db('mvc-mongo')
  }

  async findAll(): Promise<Book[]> {
    const collection = this.db.collection('books')

    const docs = await collection.find().toArray()

    const books: Book[] = []

    for (const doc of docs) {
      const book = new Book(
        {
          name: doc.name,
          price: doc.price,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
        doc._id.toString(),
      )

      books.push(book)
    }

    return books
  }

  async findById(bookId: string): Promise<Book | null> {
    const collection = this.db.collection('books')

    const doc = await collection.findOne({ _id: new ObjectId(bookId) })

    if (!doc?._id) {
      return null
    }

    const book = new Book(
      {
        name: doc?.name,
        price: doc?.price,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
      },
      doc?._id.toString(),
    )

    return book
  }

  async findByName(bookName: string): Promise<Book | null> {
    const collection = this.db.collection('books')

    const doc = await collection.findOne({ name: bookName })

    if (!doc?._id) {
      return null
    }

    const book = new Book(
      {
        name: doc?.name,
        price: doc?.price,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
      },
      doc?._id.toString(),
    )

    return book
  }

  async create(book: Book) {
    const collection = this.db.collection('books')

    await collection.insertOne({
      name: book.name,
      price: book.price,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    })
  }

  async update(book: Book, bookId: string) {
    const collection = this.db.collection('books')

    await collection.updateOne(
      { _id: new ObjectId(bookId) },
      {
        $set: { name: book.name, price: book.price, updatedAt: book.updatedAt },
      },
    )
  }

  async delete(bookId: string) {
    const collection = this.db.collection('books')

    await collection.deleteOne({ _id: new ObjectId(bookId) })
  }
}
