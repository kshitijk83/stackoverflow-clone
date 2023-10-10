"use client";

import React, { useEffect } from "react";

import Prism from "prismjs";

import parse from "html-react-parser";

const ParseHTML = ({ data }: { data: any }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return <div className="markdown w-full min-w-full">{parse(data)}</div>;
};

export default ParseHTML;
