export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
}

const blogImg = "/landing/assets/blog-img.png";
const authorImg = "/landing/assets/author-img.png";

export const blogsData: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-renew-mexican-passport-in-chicago",
    title: "How To Renew Mexican Passport In Chicago",
    excerpt:
      "Renewing your Mexican passport in Chicago is a simple process, especially if your old one has expired or will expire soon. Here's a full breakdown of eligibility, documents, and where to go.",
    featured_image: blogImg,
    author: {
      name: "John Doe",
      avatar: authorImg,
    },
    date: "December 4, 2024",
    content: `
      <h2>Eligibility Requirements</h2>
      <p>To renew your Mexican passport in Chicago, you must meet the following conditions:</p>
      <ul>
        <li>You are a Mexican citizen.</li>
        <li>Your passport is expired or will expire within six months.</li>
        <li>You can provide original and photocopy identification documents.</li>
      </ul>

      <h2>Required Documents</h2>
      <ul>
        <li>Completed passport renewal form.</li>
        <li>Two recent passport-sized photos.</li>
        <li>Proof of payment for renewal fee.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <p><strong>Where can I renew my Mexican passport in Chicago?</strong>
      You can renew at the Consulate General of Mexico located in downtown Chicago.</p>

      <p><strong>How long does processing take?</strong>
      Processing times vary between 1–3 weeks depending on demand and appointment availability.</p>

      <p><strong>Can I expedite the process?</strong>
      Yes, some services offer expedited options for an additional fee.</p>
    `,
  },
  {
    id: 2,
    slug: "how-to-get-us-passport-renewed-fast",
    title: "How To Get Your US Passport Renewed Fast",
    excerpt:
      "Need your passport in a hurry? Here’s how to renew it quickly, including expedited options and required documentation.",
    featured_image: blogImg,
    author: {
      name: "Sarah Lee",
      avatar: authorImg,
    },
    date: "November 12, 2024",
    content: `
      <h2>Step-by-Step Renewal Process</h2>
      <ol>
        <li>Complete the DS-82 form.</li>
        <li>Attach your most recent passport and new photos.</li>
        <li>Mail it or bring it to an expedited passport agency.</li>
      </ol>

      <h2>Tips for Faster Processing</h2>
      <ul>
        <li>Use overnight shipping both ways.</li>
        <li>Double-check your application before submission.</li>
        <li>Book an appointment early if visiting an office.</li>
      </ul>
    `,
  },
  {
    id: 3,
    slug: "visa-photos-guidelines",
    title: "Visa Photo Requirements: Avoid Common Mistakes",
    excerpt:
      "Your visa photo can make or break your application — here’s how to ensure it meets all official standards.",
    featured_image: blogImg,
    author: {
      name: "Michael Chen",
      avatar: authorImg,
    },
    date: "October 10, 2024",
    content: `
      <h2>Key Requirements</h2>
      <ul>
        <li>White background only.</li>
        <li>No shadows or filters.</li>
        <li>Face must be fully visible.</li>
      </ul>

      <h2>Pro Tip</h2>
      <p>Always take your photo at a professional studio that specializes in passport or visa photography.</p>
    `,
  },
];
