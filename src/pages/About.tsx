import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/footer';
import { Menu, X } from 'lucide-react';
import Topbar from '../components/Topbar';

const AboutUs = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .team-image {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .team-image:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .btn-hover-effect {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .btn-hover-effect:hover {
          transform: translateY(-2px);
        }

        .header-btn:hover {
          color: #EF4444; /* red-500 */
        }
      `}</style>
      <div className="bg-white">
        <Topbar />
        <main className="container mx-auto mt-8 px-8">
          {/* Hero Section */}
          <section className="relative text-white py-20 px-12 rounded-lg overflow-hidden">
            <img
              src="https://media.istockphoto.com/id/2166687011/photo/cheerful-cute-afro-man-choosing-literature-to-read.jpg?s=612x612&w=0&k=20&c=tvI6fC3rKpceFdCo27lliN-Lubh5yeJ1YwczCxKho0Y="
              alt="BritBooks Hero"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div className="relative z-10 animate-on-scroll">
              <h1 className="text-5xl font-bold leading-tight">
                BritBooks: Your Trusted Source for Pre-Loved Books
              </h1>
              <p className="text-gray-300 mt-4 max-w-2xl">
                Giving used books new life is what we do best. Discover our story, our passion for sustainability, and why BritBooks is the UK’s leading platform for second-hand books.
              </p>
              <Link
                to="/category"
                className="mt-6 inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md font-semibold btn-hover-effect"
              >
                Explore Our Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="mt-12 py-12 bg-gray-50 rounded-lg px-8">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-700 mt-4 leading-relaxed max-w-2xl">
                Founded in 2014, BritBooks began with a simple mission: to keep books out of landfills and in the hands of readers. From a small warehouse in Milton Keynes, we’ve grown into the UK’s premier destination for second-hand books, offering over 2 million titles across genres like fiction, non-fiction, biographies, and rare editions. Our journey is rooted in a love for literature and a commitment to sustainability.
              </p>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold">Our Journey</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <div className="text-red-600 font-bold text-xl mr-4">2014</div>
                    <p className="text-gray-600">BritBooks launches in Milton Keynes, starting with a small collection of used books.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-600 font-bold text-xl mr-4">2018</div>
                    <p className="text-gray-600">Expanded to over 1 million books, partnering with Amazon and other marketplaces.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-600 font-bold text-xl mr-4">2025</div>
                    <p className="text-gray-600">Now a leader in sustainable reading, diverting millions of books from landfills.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team Section */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="text-gray-700 mt-4 leading-relaxed">
                Our passionate team of book lovers and sustainability advocates works tirelessly to curate quality pre-owned books and deliver exceptional service.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <img
                    src="https://media.istockphoto.com/id/2209717984/photo/mature-portrait-and-businessman-with-documents-at-convention-for-corporate-preparation-or.jpg?s=612x612&w=0&k=20&c=0_b6VYUhCmfavawqh1LTod8_iB4h4P6lhfpW-Xqepx4="
                    alt="Team Member 1"
                    className="rounded-lg h-40 w-full object-cover team-image"
                  />
                  <p className="text-sm mt-2 font-semibold">Jane Doe</p>
                  <p className="text-xs text-gray-500">Founder & CEO</p>
                </div>
                <div>
                  <img
                    src="https://media.istockphoto.com/id/506897518/photo/smiling-male-bookseller-holding-books-in-library.jpg?s=612x612&w=0&k=20&c=ipm_-7nf66msI8s4VnKe4LZeQZ-W3flf0TPZoPkY0y0="
                    alt="Team Member 2"
                    className="rounded-lg h-40 w-full object-cover team-image"
                  />
                  <p className="text-sm mt-2 font-semibold">John Smith</p>
                  <p className="text-xs text-gray-500">Head of Operations</p>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
              <p className="text-gray-700 mt-4 leading-relaxed">
                At BritBooks, we believe in:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">•</span> Sustainability: Diverting books from landfills to promote a circular economy.
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">•</span> Quality: Hand-selecting books to ensure they meet our high standards.
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">•</span> Community: Supporting literacy and connecting book lovers across the UK.
                </li>
              </ul>
              <img
                src="https://media.istockphoto.com/id/1178595473/photo/a-pile-of-books.jpg?s=612x612&w=0&k=20&c=uTmIOHBTM6pFxVdJbk5eaL4Nt345Vl_oySYd8_BezCs="
                alt="Sustainable Books"
                className="mt-6 rounded-lg h-48 w-full object-cover team-image"
              />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mt-12 py-12 bg-gray-50 rounded-lg px-8">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold text-gray-900">What Our Readers Say</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700 italic">
                    "BritBooks delivered a rare edition in perfect condition! Their commitment to quality is unmatched."
                  </p>
                  <p className="text-gray-500 text-sm mt-4">— Sarah L., London</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700 italic">
                    "Fast delivery and eco-friendly packaging. I love supporting a business that cares about the planet!"
                  </p>
                  <p className="text-gray-500 text-sm mt-4">— James T., Manchester</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700 italic">
                    "The selection is incredible, and the prices are unbeatable. My go-to for second-hand books!"
                  </p>
                  <p className="text-gray-500 text-sm mt-4">— Emily R., Bristol</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 py-12 bg-red-500 text-white rounded-lg px-8 text-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold">Join the BritBooks Community</h2>
              <p className="text-gray-200 mt-4 max-w-2xl mx-auto">
                Discover thousands of pre-loved books, support sustainability, and become part of a community that celebrates reading.
              </p>
              <Link
                to="/signup"
                className="mt-6 inline-flex items-center gap-2 bg-white text-red-500 px-6 py-2 rounded-md font-semibold btn-hover-effect"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutUs;