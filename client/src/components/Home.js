import React from "react";
import API from "../api";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";

// ✅ helper component for truncating subject name with show more/less
const TruncatedText = ({ text, limit = 25 }) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!text) return "No Name";

  const isTruncated = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

  return (
    <>
      {displayText}
      {isTruncated && (
        <span
          style={{
            color: "rgba(0,0,0,0.6)", // muted color
            cursor: "pointer",
            marginLeft: "6px",
            fontSize: "0.85rem",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Show more"}
        </span>
      )}
    </>
  );
};

const Home = () => {
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectDescription, setSubjectDescription] = React.useState("");
  const [items, setItems] = React.useState([]);

  // Fetch existing subjects from backend
  const fetchSubjects = async () => {
    try {
      const res = await API.get("/api/subjects");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("You are not authorized. Please log in.");
      }
    }
  };

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  // Add a new subject
  const handleAddSubject = async () => {
    if (!subjectName || !subjectDescription) return;

    const newSubject = {
      subjectName,
      subjectContent: subjectDescription,
    };

    try {
      const res = await API.post("/api/subjects", newSubject);
      setItems([res.data.subject, ...items]);
      setSubjectName("");
      setSubjectDescription("");
    } catch (err) {
      console.error("Error adding subject:", err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = (index) => {
    try {
      const subjectToDelete = items[index];
      API.delete(`/api/subjects/${subjectToDelete._id}`);
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, minHeight: "100vh" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 3, textAlign: "left" }}
      >
        Welcome, Dharnesh
      </Typography>

      {/* Add subject form */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSubject();
        }}
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Subject Name"
          variant="outlined"
          size="small"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
            minWidth: { xs: "100%", sm: "auto" },
          }}
        />
        <TextField
          placeholder="Subject Description"
          variant="outlined"
          size="small"
          value={subjectDescription}
          onChange={(e) => setSubjectDescription(e.target.value)}
          sx={{
            flex: { xs: "1 1 100%", sm: "2 1 auto" },
            minWidth: { xs: "100%", sm: "auto" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4f432aff",
            "&:hover": { backgroundColor: "#322a1cff" },
            textTransform: "none",
            flex: { xs: "1 1 100%", sm: "0 0 auto" },
          }}
        >
          Add Subject
        </Button>
      </Box>

      {/* Subjects list */}
      <Grid container spacing={4} justifyContent="flex-start" alignItems="flex-start">
        {items?.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                minHeight: 180, // variable height
                width: 325, // fixed width
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
                  alignItems: "flex-start",
                  textAlign: "left",
                  overflow: "hidden",
                }}
              >
                <Typography variant="h6" gutterBottom noWrap={false}>
                  <TruncatedText text={item.subjectName || "No Name"} limit={25} />
                </Typography>

                <Box display="flex" mb={1} color="text.secondary">
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    Created At:{" "}
                    {new Date(item.createdAt || Date.now()).toLocaleDateString(
                      "en-GB"
                    )}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  Description: {item.subjectContent || "No Description"}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, justifyContent: "center" }}>
                <Button
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    backgroundColor: "#4f432aff",
                    color: "white",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#322a1cff" },
                  }}
                >
                  View
                </Button>
                <Button
                  onClick={() => handleDelete(index)}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    backgroundColor: "#f5e6cc",
                    color: "black",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#e6d8ba" },
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
