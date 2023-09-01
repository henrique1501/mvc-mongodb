/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify'
import { BooksRepository } from '../repositories/booksRepository'
import { Book } from '../models/Book'
import { z } from 'zod'

export class BooksController {
  async getAll(req: FastifyRequest, rep: FastifyReply) {
    const booksRepo = new BooksRepository()

    const books = await booksRepo.findAll()

    const booksData = []

    for (const book of books) {
      const data = {
        id: book.id,
        name: book.name,
        price: book.price,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      }

      booksData.push(data)
    }

    return rep.send(booksData)
  }

  async getBook(req: FastifyRequest, rep: FastifyReply) {
    const paramsSchema = z.object({
      bookId: z.string(),
    })

    const { bookId } = paramsSchema.parse(req.params)

    const booksRepo = new BooksRepository()

    const book = await booksRepo.findById(bookId)

    if (!book) {
      throw new Error('Book not found!')
    }

    const data = {
      id: book.id,
      name: book.name,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(book.price / 100),
      createdAt: book.createdAt,
    }

    return rep.send(data)
  }

  async createBook(req: FastifyRequest, rep: FastifyReply) {
    const booksRepo = new BooksRepository()

    const bodySchema = z.object({
      name: z.string(),
      price: z.coerce.number(),
    })

    const { name, price } = bodySchema.parse(req.body)

    const bookAlreadyExists = await booksRepo.findByName(name)

    if (bookAlreadyExists) {
      throw new Error('Book already exists!')
    }

    const book = new Book({
      name,
      price,
    })

    const data = await booksRepo.create(book)

    return rep.send(data)
  }

  async updateBook(req: FastifyRequest, rep: FastifyReply) {
    const booksRepo = new BooksRepository()

    const paramsSchema = z.object({
      bookId: z.string(),
    })

    const bodySchema = z.object({
      name: z.string().optional(),
      price: z.number().optional(),
    })

    const { bookId } = paramsSchema.parse(req.params)
    const { name, price } = bodySchema.parse(req.body)

    const book = await booksRepo.findById(bookId)

    if (!book) {
      throw new Error('Book not found!')
    }

    book.name = name ?? book.name
    book.price = price ?? book.price
    book.touch()

    await booksRepo.update(book, bookId)

    return rep.status(204).send()
  }

  async deleteBook(req: FastifyRequest, rep: FastifyReply) {
    const booksRepo = new BooksRepository()

    const paramsSchema = z.object({
      bookId: z.string(),
    })

    const { bookId } = paramsSchema.parse(req.params)

    const bookExists = await booksRepo.findById(bookId)

    if (!bookExists) {
      throw new Error('Book not found!')
    }

    await booksRepo.delete(bookId)

    return rep.status(204).send()
  }
}
