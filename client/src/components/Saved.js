import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';

// Truncated text component
const TruncatedText = ({ text, limit = 40 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return "No Title";
  const isTruncated = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

  return (
    <>
      {displayText}
      {isTruncated && (
        <span
          style={{
            color: "rgba(0,0,0,0.6)",
            cursor: "pointer",
            marginLeft: "6px",
            fontSize: "0.85rem",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Show less" : "..."}
        </span>
      )}
    </>
  );
};

function Saved() {
  const [savedTopics, setSavedTopics] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch saved topics
  useEffect(() => {
    const fetchSavedTopics = async () => {
      try {
        const res = await API.get("/topics/saved", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSavedTopics(res.data.filter(Boolean));
      } catch (err) {
        console.error("Error fetching saved topics:", err);
      }
    };

    fetchSavedTopics();
  }, []);

  // Like/unlike
  const handleLike = async (topicId) => {
    try {
      const res = await API.put(`/topics/${topicId}/like`);
      setSavedTopics((prev) =>
        prev.map((t) =>
          t && t._id === topicId
            ? { ...t, likesCount: res.data.likesCount, liked: res.data.liked }
            : t
        )
      );
      setSnackbarMessage(res.data.liked ? "Liked!" : "Unliked!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error liking topic:", err);
    }
  };

  // Save/unsave (remove from list if unsaved)
  const handleSave = async (topicId) => {
    try {
      const res = await API.put(`/topics/${topicId}/save`);
      if (!res.data.saved) {
        // if unsaved → remove from list
        setSavedTopics((prev) => prev.filter((t) => t._id !== topicId));
      } else {
        // otherwise update count
        setSavedTopics((prev) =>
          prev.map((t) =>
            t && t._id === topicId
              ? { ...t, savesCount: res.data.savesCount, saved: res.data.saved }
              : t
          )
        );
      }
      setSnackbarMessage(res.data.saved ? "Saved!" : "Removed from saved!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error saving topic:", err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, minHeight: "100vh" }}>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
      >
        <BookmarkAddedOutlinedIcon fontSize="medium" />
        Saved Topics
      </Typography>


      <Grid container spacing={4} justifyContent="flex-start">
        {savedTopics.length > 0 ? (
          savedTopics.map(
            (topic) =>
              topic && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={topic._id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      minHeight: 180,
                      width: 325,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3,
                      boxShadow: 4,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 10, transform: "translateY(-5px)" },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        overflow: "hidden",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        <TruncatedText text={topic.title || "No Title"} limit={30} />
                      </Typography>

                      <Box display="flex" mb={1} color="text.secondary">
                        <Typography variant="body2">
                          Created At:{" "}
                          {new Date(topic.createdAt || Date.now()).toLocaleDateString(
                            "en-GB"
                          )}
                        </Typography>
                      </Box>

                      <Box display="flex" color="text.secondary">
                        <Typography variant="body2">
                          Created By:{" "}
                          {topic.userId
                            ? `${topic.userId.firstName} ${topic.userId.lastName}`
                            : "Unknown"}
                        </Typography>
                      </Box>

                      <Box display="flex" mt={1} color="text.secondary">
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          Likes: {topic.likesCount || 0}
                        </Typography>
                        <Typography variant="body2">
                          Saves: {topic.savesCount || 0}
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, justifyContent: "space-between" }}>
                      <Box>
                        <Checkbox
                          checked={topic.liked}
                          onChange={() => handleLike(topic._id)}
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite color="error" />}
                          sx={{ mr: 1 }}
                        />
                        <Checkbox
                          checked={topic.saved}
                          onChange={() => handleSave(topic._id)}
                          icon={<BookmarkBorderIcon />}
                          checkedIcon={<BookmarkIcon color="primary" />}
                        />
                      </Box>

                      <Link
                        to={`/public/topics/${topic._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            backgroundColor: "#3d314a",
                            color: "#e0ddcf",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#483b56ff" },
                          }}
                        >
                          View
                        </Typography>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              )
          )
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 4, mx: "auto", fontStyle: "italic" }}
          >
            No saved topics found!
          </Typography>
        )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Saved;
