import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

export default function LatestBlogUpdates() {
  const blogs = [
    {
      id: 1,
      title: "How to find a design job you truly love",
      author: "Admin",
      comments: 0,
      image: "/services/consulting.png",
    },
    {
      id: 2,
      title: "Tips for effective teamwork in design projects",
      author: "Admin",
      comments: 2,
      image: "/services/fureready.png",
    },
    {
      id: 3,
      title: "Present win-win survival strategies",
      author: "Admin",
      comments: 3,
      image: "/services/businessstrategy.png",
    },
  ];

  return (
    <section className="latest-blog py-16 bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 text-secondary-blue">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10">
          <h2 className="text-3xl font-bold text-center lg:text-left">
            Read Our Latest Updates
          </h2>
          <a
            href="/blog"
            className="bg-orange-500 text-lg w-fit flex gap-2 items-center mx-auto lg:mx-0 justify-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors mt-4 lg:mt-0"
          >
            <p>View All Posts</p>
            <MdArrowOutward />
          </a>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:space-x-6">
          {/* First Blog Card (Large Left) */}
          <div className="flex-[2]">
            <div className="rounded-lg shadow-md overflow-hidden h-full">
              <Image
                src={blogs[0].image}
                alt={blogs[0].title}
                width={600}
                height={400}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[0].author} • {blogs[0].comments} Comment
                </p>
                <h3 className="text-lg lg:text-2xl max-w-xl lg:max-w-none font-semibold mt-2">
                  {blogs[0].title}
                </h3>
                <Link
                  href={`/blog/${blogs[0].id}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side (Two Smaller Cards) */}
          <div className="flex-[1.2] flex flex-col space-y-6 mt-6 lg:mt-0">
            {/* Second Blog Card */}
            <div className="rounded-lg shadow-md overflow-hidden">
              <Image
                src={blogs[1].image}
                alt={blogs[1].title}
                width={400}
                height={250}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[1].author} • {blogs[1].comments} Comment
                </p>
                <h3 className="text-lg font-semibold mt-2">{blogs[1].title}</h3>
                <Link
                  href={`/blog/${blogs[1].id}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit mt-4 gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Third Blog Card */}
            <div className="rounded-lg shadow-md overflow-hidden">
              <Image
                src={blogs[2].image}
                alt={blogs[2].title}
                width={400}
                height={250}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 font-secondary">
                  {blogs[2].author} • {blogs[2].comments} Comment
                </p>
                <h3 className="text-lg font-semibold mt-2">{blogs[2].title}</h3>
                <Link
                  href={`/blog/${blogs[2].id}`}
                  className="bg-orange-500 my-4 flex text-lg w-fit mt-4 gap-2 items-center rounded-full text-white px-4 py-2 hover:bg-[#00042f] transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
