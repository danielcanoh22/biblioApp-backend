import { GenreModel } from "../models/genre-model.js";

export class GenreService {
  static async getAll() {
    const genres = await GenreModel.getAll();
    return genres;
  }
}
