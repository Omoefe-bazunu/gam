import React from "react";
import HeroSection from "../hero/Hero";
import ServicesSection from "../services/Services";
import StatsSection from "../stats/Stats";
import Casestories from "../case-stories/CaseStories";
import WhyChooseUs from "../whychooseus/Why-choose-us";
import GlobalPartners from "../global-partners/Global-Partners";
import Newsletter from "../newsletters/Newsletters";
import LatestBlogUpdates from "../latest-blogs/Latest-blogs";

function Homepage() {
  return (
    <div className="font-primary text-white pt-6 bg-primary-blue font-white font-bold text-5xl">
      <HeroSection />
      <ServicesSection />
      <Casestories />
      <StatsSection />
      <WhyChooseUs />
      <GlobalPartners />
      <Newsletter />
      <LatestBlogUpdates />
    </div>
  );
}

export default Homepage;
