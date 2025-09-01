'use client';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import CartIcon from './components/CartIcon';

// ⬇️ add this import
import ProductGrid from './components/ProductGrid';

const TheBlueShrewHome = () => {
  const shirts = [
    { id: 1, name: "Shrew Crew", price: "R400", image: "/designs/shrewcrew.png" },
    { id: 2, name: "Hangdog",   price: "R400", image: "/designs/hangdog.png" },
    { id: 3, name: "Guanaco",  price: "R400", image: "/designs/lama.png"   },
    { id: 4, name: "test",  price: "R399.99", image: "/designs/test.jpg"   },
  ];

  return (
    <>
      <Head>
        <title>TheBlueShrew</title>
        <meta name="description" content="Discover premium quality shirts at TheBlueShrew." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <nav className="py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-20 h-20 relative">
                <Image src="/logo.png" alt="TheBlueShrew Logo" fill className="object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-white ml-3">TheBlueShrew</h1>
            </div>
            <CartIcon />
          </div>
        </nav>

        <section className="py-8 text-center">
          <h2 className="text-3xl font-light italic text-blue-200">Who you Blue Shrew?</h2>
        </section>

        {/* ⬇️ Use ProductGrid so users can pick a size */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center">
              <ProductGrid shirts={shirts} />
            </div>
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-3xl font-light bold text-blue-200">Orders Opening Soon :)</h2>
        </section>

        <footer className="bg-blue-950 text-blue-200 py-8 text-center">
          <p>© {new Date().getFullYear()} TheBlueShrew</p>
        </footer>
      </div>
    </>
  );
};
export default TheBlueShrewHome;
