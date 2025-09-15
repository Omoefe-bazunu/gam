import React from "react";

const serviceItems = [
  {
    title: "Business Strategy & Process Consulting",
    description: "Unlock growth through clarity and efficiency.",
    imageUrl: "/services/businessstrategy.png",
  },
  {
    title: "Digital Transformation Advisory",
    description: "Reimagine your business with future-ready solutions.",
    imageUrl: "/services/fureready.png",
  },
  {
    title: "Custom Software & Web Solutions",
    description: "Build technology that adapts to your needs.",
    imageUrl: "/services/websolutions.png",
  },
  {
    title: "IT Consulting & Advisory",
    description: "Make smarter technology investments with confidence.",
    imageUrl: "/services/consulting.png",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
          Services Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 text-secondary-blue hover:bg-primary-blue hover:text-white rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-105"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg border-3 border-white"
              />
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="mt-2 font-light font-secondary text-lg">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="/services"
            className="bg-orange-500 text-lg text-white px-6 py-3 rounded-full hover:bg-secondary-blue transition-colors"
          >
            Explore Our Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
