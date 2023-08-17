import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <div className="created-by">Made with ❤️ by Daniyal Ikram</div>
      <div className="contact">
        <a
          rel="noopener noreferrer"
          href="https://www.instagram.com/hrishabh.hj/"
          target="_blank"
        >
          <i class="fa-brands fa-instagram"></i>
        </a>
        <a
          rel="noopener noreferrer"
          href="https://twitter.com/hrishabhcodes"
          target="_blank"
        >
          <i class="fa-brands fa-twitter"></i>
        </a>
        <a
          rel="noopener noreferrer"
          href="https://github.com/HrishabhCodes"
          target="_blank"
        >
          <i class="fa-brands fa-github"></i>
        </a>
        <a
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/hrishabh-jain/"
          target="_blank"
        >
          <i class="fa-brands fa-linkedin"></i>
        </a>
      </div>
    </>
  );
};

export default Footer;
