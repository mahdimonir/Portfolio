"use client";

import React from "react";

/**
 * Renders JSON-LD structured data for SEO.
 * @param {Object} data - The schema.org object to be stringified.
 */
const JsonLd = ({ data }) => {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
