export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp Inc.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote:
      "Mahdi delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise made the entire process smooth and efficient.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Startup Founder",
    company: "InnovateLab",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote:
      "Working with Mahdi was a game-changer for our startup. He built our entire web application from scratch and helped us launch successfully. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Digital Solutions",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote:
      "The React dashboard Mahdi created for us is incredibly user-friendly and performant. Our team productivity has increased significantly since implementation.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "CTO",
    company: "CloudTech Systems",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote:
      "Mahdi's full-stack development skills are outstanding. He delivered a complex project on time and within budget. Great communication throughout the process.",
    rating: 5,
  },
];

export const getTestimonialById = (id) => {
  return (
    testimonials.find((testimonial) => testimonial.id === parseInt(id)) || null
  );
};
