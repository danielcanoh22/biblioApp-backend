import { AuthorModel } from "../models/author-model.js";

export class AuthorService {
  static async getAll() {
    const authors = await AuthorModel.getAll();
    return authors;
  }
}
