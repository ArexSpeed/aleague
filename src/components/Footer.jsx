import React from "react";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import "../styles/Footer.scss";

function Footer() {
  return (
    <>
      <footer className="footer__container">
        <div className="footer__wrap">
          <div className="footer__linksContainer">
            <div className="footer__linksWrapper">
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> About us </div>
                <Link className="footer__link" to="/signin">
                  Stats
                </Link>
                <Link className="footer__link" to="/signin">
                  Table
                </Link>
                <Link className="footer__link" to="/signin">
                  News
                </Link>
                <Link className="footer__link" to="/signin">
                  AL TV
                </Link>
                <Link className="footer__link" to="/signin">
                  Teams
                </Link>
              </div>
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> Sponsors </div>
                <Link className="footer__link" to="/signin">
                  AX Studio
                </Link>
                <Link className="footer__link" to="/signin">
                  SportsWear
                </Link>
                <Link className="footer__link" to="/signin">
                  Media Sports
                </Link>
                <Link className="footer__link" to="/signin">
                  Financial Bank
                </Link>
                <Link className="footer__link" to="/signin">
                  X-Tech
                </Link>
              </div>
              <div className="footer__linksItem">
                <div className="footer__linksTitle"> Awards </div>
                <Link className="footer__link" to="/signin">
                  Best Forward
                </Link>
                <Link className="footer__link" to="/signin">
                  Best Middle
                </Link>
                <Link className="footer__link" to="/signin">
                  Best Defender
                </Link>
                <Link className="footer__link" to="/signin">
                  Best GoalKeeper
                </Link>
                <Link className="footer__link" to="/signin">
                  Best Coach
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <section className="socialMedia">
        <div className="socialMedia__wrap">
          <div className="socialMedia__logo">dolla</div>

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
