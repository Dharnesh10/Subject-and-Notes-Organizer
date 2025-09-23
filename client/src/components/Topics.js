import * as React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  Paper,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function TopicsPage() {
  const { id: subjectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [topics, setTopics] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Edit dialog state
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTopic, setEditTopic] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");

  // Delete confirmation dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTopicId, setDeleteTopicId] = React.useState(null);

  // Fetch topics
  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await API.get(`/topics/${subjectId}`);
        setTopics(res.data);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load topics",
          severity: "error",
        });
      }
    };
    fetchTopics();
  }, [subjectId]);

  // Add topic
  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;
    try {
      const res = await API.post(`/topics/${subjectId}`, { title: newTopic });
      setTopics([res.data, ...topics]);
      setNewTopic("");
      setSnackbar({ open: true, message: "Topic added", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add topic", severity: "error" });
    }
  };

  // Edit topic
  const handleOpenEdit = (topic) => {
    setEditTopic(topic);
    setEditTitle(topic.title);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditTopic(null);
    setEditTitle("");
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      const res = await API.put(`/topics/${editTopic._id}`, { title: editTitle });
      setTopics(topics.map((t) => (t._id === editTopic._id ? res.data : t)));
      setSnackbar({ open: true, message: "Topic updated", severity: "success" });
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update topic", severity: "error" });
    }
  };

  // Delete topic
  const handleOpenDelete = (topicId) => {
    setDeleteTopicId(topicId);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteTopicId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/topics/${deleteTopicId}`);
      setTopics(topics.filter((t) => t._id !== deleteTopicId));
      setSnackbar({ open: true, message: "Topic deleted", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to delete topic", severity: "error" });
    } finally {
      handleCloseDelete();
    }
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log(topics)
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2, px: isMobile ? 1 : 3 }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ fontWeight: "bold", fontFamily: "Arial" }}
        textAlign={isMobile ? "center" : "left"}
      >
        Topics
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}
      />

      {/* Topics List */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          height: 420,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {filteredTopics.length > 0 ? (
          <List sx={{ overflowY: "auto" }}>
            {filteredTopics.map((topic, index) => (
              <ListItem
                key={topic._id}
                sx={{
                  borderBottom: index !== filteredTopics.length - 1 ? "1px solid #e0eaf1" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemButton
                  sx={{ flex: 1 }}
                  onClick={() => navigate(`/topics/${topic._id}/notes`)}
                >
                  <ListItemText
                    primary={topic.title}
                    secondary={new Date(topic.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  />
                </ListItemButton>

                {/* Action icons */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/topics/${topic._id}/notes`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenEdit(topic)}>
                    <FiEdit color="#1976d2" size={20} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(topic._id)}>
                    <FiTrash2 color="#bb2124" size={20} />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            No topics found!
          </Box>
        )}
      </Paper>

      {/* Add Topic */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Enter new topic..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTopic();
            }
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddTopic}
          startIcon={<AddIcon />}
          sx={{ minWidth: "150px", borderRadius: "50px", textTransform: "none", borderWidth: 2, "&:hover": { borderWidth: 2 } }}
        >
          ADD TOPIC
        </Button>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle>Edit Topic</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Topic Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ bgcolor: "#0077B5" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this topic? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default TopicsPage;
