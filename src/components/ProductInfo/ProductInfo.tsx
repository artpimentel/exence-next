"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./ProductInfo.module.css";

import { IoEyeOutline } from "react-icons/io5";
import { TbCoinFilled } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";
import { TbHomeCheck, TbHomeX } from "react-icons/tb";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { FaWhatsapp, FaInstagram, FaTelegram } from "react-icons/fa6";

import type { Producer } from "../../types/Producer";
import ScrollTo from "@/utils/ScrollTo";

interface ProductInfosProps {
  producer: Producer;
}

function ProductInfo({ producer }: ProductInfosProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const halfway = el.clientHeight / 2;
      setAtBottom(el.scrollTop > halfway);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSeeMore = () => {
    const el = contentRef.current;
    if (!el) return;

    if (atBottom) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollTo({ top: el.clientHeight - 44, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.productInfos}>
      <div className={styles.contactsOptions}>
        <div className={styles.contactsLayout}>
          {producer.contact.phone && (
            <a
              href={`https://wa.me/${producer.contact.phone}`}
              className={`${styles.contactButton} ${styles.whatsapp}`}
            >
              <FaWhatsapp />
            </a>
          )}
          {producer.contact.telegram && (
            <a
              href={`https://t.me/${producer.contact.telegram}`}
              className={`${styles.contactButton} ${styles.telegram}`}
            >
              <FaTelegram />{" "}
            </a>
          )}
          {producer.contact.instagram && (
            <a
              href={`https://www.instagram.com/${producer.contact.instagram}`}
              className={`${styles.contactButton} ${styles.instagram}`}
            >
              <FaInstagram />
            </a>
          )}
        </div>
      </div>

      <div className={styles.content} ref={contentRef}>
        <div className={styles.infoContent}>
          <div className={styles.productHeader}>
            <div className={styles.productHighlight}>
              <h1 className={styles.productName}>{producer.profile.name}</h1>
              <p className={styles.productSlogan}>
                "{producer.profile.slogan}"
              </p>
            </div>
            <button className={styles.favoriteButton}>
              <IoEyeOutline />
            </button>
          </div>

          <button
            className={styles.infoCard}
            onClick={() => ScrollTo("reviews", { center: true })}
          >
            <div className={styles.cardHeader}>
              <h2>
                <span>
                  <FaHeart />
                </span>
                {producer.metadata.rating
                  ? producer.metadata.rating.toFixed(1)
                  : "N/D"}
              </h2>
              <IoIosArrowDown />
            </div>
            <div className={styles.cardContent}>
              {producer.reviews?.length} Avaliações
            </div>
          </button>
          <button
            className={styles.infoCard}
            onClick={() => ScrollTo("values", { center: true })}
          >
            <div className={styles.cardHeader}>
              <h2>
                <span>
                  <TbCoinFilled />
                </span>
                Valores
              </h2>
              <IoIosArrowDown />
            </div>
            <div className={styles.cardContent}>
              A partir de:
              <span>
                {producer.prices?.[0]
                  ? `R$ ${producer.prices[0].price} - ${producer.prices[0].duration}`
                  : "Consultar"}
              </span>
            </div>
          </button>
          <button
            className={styles.infoCard}
            onClick={() => ScrollTo("location", { center: true })}
          >
            <div className={styles.cardHeader}>
              <h2>
                <span>
                  <HiLocationMarker />
                </span>
                Localização
              </h2>
              <IoIosArrowDown />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.neighborhood}>
                {producer.locality.neighborhood}
              </h3>
              <span className={styles.localExtra}>
                {producer.locality.city} - {producer.locality.state}
              </span>
              <span className={styles.hasLocal}>
                {producer.locality.hasLocal ? (
                  <>
                    <span>
                      <TbHomeCheck />
                    </span>
                    com local
                  </>
                ) : (
                  <>
                    <span>
                      <TbHomeX />
                    </span>
                    sem local
                  </>
                )}
              </span>
            </div>
          </button>

          <button className={styles.seeMoreButton} onClick={handleSeeMore}>
            {atBottom ? (
              <>
                <IoIosArrowUp /> Voltar ao topo
              </>
            ) : (
              <>
                <IoIosArrowDown /> Veja mais
              </>
            )}
          </button>
        </div>

        <div className={styles.productSpecifies}>
          <ul className={styles.specifiesList}>
            {Object.entries(producer.appearance).map(([key, value]) => (
              <li key={key} className={styles.specify}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
          <div className={styles.extraContent}>
            <a href=""></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
