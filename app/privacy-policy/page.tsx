"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PageLink {
  text: string;
  urlpath: string;
}

const tocLinks = [
  { id: "copyright-notice", title: "Copyright Notice & Terms of Use" },
  { id: "ownership", title: "1. Ownership" },
  { id: "license-to-use", title: "2. License to Use" },
  { id: "restrictions", title: "3. Restrictions" },
  { id: "attribution", title: "4. Attribution" },
  { id: "disclaimer", title: "5. Disclaimer" },
  { id: "enforcement", title: "6. Enforcement" },
  { id: "licensing", title: "Licensing" },
];

const page = () => {
  const [showMobileToc, setShowMobileToc] = useState(false);
  return (
    <main>
      <header className="mx-auto px-4 md:px-16 pt-16 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] h-full w-full md:h-[70vh]">
        <span className="bg-black text-white text-md rounded-full mb-3 px-8 py-2 mt-20">
          Legal Information
        </span>
        <h1 className="text-5xl md:text-[4rem] font-extrabold text-white pb-4">
          Copyright Notice & Terms of Use
        </h1>
        <p className="text-md text-gray-300">Last Updated: May 2025.</p>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-16 pb-24 flex flex-col md:flex-row gap-8 mt-10">
        {/* Table of Contents */}
        <aside className="hidden md:block w-[35%] sticky top-20 self-start">
          <h2 className="font-bold text-lg mb-3">Table of Contents</h2>
          <ul
            role="list"
            className="space-y-2 text-sm text-blue-800 font-medium"
          >
            {tocLinks.map((link) => (
              <li key={link.id} role="listitem">
                <a
                  href={`#${link.id}`}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* TOC Collapsible on mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileToc(!showMobileToc)}
            className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-[10px] text-sm font-medium"
          >
            Table of Contents
            {showMobileToc ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {showMobileToc && (
            <ul
              role="list"
              className="mt-4 space-y-2 border border-gray-200 rounded-[10px] p-4"
            >
              {tocLinks.map((link) => (
                <li role="listitem" key={link.id}>
                  <Link
                    href={`#${link.id}`}
                    className="text-blue-700 text-sm hover:underline"
                    onClick={() => setShowMobileToc(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Copyright Notice & Terms of Use Sections */}
        <section className="bg-white text-gray-900 px-4 sm:px-6 lg:px-20 py-10 max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Copyright Notice & Terms of Use */}
            <div id="copyright-notice">
              <h2 className="text-3xl font-bold mb-6 text-[#011F72]">
                Copyright Notice & Terms of Use
              </h2>
              <p className="mb-6 text-lg font-semibold">
                © 2025 TechEdu Solution Ltd. All rights reserved.
              </p>
              <p className="mb-6 text-lg">
                No part of this publication may be reproduced, distributed, or
                transmitted in any form or by any means, including photocopying,
                recording, or other electronic or mechanical methods, without
                the prior written permission of the copyright owner, except in
                the case of brief quotations used in critical reviews and
                certain other non-commercial uses permitted by copyright law.
              </p>
            </div>

            <div className="pt-8 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-[#011F72]">
                Terms of Use for Training & Digital Products
              </h2>
            </div>

            <div id="ownership">
              <h3 className="text-2xl font-bold mb-4">1. Ownership</h3>
              <p>
                All training content, resources, slide decks, videos,
                frameworks, and digital assets are the intellectual property of
                TechEdu Solution Ltd.
              </p>
            </div>

            <div id="license-to-use">
              <h3 className="text-2xl font-bold mb-4">2. License to Use</h3>
              <p>
                You are granted a non-transferable, non-exclusive, limited
                license to use the materials for your personal or internal
                business use only.
              </p>
            </div>

            <div id="restrictions">
              <h3 className="text-2xl font-bold mb-4">3. Restrictions</h3>
              <p>
                You may not resell, redistribute, sublicense, or modify and
                publish the materials as your own. Unauthorized sharing is
                strictly prohibited.
              </p>
            </div>

            <div id="attribution">
              <h3 className="text-2xl font-bold mb-4">4. Attribution</h3>
              <p>
                Where excerpts or references are used, appropriate credit must
                be given to TechEdu Solution Ltd.
              </p>
            </div>

            <div id="disclaimer">
              <h3 className="text-2xl font-bold mb-4">5. Disclaimer</h3>
              <p>
                All materials are for informational and educational purposes
                only. No guarantees are made regarding business outcomes.
              </p>
            </div>

            <div id="enforcement">
              <h3 className="text-2xl font-bold mb-4">6. Enforcement</h3>
              <p>
                Violation of these terms may result in access termination and
                possible legal action.
              </p>
            </div>

            <div id="licensing" className="pt-8 border-t-2 border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-[#011F72]">
                Licensing
              </h2>
              <p className="mb-6 text-lg">
                For corporate licensing, multi-user access, or resell
                partnerships, please contact us to obtain a custom license
                agreement.
              </p>
              <ul role="list" className="list-none mt-2 ml-0">
                <li role="listitem" className="flex gap-2 items-center">
                  <MdEmail size={20} />{" "}
                  <Link
                    href="mailto:info@techedusolution.com"
                    className="text-[#011F72] font-bold underline"
                  >
                    info@techedusolution.com
                  </Link>
                </li>
                <li role="listitem" className="flex gap-2 items-center">
                  <FaLocationPin size={20} /> TechEdu Solution Limited, United
                  Kingdom
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
