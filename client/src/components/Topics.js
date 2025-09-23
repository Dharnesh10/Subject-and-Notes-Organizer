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
  Menu,
  MenuItem,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function TopicsPage() {
  const { id: subjectId } = useParams(); // Subject ID from route
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [topics, setTopics] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuTopicId, setMenuTopicId] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // edit dialog state
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTopic, setEditTopic] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");

  const open = Boolean(anchorEl);

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
      setSnackbar({
        open: true,
        message: "Topic added",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add topic",
        severity: "error",
      });
    }
  };

  // Open edit modal
  const handleOpenEdit = (topic) => {
    setEditTopic(topic);
    setEditTitle(topic.title);
    setEditOpen(true);
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditTopic(null);
    setEditTitle("");
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      const res = await API.put(`/topics/${editTopic._id}`, {
        title: editTitle,
      });
      setTopics(
        topics.map((t) => (t._id === editTopic._id ? res.data : t))
      );
      setSnackbar({
        open: true,
        message: "Topic updated",
        severity: "success",
      });
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update topic",
        severity: "error",
      });
    }
  };

  // Delete topic
  const handleDeleteTopic = async (topicId) => {
    try {
      await API.delete(`/topics/${topicId}`);
      setTopics(topics.filter((t) => t._id !== topicId));
      setSnackbar({
        open: true,
        message: "Topic deleted",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete topic",
        severity: "error",
      });
    }
  };

  const handleMenuClick = (event, topicId) => {
    setAnchorEl(event.currentTarget);
    setMenuTopicId(topicId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTopicId(null);
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2, px: isMobile ? 1 : 3 }}>
      <Typography
        variant={isMobile ? "h6" : "h4"}
        gutterBottom
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
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": { borderRadius: "50px" },
        }}
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
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleMenuClick(e, topic._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                sx={{
                  borderBottom:
                    index !== filteredTopics.length - 1
                      ? "1px solid #e0eaf1"
                      : "none",
                }}
              >
                <ListItemButton
                  onClick={() => navigate(`/topics/${topic._id}/notes`)}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            fontWeight: 500,
                          }}
                        >
                          {topic.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 2, whiteSpace: "nowrap" }}
                        >Created On: {" "}
                          {new Date(topic.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
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
          sx={{
            minWidth: "150px",
            borderRadius: "50px",
            textTransform: "none",
            borderWidth: 2,
            "&:hover": { borderWidth: 2 },
          }}
        >
          ADD TOPIC
        </Button>
      </Box>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            navigate(`/topics/${menuTopicId}/notes`);
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            const topic = topics.find((t) => t._id === menuTopicId);
            handleOpenEdit(topic);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteTopic(menuTopicId);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
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
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
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
