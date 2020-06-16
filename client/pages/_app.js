import React from "react";
import App from "next/app";
import "../css/antd.less";

class WgApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default WgApp;
