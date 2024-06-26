import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Box, Container, Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SubscriptionForm from "../components/SubscriptionForm";
import axios from "axios";
import moment from "moment";
import Loader from "../components/Loader";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch posts from the server
  const showPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/posts/show");
      setPosts(data.posts);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  // Load posts when the component mounts
  useEffect(() => {
    showPosts();
  }, []);

  return (
    <>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Navbar />
        <Container sx={{ pt: 5, pb: 5, minHeight: "83vh" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {loading ? (
                <Loader />
              ) : (
                posts.map((post, index) => (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <PostCard
                      id={post._id}
                      title={post.title}
                      prince={post.prince}
                      princess={post.princess}
                      content={post.content}
                      image={post.image ? post.image.url : ""}
                      subheader={moment(post.createdAt).format("MMMM DD, YYYY")}
                      comments={post.comments.length}
                      likes={post.likes.length}
                      likesId={post.likes}
                      showPosts={showPosts}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Container>
        <Box>
          <SubscriptionForm />
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Home;
