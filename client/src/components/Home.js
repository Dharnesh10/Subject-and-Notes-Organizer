import React from "react";
import API from "../api";
import { Grid, Card, CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  // ✅ search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // ✅ new states for delete confirmation
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(null);

  // ✅ snackbar states
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // ✅ user info states
  const [name, setName] = React.useState("Guest");

  // ✅ auth check and redirect to login if no token
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // ✅ no token → log out
      localStorage.removeItem("token"); // clear storage just in case
      navigate("/login"); // redirect to login page
    }
  }, [navigate]);

  // ✅ decode token to get user info
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // No token, do nothing
    try {
      const decoded = jwtDecode(token);

      const username = decoded.name || decoded.username || decoded.sub;

      setName(username);

    } catch (error) {
      console.error("Failed to decode token:", error);
      setName("Guest");
      localStorage.removeItem("token");
    }
  }, []);

  // Fetch existing subjects from backend
  const fetchSubjects = async () => {
    try {
      const res = await API.get("/api/subjects");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/unauthorized"); // redirect to unauthorized users
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

  // ✅ open delete confirmation dialog
  const handleOpenDelete = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  // ✅ confirm delete
  const handleConfirmDelete = async () => {
    try {
      const subjectToDelete = items[deleteIndex];
      await API.delete(`/api/subjects/${subjectToDelete._id}`);
      const updatedItems = items.filter((_, i) => i !== deleteIndex);
      setItems(updatedItems);

      // ✅ show success message
      setSnackbarMessage("Item deleted successfully");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setOpenDialog(false);
      setDeleteIndex(null);
    }
  };

  // ✅ filter subjects based on search query
  const filteredItems = items.filter(
    (item) =>
      item.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectContent?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 4, minHeight: "100vh" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 3, textAlign: "left" }}
      >
        Welcome, {name} !
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
          mb: 2,
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
            backgroundColor: "#1877f2",
            "&:hover": { backgroundColor: "#3286f4ff" },
            textTransform: "none",
            flex: { xs: "1 1 100%", sm: "0 0 auto" },
          }}
        >
          Add Subject
        </Button>
      </Box>

      {/* ✅ Search Bar */}
      <TextField
        placeholder="Search subjects..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 4,
          borderRadius: "50px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Subjects list */}
      <Grid container spacing={4} justifyContent="flex-start" alignItems="flex-start">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
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
                    alignItems: "flex-start",
                    textAlign: "left",
                    overflow: "hidden",
                  }}
                >
                  <Typography variant="h6" gutterBottom noWrap={false}>
                    <TruncatedText text={item.subjectName || "No Name"} limit={30} />
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

                  <Box display="flex" color="text.secondary">
                    <DescriptionIcon fontSize="small" sx={{ mr: 0.5, mt: "2px" }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.subjectContent || "No Description"}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, justifyContent: "center" }}>
                  <Button
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      backgroundColor: "#1877f2",
                      color: "white",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#3286f4ff" },
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleOpenDelete(index)}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      backgroundColor: "#f44336",
                      color: "white",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#f35a4f" },
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 4, mx: "auto" }}
          >
            No subjects found
          </Typography>
        )}
      </Grid>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subject? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              backgroundColor: "#e4e3e1ff",
              color: "black",
              textTransform: "none",
              "&:hover": { backgroundColor: "#d7d7d7ff" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              borderRadius: 2,
              px: 4,
              backgroundColor: "#d32f2f",
              color: "white",
              textTransform: "none",
              ml: 2,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar for delete success */}
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
};

export default Home;
