import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav class="navbar navbar-dark navbar-expand-sm bg-dark fixed-top">
        <div class="container">
        <a href="/" class="navbar-brand">
        <i class="fas fa-blog"></i> &nbsp;
        Blog Template
        </a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>


        <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a href="" class="nav-link active">
                    Home
                </a>
            </li>
            <li class="nav-item">
                <a href="" class="nav-link active">
                    Blog
                </a>
            </li>
            <li class="nav-item">
                <a href="" class="nav-link active">
                    About
                </a>
            </li>
            <li class="nav-item">
                <a href="" class="nav-link active">
                    Contact
                </a>
            </li>
        </ul>
        </div>



    </div>
    </nav>
  );
};

export default Navbar;
