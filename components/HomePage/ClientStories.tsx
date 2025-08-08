"use client";
import StoryCarousel, { Story } from "../Stories/StoryCarousel";

const clientStories: Story[] = [
  {
    name: "Emillie Jonas",
    country: "England",
    image: "/assets/graduant.webp",
    review:
      "EduTech Solutions is an ideal location for anybody who wants to learn something new or share what they know with others. EduTech Solutions is a worldwide platform for online learning that helps to connect with one another via knowledge. It comes highly recommended from my side.",
  },
  {
    name: "Chinedu Uzo",
    country: "UK",
    image: "/assets/graduant.webp",
    review:
      "Thanks to EduTech Solutions, I was able to land a remote internship in Germany while still studying in London. Their platform is incredibly supportive and makes learning fun and practical.",
  },
  {
    name: "Fatima Khalid",
    country: "UAE",
    image: "/assets/student-1.webp",
    review:
      "What makes EduTech Solutions stand out is the real-world relevance of the training. It's not just theory — it's mentorship, tools, and support. I've grown both professionally and personally.",
  },
];

export default function ClientStories() {
  return (
    <StoryCarousel
      stories={clientStories}
      title="Client Stories"
      className="bg-gradient-to-b from-white to-gray-50"
    />
  );
}
