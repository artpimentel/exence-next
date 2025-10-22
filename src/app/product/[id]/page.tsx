"use client";

import * as React from "react";
import { useEffect } from "react";

import type { Producer } from "@/types/Producer";
import allProducers from "@/data/producers";

import Slider from "@/components/Slider/Slider";
import ProductInfo from "@/components/ProductInfo/ProductInfo";
import ProductServices from "@/components/ProductServices/ProductServices";
import ProductValues from "@/components/ProductValues/ProductValues";
import ProductLocation from "@/components/ProductLocation/ProductLocation";
import ProductReviews from "@/components/ProductReviews/ProductReviews";

import styles from "./page.module.css";
import { IoSchool } from "react-icons/io5";
import { FaClock, FaHandshake } from "react-icons/fa6";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params);

  const producer: Producer | undefined = allProducers.find(
    (p) => p.id.toString() === id
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    const targetId = hash.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  if (!producer) {
    return <p>Produto não encontrado</p>;
  }

  const slides = producer.profile.images.map((src, index) => ({
    id: index,
    src,
    alt: `${producer.profile.name} - imagem ${index + 1}`,
  }));

  return (
    <div className={styles.productPage}>
      <section className={styles.productShowcase}>
        <div className={styles.layout}>
          <Slider slides={slides} className={styles.productSlider} />
          <ProductInfo producer={producer} />
        </div>
      </section>

      <section className={styles.producerHistory}>
        <h2>Sobre Mim</h2>
        <p>&quot;{producer.profile.description}&quot;</p>

        <div className={styles.topics}>
          <div className={styles.topic}>
            <span className={styles.icon}>
              <IoSchool />
            </span>
            {producer.profile.scholarity.level}
          </div>
          <div className={styles.topic}>
            <span className={styles.icon}>
              <FaHandshake />
            </span>
          </div>
          <div className={styles.topic}>
            <span className={styles.icon}>
              <FaClock />
            </span>
          </div>
        </div>
      </section>

      <ProductServices producer={producer} />
      <ProductValues producer={producer} />
      <ProductLocation producer={producer} />
      <ProductReviews producer={producer} />
    </div>
  );
}
