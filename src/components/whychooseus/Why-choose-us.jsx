import { MdArrowOutward } from "react-icons/md";

const ProjectCard = ({ image, mainText, subText }) => (
  <div className="w-full p-4 border rounded-lg shadow-md text-primary-blue hover:scale-105 text-center bg-gray-100 hover:shadow-xl transition-shadow duration-300 ease-in-out hover:text-white hover:bg-primary-blue sm:w-1/4">
    <img
      src={image}
      alt={mainText}
      className="w-full h-64 object-cover rounded-lg"
    />
    <h3 className="mt-2 text-lg font-bold font-primar">{mainText}</h3>
    <p className="text-sm font-secondary font-light">{subText}</p>
  </div>
);

const WhyChooseUs = () => {
  const projects = [
    {
      image: "/services/businessstrategy.png",
      mainText: "Global Perspective",
      subText: "U.S. incorporated, serving businesses worldwide.",
    },
    {
      image: "/services/consulting.png",
      mainText: "Innovation-Driven",
      subText: "We craft solutions tailored to your unique needs.",
    },
    {
      image: "/services/fureready.png",
      mainText: "Trusted by Businesses",
      subText: "Proven expertise across industries.",
    },
    {
      image: "/services/websolutions.png",
      mainText: "Partnership Approach",
      subText: "We don’t just consult — we collaborate.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <h2 className="text-3xl font-bold text-secondary-blue text-center mb-12">
          Why Choose Us
        </h2>
        <div className="flex flex-col sm:flex-row justify-center mt-4 space-y-4 sm:space-x-4 sm:space-y-0">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
        <p className="text-center font-light text-sm sm:text-lg text-primary-blue font-primary my-8 max-w-xl mx-auto">
          Join hundreds of businesses who trusts us to help pivot innovate and
          grow their business
        </p>
        <div className="text-center">
          <a
            href="/contact"
            className="bg-orange-500 flex w-fit text-lg mx-auto gap-2 items-center justify-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors mt-2"
          >
            <p>Get Started</p>
            <MdArrowOutward />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
