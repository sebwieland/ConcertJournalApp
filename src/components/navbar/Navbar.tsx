import {AppBar, Toolbar, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const navigate = useNavigate()
    const API_URL = 'http://localhost:8080';

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget as HTMLElement | null);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (error: unknown) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    return (
        <AppBar position="sticky">
            <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <img
                    src="/ConcertJournal_logo.png"
                    alt="Logo"
                    onClick={() => navigate('/')}
                    style={{cursor: 'pointer', marginRight: '16px'}}
                    width={"50"}
                    height={"50"}
                />
                <IconButton
                    component="button"
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    sx={{display: {xs: 'block', md: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>
                <Box sx={{display: {xs: 'none', md: 'block'}}}>
                    <Button color="inherit" onClick={() => navigate('/your-journal')}>
                        Your Journal
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/new-entry')}>
                        Add Entry
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { md: 'none' } }}
                >
                    <MenuItem onClick={() => {
                        navigate('/your-journal');
                        handleCloseNavMenu();
                    }}>
                        <Typography textAlign="center">Your Journal</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate('/new-entry');
                        handleCloseNavMenu();
                    }}>
                        <Typography textAlign="center">Add Entry</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;