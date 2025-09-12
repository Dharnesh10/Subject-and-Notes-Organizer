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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

function TopicsPage() {
  const [topics, setTopics] = React.useState([
    // { id: 1, title: "React Basics", notes: ["JSX", "Components", "Props vs State"] },
    // { id: 2, title: "Node.js", notes: ["Modules", "Express.js", "Middleware"] },
    // { id: 3, title: "MongoDB", notes: ["Documents & Collections", "CRUD Operations", "Mongoose"] },
    // { id: 4, title: "Java", notes: ["OOP", "Collections", "Streams"] },
    // { id: 5, title: "UI/UX", notes: ["Wireframes", "Prototyping", "Usability"] },
    // { id: 6, title: "DevOps", notes: ["CI/CD", "Docker", "Kubernetes"] },
  ]);

  const [selectedTopic, setSelectedTopic] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddTopic = () => {
    if (newTopic.trim() !== "") {
      setTopics([
        { id: topics.length + 1, title: newTopic, notes: [] },
        ...topics, // add to the top
      ]);
      setNewTopic("");
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Filter topics by search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        mb: 2,
        px: isMobile ? 1 : 3,
      }}
    >
      {!selectedTopic ? (
        // Topics List Page
        <Box>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            gutterBottom
            textAlign={isMobile ? "center" : "left"}
          >
            Topics
          </Typography>

          {/* Search Box */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
              },
            }}
          />

          {/* Topics List Box */}
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
                    key={topic.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={handleMenuClick}>
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
                    <ListItemButton onClick={() => setSelectedTopic(topic)}>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          fontWeight: 500,
                        }}
                        primary={topic.title}
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
                No topics found !
              </Box>
            )}
          </Paper>

          {/* Add Topic Form */}
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
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTopic}
              startIcon={<AddIcon />}
              sx={{ minWidth: "150px", borderRadius: "8px" }}
            >
              Add Topic
            </Button>
          </Box>
        </Box>
      ) : (
        // Topic Detail Page
        <Box>
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ mb: 2 }}
            onClick={() => setSelectedTopic(null)}
          >
            ← Back
          </Button>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            gutterBottom
            textAlign={isMobile ? "center" : "left"}
          >
            {selectedTopic.title}
          </Typography>

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
            {selectedTopic.notes.length > 0 ? (
              <List sx={{ overflowY: "auto" }}>
                {selectedTopic.notes.map((note, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={handleMenuClick}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    sx={{
                      borderBottom:
                        index !== selectedTopic.notes.length - 1
                          ? "1px solid #e0eaf1"
                          : "none",
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: isMobile ? "0.85rem" : "1rem",
                      }}
                      primary={note}
                    />
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
                No notes found
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* Shared Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>View</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Container>
  );
}

export default TopicsPage;
