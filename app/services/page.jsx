"use client";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Business Strategy & Process Consulting",
    description:
      "Your business goals deserve clear, actionable strategies. We help organizations align vision with execution, improve efficiency, and design processes that support growth.",
    whatWeDo: [
      "Business audits and strategic planning",
      "Process engineering and workflow optimization",
      "Organizational change management",
      "Performance improvement strategies",
    ],
    image: "/services/businessstrategy.png",
  },
  {
    id: 2,
    title: "Digital Transformation Advisory",
    description:
      "The future is digital, and businesses that adapt thrive. We guide organizations through digital adoption — building transformation roadmaps and embedding modern practices into their operations.",
    whatWeDo: [
      "Digital readiness assessment",
      "Cloud migration planning",
      "Enterprise technology adoption",
      "Culture and change integration",
    ],
    image: "/services/digitaltransformation.png",
  },
  {
    id: 3,
    title: "Custom Software & Web Solutions",
    description:
      "We design and build solutions that scale with you — from ERP systems to bespoke software and world-class websites. Our focus is on functionality, security, and adaptability.",
    whatWeDo: [
      "Bespoke software development",
      "ERP and database systems",
      "Website and web application design",
      "Systems integration and automation",
    ],
    image: "/services/websolutions.png",
  },
  {
    id: 4,
    title: "IT Consulting & Technology Advisory",
    description:
      "Technology investments must deliver value. Our IT consulting services ensure you choose and implement the right solutions for today and tomorrow.",
    whatWeDo: [
      "IT infrastructure planning",
      "Cybersecurity frameworks",
      "Cloud and hybrid IT strategies",
      "Vendor and solution evaluation",
    ],
    image: "/services/consulting.png",
  },
];

const pricingPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: "$49",
    period: "/month",
    features: [
      "Advanced Analytics",
      "Unlimited Projects",
      "Priority Support",
      "Customizable Branding",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    id: 2,
    name: "Standard Plan",
    price: "$79",
    period: "/month",
    features: [
      "Advanced Analytics",
      "Unlimited Projects",
      "Priority Support",
      "Customizable Branding",
      "All API Access",
    ],
    buttonText: "Get Started",
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: "$99",
    period: "/month",
    features: [
      "Advanced Analytics",
      "Unlimited Projects",
      "Priority Support",
      "Customizable Branding",
      "All API Access",
    ],
    buttonText: "Get Started",
    popular: false,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="flex flex-col items-center bg-white pt-20"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <motion.h2
          className="text-4xl font-bold text-secondary-blue text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Services
        </motion.h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          We deliver comprehensive consulting solutions to drive your business
          forward.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="service-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: service.id * 0.2 }}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-secondary-blue mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-secondary">
                {service.description}
              </p>
              <ul className="space-y-2 mb-4">
                {service.whatWeDo.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Pricing Section */}
      <div className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <motion.h2
            className="text-4xl font-bold text-secondary-blue text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Our Best Pricing
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`pricing-card bg-white rounded-xl shadow-lg p-6 text-center relative overflow-hidden border border-gray-100 ${
                  plan.popular
                    ? "border-primary-blue ring-2 ring-accent-blue"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: plan.id * 0.2 }}
              >
                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-secondary-blue mb-4">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-secondary-blue mb-2">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-600 mb-6">{plan.period}</div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-center justify-center"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
