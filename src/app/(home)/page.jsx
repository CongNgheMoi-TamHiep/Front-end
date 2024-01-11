import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const Home = () => {
    return (
        <div className="loading">
            <Box sx={{ display: "flex" }}>
                <CircularProgress />
            </Box>
        </div>
    );
};

export default Home;
