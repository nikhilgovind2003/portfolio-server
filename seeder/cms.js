const { Cms } = require("../models");

const seedCmsData = async () => {
  const count = await Cms.countDocuments();
  if (count === 0) {
    // Only seed if table is empty
    await Cms.create(
      {
        super_title: "Welcome to Our Site",
        title: "Explore Our Features",
        description:
          "Discover the amazing features we provide to help you succeed.",
        btn_one_text: "Learn More",
        btn_one_link: "https://example.com/learn-more",
        btn_two_text: "Get Started",
        resume: "https://example.com/get-started",
        media_path: "/images/banner.jpg",
        media_alt: "Banner Image",
        project_title: "Our Projects",
        skills_title: "Our Skills",
        about_title: "About Us",
        about_description:
          "We are committed to delivering quality software solutions.",
        contact_title: "Contact Us",
      }
    );
    console.log("Seed data for CMS table inserted successfully.");
  }
};

module.exports = seedCmsData;
