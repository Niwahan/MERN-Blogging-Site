import { useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);

  const fetchLatestBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/latest-blogs")
      .then(({ data }) => {
        setBlogs(data.blogs);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest Blogs */}
        <div className="w-full ">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return <AnimationWrapper key={i} transition={{duration: 1, delay: i*.1}}>
                    <BlogPostCard content={blog} author={blog.author.personal_info}/>
                  </AnimationWrapper>
                })
              )}
            </>

            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* Filters and Trending Blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
