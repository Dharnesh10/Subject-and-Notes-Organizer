import React, { useEffect } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';


// Helper component for truncating text
const TruncatedText = ({ text, limit = 25 }) => {
  const [expanded, setExpanded] = React.useState(false);
  if (!text) return "No Name";

  const isTruncated = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

  return (
    <span style={{ display: "inline" }}>
      {displayText}
      {isTruncated && (
        <span
          style={{
            color: "rgba(0,0,0,0.6)",
            cursor: "pointer",
            fontSize: "inherit",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Show less" : "..."}
        </span>
      )}
    </span>
  );
};


const Home = () => {
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectDescription, setSubjectDescription] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [showDescription, setShowDescription] = React.useState(false);
  const [name, setName] = React.useState("Guest");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Decode token
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
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

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchSubjectById = async (id) => {
    try {
      const res = await API.get(`/subjects/${id}`);
      setItems([res.data]);
    } catch (err) {
      console.error("Error fetching subject:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      else if (err.response?.status === 404) setItems([]);
    }
  };

  React.useEffect(() => {
    if (id) fetchSubjectById(id);
    else fetchSubjects();
  }, [id]);


  // Add subject
  const handleAddSubject = async () => {
  if (!subjectName) return; // subject is required

  const newSubject = {
    subjectName,
    subjectContent: subjectDescription || "None", // default to "None"
  };

  try {
    const res = await API.post("/subjects", newSubject);
    setItems([res.data.subject, ...items]);
    setSubjectName("");
    setSubjectDescription("");
    setShowDescription(false); // reset form state
    setFormOpen(false);
  } catch (err) {
    console.error("Error adding subject:", err);
    alert(err.response?.data?.error || "Something went wrong");
  }
};

  const resetAddForm =() => {
    setOpenDialog(false);
    setSubjectName("");
    setSubjectDescription("");
  }


  const handleOpenDelete = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const subjectToDelete = items[deleteIndex];
      await API.delete(`/subjects/${subjectToDelete._id}`);
      const updatedItems = items.filter((_, i) => i !== deleteIndex);
      setItems(updatedItems);
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

  const filteredItems = items.filter(
    (item) =>
      item.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectContent?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 4, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <EventNoteOutlinedIcon fontSize="medium" />
          Created Subjects
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormOpen(true);
            setShowDescription(false);
          }}
          sx={{
            textTransform: "none",
            px: 2,
            py: 1,
            fontWeight: 500,
            fontSize: "0.95rem",
            borderRadius: "8px",
            borderColor: "#1976d2",
            color: "#1976d2",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e3f2fd", // subtle light blue
              borderColor: "#1976d2",
            },
            "&:active": {
              backgroundColor: "#bbdefb",
            },
          }}
        >
          Add Subject
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search subjects..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Subjects list */}
      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 4,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <Card
              key={index}
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
                mx: "auto",
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
                  <TruncatedText text={item.subjectName || "No Name"} limit={20} />
                </Typography>
                <Box display="flex" mb={1} color="text.secondary">
                  <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  <Typography variant="body2">
                    Created At:{" "}
                    {new Date(item.createdAt || Date.now()).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Typography>
                </Box>
                <Box display="flex" color="text.secondary">
                  <Typography variant="body2" color="text.secondary">
                    <HiOutlineClipboardDocumentList size={20} style={{ marginRight: "5px" }} />
                    <TruncatedText
                      text={"Description: " + (item.subjectContent || "No Description")}
                      limit={30}
                    />
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, justifyContent: "center" }}>
                <Button
                  onClick={() => navigate(`/subjects/${item._id}/topics`)}
                  startIcon={<FiEdit color="#e0ddcf" size={15} />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    backgroundColor: "#3d314a",
                    color: "#e0ddcf",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#483b56ff" },
                  }}
                >
                  View
                </Button>
                <Button
                  onClick={() => handleOpenDelete(index)}
                  startIcon={<FiTrash2 color="#3d314a" size={15} />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    backgroundColor: "#d3d0c2ff",
                    color: "#2d232e",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#e0ddcf" },
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 4, mx: "auto", fontStyle: "italic" }}
          >
            No subjects found !
          </Typography>
        )}
      </Grid>

      {/* Add Subject Form Overlay */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            bgcolor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          Add New Subject
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSubject();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            {/* Subject Name */}
            <TextField
              placeholder="Enter Subject Name (e.g., Chemistry)"
              label="Subject Name"
              variant="outlined"
              size="medium"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              fullWidth
              required
            />

            {/* Toggleable Description */}
            {showDescription ? (
              <TextField
                placeholder="Enter Subject Overview (optional)"
                label="Description"
                variant="outlined"
                size="medium"
                multiline
                minRows={2}
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                fullWidth
              />
            ) : (
              <Button
                variant="dashed"
                onClick={() => setShowDescription(true)}
                startIcon={<AddIcon />}
                sx={{
                  alignSelf: "flex-start",
                  borderStyle: "dashed",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  textTransform: "none",
                  color: "#555",
                  borderColor: "#bbb",
                  "&:hover": { borderColor: "#1976d2", color: "#1976d2", bgcolor: "#f0f6ff" },
                }}
              >
                Add Description
              </Button>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={() => setFormOpen(false)}
            sx={{
              borderRadius: 3,
              px: 4,
              textTransform: "none",
              bgcolor: "#f1f1f1",
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSubject}
            variant="contained"
            sx={{
              borderRadius: 3,
              px: 4,
              textTransform: "none",
              bgcolor: "#1976d2",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#1565c0" },
            }}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subject? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={() => resetAddForm()}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
