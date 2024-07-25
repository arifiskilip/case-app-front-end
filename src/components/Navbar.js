import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../interceptors/axiosInstance ";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Başlangıçta kullanıcı bilgisi null olabilir

  const getUser = async () => {
    try {
      const userResponse = await axiosInstance.get("/User/GetUserByAuthenticated");
      setUser(userResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark navbar-expand-sm bg-dark fixed-top">
      <div className="container">
        <a href="/" className="navbar-brand">
          <i className="fas fa-blog"></i> &nbsp; Case App
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarCollapse" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {user && (
              <>
                <li className="nav-item mx-2">
                  <button className="btn btn-success nav-link">
                    {user !==null}{
                        user.firstName + " " + user.lastName
                    }
                  </button>
                </li>
                <li className="nav-item mx-2">
                  <button
                    onClick={() => handleLogout()}
                    className="btn btn-danger nav-link"
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
