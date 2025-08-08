"use client";
import StoryCarousel, { Story } from "../Stories/StoryCarousel";

const successStories: Story[] = [
  {
    name: "David Kim",
    country: "South Korea",
    image: "/assets/David.webp",
    review:
      "With TechEdu Solution's guidance, I successfully defended my PhD thesis and secured a postdoctoral position at a leading research institution. Their mentorship was invaluable throughout my journey.",
  },
  {
    name: "Maria Rodriguez",
    country: "Spain",
    image: "/assets/Maria.webp",
    review:
      "The scholarship coaching program helped me win a full scholarship to study in Germany. The personalized feedback and strategic approach made all the difference in my application.",
  },
  {
    name: "James Okafor",
    country: "UK",
    image: "/assets/Okafor.webp",
    review:
      "From thesis proposal to final defense, the team provided comprehensive support. Their expertise in research methodology and academic writing significantly improved my work.",
  },
];

export default function StudentSuccessStories() {
  return (
    <StoryCarousel
      stories={successStories}
      title="Student Success Stories"
      className="bg-gradient-to-b from-white to-blue-50"
      autoPlayInterval={4500}
    />
  );
}
