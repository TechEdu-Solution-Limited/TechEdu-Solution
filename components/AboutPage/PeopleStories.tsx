"use client";
import StoryCarousel, { Story } from "../Stories/StoryCarousel";

const peopleStories: Story[] = [
  {
    name: "Dr. Sarah Johnson",
    country: "United States",
    image: "/assets/team-1.webp",
    review:
      "As a founding member of TechEdu Solution, I've seen our impact grow from helping a few students to transforming thousands of academic journeys. Our commitment to excellence and personalized support sets us apart.",
  },
  {
    name: "Prof. Michael Chen",
    country: "Singapore",
    image: "/assets/team-2.webp",
    review:
      "What drives me is seeing students achieve their academic dreams. Our team's dedication to providing comprehensive support and mentorship has helped countless students reach their full potential.",
  },
  {
    name: "Dr. Aisha Rahman",
    country: "United Kingdom",
    image: "/assets/team-3.webp",
    review:
      "Our approach combines academic rigor with personalized guidance. It's not just about completing a thesis or getting a scholarship – it's about empowering students to excel in their academic journey.",
  },
];

export default function PeopleStories() {
  return (
    <StoryCarousel
      stories={peopleStories}
      title="Our People"
      className="bg-gradient-to-b from-gray-50 to-white"
      autoPlayInterval={5000}
    />
  );
}
