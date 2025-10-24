"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./BlogSection.module.css";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Como otimizar o SEO do seu site",
    excerpt:
      "Aprenda as principais técnicas para melhorar o ranqueamento do seu site no Google.",
    image: "/images/seo.jpg",
    slug: "otimizar-seo-site",
  },
  {
    id: 2,
    title: "Tendências de design para 2025",
    excerpt:
      "Descubra o que há de novo no mundo do design e como aplicar no seu projeto.",
    image: "/images/design2025.jpg",
    slug: "tendencias-design-2025",
  },
  {
    id: 3,
    title: "Introdução ao Next.js para iniciantes",
    excerpt: "Uma visão geral sobre o framework mais moderno para React.",
    image: "/images/nextjs.jpg",
    slug: "introducao-nextjs",
  },
];

export default function BlogSection() {
  return (
    <section className={styles.blogSection}>
      <h2 className={styles.title}>Últimos Artigos</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.card}>
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={250}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                Ler mais →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
