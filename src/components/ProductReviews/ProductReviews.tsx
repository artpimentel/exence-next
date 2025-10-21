"use client";

import styles from "./ProductReviews.module.css";
import { FaHeart } from "react-icons/fa6";

import type { Producer } from "../../types/Producer";
import type { ProducerReview } from "../../types/ProducerReview";

interface ProductReviewsProps {
  producer: Producer;
}

function ProductReviews({ producer }: ProductReviewsProps) {
  const reviews = producer.reviews || [];

  const hasReviews = reviews.length > 0;

  const rating = hasReviews
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <section id="reviews" className={styles.productReviews}>
      <div className={styles.layout}>
        <div className={styles.header}>
          <h2>{producer.reviews?.length} Avaliações</h2>
          <span className={styles.ratingValue}>
            <span>
              <FaHeart />
            </span>
            {typeof rating === "number" && !isNaN(rating)
              ? rating.toFixed(1)
              : "N/D"}{" "}
          </span>
        </div>

        <ul className={styles.reviewsList}>
          {hasReviews ? (
            reviews.map((review: ProducerReview) => (
              <li key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewInfo}>
                  <p className={styles.reviewerName}>
                    {review.userName || `Cliente ${review.userId.slice(-4)}`}
                    <span>({review.rating} / 5)</span>
                  </p>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <span className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </li>
            ))
          ) : (
            <li className={styles.noReviews}>
              <p>Este produtor ainda não possui avaliações.</p>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default ProductReviews;
