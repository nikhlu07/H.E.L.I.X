import { Testimonials } from "@/components/ui/testimonials"

const testimonials = [
  {
    text: "This is awesome, Nikhil!🔥 The idea behind H.E.L.I.X. is next-level — proud of you, man. All the best for the final round! 🙌",
    name: 'Vaibhav Pant',
    username: '@vaibhavpant',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "This is crazy! striking the bolt that holds the machine of capitalism together! 🔩 Kudos to the team, more power to you!",
    name: 'Aditya Lakhani',
    username: '@adityalakhani',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: "🌟 Congratulations Nikhil and team! This is an incredible initiative — using AI and blockchain for transparency and fraud prevention in public procurement is truly impactful. 👏 Wishing you all the best for the final round of the WCHL Hackathon. Keep innovating and driving positive change! 💪",
    name: 'Arvind Khoda',
    username: '@arvindkhoda',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'Deployment was fast, and the immutable audit trail saved weeks during compliance reviews.',
    name: 'David Smith',
    username: '@davidsmith',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'Implementing this component library was a game-changer for our team. It has elevated our product\'s UI to a whole new level!',
    name: 'Sophia Lee',
    username: '@sophialee',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    text: 'H.E.L.I.X. made our procurement pipeline transparent overnight. We finally see where funds go and why.',
    name: 'Alice Johnson',
    username: '@alicejohnson',
    social: 'https://i.imgur.com/VRtqhGC.png'
  }
];

export function TestimonialsDemo() {
  return (
    <div className="w-screen py-20 mb-10">
      <Testimonials testimonials={testimonials} />
    </div>
  )
}
