import React from "react";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import "../styles/Footer.scss";
import logo from '../images/AL.png'

function Footer() {
  return (
    <>
      <footer className="footer__container">
        <div className="footer__wrap">
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> About us </div>
                <Link className="footer__link" to="/stats">
                  Stats
                </Link>
                <Link className="footer__link" to="/stats">
                  Table
                </Link>
                <Link className="footer__link" to="/news">
                  News
                </Link>
                <Link className="footer__link" to="/tv">
                  AL TV
                </Link>
                <Link className="footer__link" to="/teams">
                  Teams
                </Link>
              </div>
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> Sponsors </div>
                <Link className="footer__link" to="/">
                  AX Studio
                </Link>
                <Link className="footer__link" to="/">
                  SportsWear
                </Link>
                <Link className="footer__link" to="/">
                  Media Sports
                </Link>
                <Link className="footer__link" to="/">
                  Financial Bank
                </Link>
                <Link className="footer__link" to="/">
                  X-Tech
                </Link>
              </div>
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> Awards </div>
                <Link className="footer__link" to="/awards">
                  Best Forward
                </Link>
                <Link className="footer__link" to="/awards">
                  Best Middle
                </Link>
                <Link className="footer__link" to="/awards">
                  Best Defender
                </Link>
                <Link className="footer__link" to="/awards">
                  Best GoalKeeper
                </Link>
                <Link className="footer__link" to="/awards">
                  Best Coach
                </Link>
              </div>
        </div>
      </footer>
      <section className="socialMedia">
        <div className="socialMedia__wrap">
          <div className="socialMedia__logo">
            <img src={logo} alt='AL' style={{maxHeight: '50px'}} />
          </div>

          <small className="socialMedia__rights">
            Arkadian League &copy; {new Date().getFullYear()} All rights
            reserved
          </small>
          <div className="socialMedia__icons">
            <Link
              className="socialMedia__iconLink"
              href="/"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebook />
            </Link>
            <Link
              className="socialMedia__iconLink"
              href="/"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            <Link
              className="socialMedia__iconLink"
              href="/"
              target="_blank"
              aria-label="Youtube"
            >
              <FaYoutube />
            </Link>
            <Link
              className="socialMedia__iconLink"
              href="/"
              target="_blank"
              aria-label="Twitter"
            >
              <FaTwitter />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
