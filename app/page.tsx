import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

const TheBlueShrewHome = () => {
  // Shirt data with image paths
  const shirts = [
    {
      id: 1,
      name: "Shrew Crew",
      price: "R400",
      image: "/designs/shrewcrew.png" // Path to your image in public/designs folder
    },
    {
      id: 2,
      name: "Hangdog",
      price: "R400",
      image: "/designs/hangdog.png" // Path to your image in public/designs folder
    },
    {
      id: 3,
      name: "Quanacho",
      price: "R400",
      image: "/designs/lama.png" // Path to your image in public/designs folder
    },
  ];

  return (
    <>
      <Head>
        <title>TheBlueShrew</title>
        <meta name="description" content="Discover premium quality shirts at TheBlueShrew. Perfect fit, exceptional comfort, and timeless style." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        {/* Navigation */}
        <nav className="py-4">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex items-center">
              <div className="w-20 h-20 relative">
                <Image
                  src="/logo.png" // Path to your logo in public/images folder
                  alt="TheBlueShrew Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white ml-3">TheBlueShrew</h1>
            </div>
          </div>
        </nav>

        {/* Brand Slogan */}
        <section className="py-8 text-center">
          <h2 className="text-3xl font-light italic text-blue-200">
            Who you Blue Shrew?
          </h2>
        </section>

        {/* Shirt Display */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {shirts.map((shirt) => (
                  <div key={shirt.id} className="text-center bg-blue-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                    <div className="h-80 relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={shirt.image}
                        alt={shirt.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{shirt.name}</h3>
                    <p className="text-blue-300">{shirt.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>




        {/* Order Button */}
         {/* <section className="py-12 text-center">
          <a 
            href="https://forms.gle/1gausKVBXAyJVxD56" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition duration-300 inline-block"
          >
            Orders Opening Soon
          </a>
        </section>  */}

        {/* Brand Slogan */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-light bold text-blue-200">
            Orders Opening Soon :)
          </h2>
        </section>

        {/* Footer */}
        <footer className="bg-blue-950 text-blue-200 py-8 text-center">
          <p>© {new Date().getFullYear()} TheBlueShrew</p>
        </footer>
      </div>
    </>
  );
};

export default TheBlueShrewHome;
