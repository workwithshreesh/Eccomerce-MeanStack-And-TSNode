import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ReviewRating } from "../models/ReviewRatings";
import { Product } from "../models/Product";
import { User } from "../models/User";

const reviewRepo = AppDataSource.getRepository(ReviewRating);
const productRepo = AppDataSource.getRepository(Product);
const userRepo = AppDataSource.getRepository(User);

export class ReviewRatingController {
  //  Add Review
  static async addReview(req: Request, res: Response) {
    const userId = req.body.id;
    const { productId, rating, review } = req.body;

    try {
      const user = await userRepo.findOneBy({ id: userId });
      const product = await productRepo.findOneBy({ id: productId });

      if (!user || !product) {
        return res.status(404).json({ message: "User or Product not found" });
      }

      const alreadyReviewed = await reviewRepo.findOne({
        where: { user: { id: userId }, product: { id: productId } },
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed by user" });
      }

      const newReview = reviewRepo.create({ user, product, rating, review });
      const saved = await reviewRepo.save(newReview);

      res.status(201).json({ message: "Review added", review: saved });
    } catch (err) {
      res.status(500).json({ message: "Failed to add review", error: err });
    }
  }

  //  Get Reviews for a Product
  static async getProductReviews(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const reviews = await reviewRepo.find({
        where: { product: { id: +productId } },
        relations: ["user"],
        order: { createdAt: "DESC" },
      });

      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Error fetching reviews", error: err });
    }
  }

  //  Update Review
  static async updateReview(req: Request, res: Response) {
    const { productId } = req.params;
    const userId = req.body.id;
    const { rating, review } = req.body;

    try {
      const existing = await reviewRepo.findOne({
        where: { product: { id: +productId }, user: { id: userId } },
      });

      if (!existing) {
        return res.status(404).json({ message: "Review not found" });
      }

      existing.rating = rating ?? existing.rating;
      existing.review = review ?? existing.review;

      const updated = await reviewRepo.save(existing);
      res.status(200).json({ message: "Review updated", review: updated });
    } catch (err) {
      res.status(500).json({ message: "Failed to update review", error: err });
    }
  }

  //  Delete Review
  static async deleteReview(req: Request, res: Response) {
    const { productId } = req.params;
    const userId = req.body.id;

    try {
      const existing = await reviewRepo.findOne({
        where: { product: { id: +productId }, user: { id: userId } },
      });

      if (!existing) return res.status(404).json({ message: "Review not found" });

      await reviewRepo.remove(existing);
      res.status(200).json({ message: "Review deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting review", error: err });
    }
  }
}
