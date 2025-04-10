import express from "express";
import { ReviewRatingController } from "../controller/reviewRatingsController";
import { authMiddleWare } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/review", authMiddleWare, async (req,res)=>{
    await ReviewRatingController.addReview(req,res);
});

router.get("/review",async (req,res) => {
    await ReviewRatingController.getProductReviews(req,res);
});

router.put("/review/:id", authMiddleWare, async (req,res) => {
    await ReviewRatingController.updateReview(req,res);
});

router.delete("/review/:id", authMiddleWare, async (req,res) => {
    await ReviewRatingController.deleteReview(req,res);
});

router.get("/review/:id/:productId", authMiddleWare, async (req,res) => {
    await ReviewRatingController.getReviewbyId(req,res);
});

export default router