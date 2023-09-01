import { FastifyInstance } from 'fastify'

import { BooksController } from './controllers/BooksController'

export async function routes(app: FastifyInstance) {
  const booksController = new BooksController()

  app.get('/books', booksController.getAll)
  app.get('/books/get-one/:bookId', booksController.getBook)
  app.post('/books', booksController.createBook)
  app.put('/books/update/:bookId', booksController.updateBook)
  app.delete('/books/delete/:bookId', booksController.deleteBook)
}
