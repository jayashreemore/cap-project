import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
//import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { toast } from "react-toastify";
import CommentList from "../components/CommentList";

const SinglePost = () => {
  const { userInfo } = useSelector((state) => state.signIn);

  const [title, setTitle] = useState("");
  const [prince, setPrince] = useState("");
  const [princess, setPrincess] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const { id } = useParams();
  //fetch single post
  const displaySinglePost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/post/${id}`);
      setTitle(data.posts.title);
      setPrince(data.posts.prince);
      setPrincess(data.posts.princess);
      setContent(data.posts.content);
      setImage(data.posts.image.url);
      setCreatedAt(data.posts.createdAt);
      setLoading(false);
      setComments(data.posts.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    displaySinglePost();
    // eslint-disable-next-line
  }, []);

  // add comment
  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/comment/post/${id}`, { comment });
      if (data.success === true) {
        setComment("");
        toast.success("comment added");
        displaySinglePost(); // Refresh comments after adding a new one
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          bgcolor: "#fafafa",
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
          minHeight: "100vh",
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <Card sx={{ maxWidth: 1000, height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                title={title}
                prince={prince}
                princess={princess}
                subheader={moment(createdAt).format("MMMM DD, YYYY")}
              />
              <CardMedia
                component="img"
                height="194"
                image={image}
                alt={title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <Box
                    component="span"
                    dangerouslySetInnerHTML={{ __html: content }}
                  ></Box>
                </Typography>
                <Divider variant="inset" />
                {/* add coment list */}
                {comments.length === 0 ? (
                  ""
                ) : (
                  <Typography variant="h5" sx={{ pt: 3, mb: 2 }}>
                    Comments:
                  </Typography>
                )}

                {comments.map((comment) => (
                  <CommentList
                    key={comment._id}
                    name={comment.postedBy.name}
                    text={comment.text}
                  />
                ))}

                {userInfo ? (
                  <>
                    <Box sx={{ pt: 1, pl: 3, pb: 3, bgcolor: "#fafafa" }}>
                      <h2>Add your comment here!</h2>
                      <form onSubmit={addComment}>
                        <TextareaAutosize
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}
                          aria-label="minimum height"
                          minRows={3}
                          placeholder="Add a comment..."
                          style={{ width: 500, padding: "5px" }}
                        />
                        <Box sx={{ pt: 1 }}>
                          <Button type="submit" variant="contained">
                            Comment
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </>
                ) : (
                  <>
                    <Link to="/login"> Log In to add a comment</Link>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default SinglePost;
