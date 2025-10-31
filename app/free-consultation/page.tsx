"use client";

import CatalogPage from "@/components/CatalogPage";
import FreeBookingModal from "@/components/FreeBookingModal";
import React, { useState } from "react";

const FreeConsultation = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Override the CatalogPage's handleAddToCart behavior for this specific page
  const handleBookNow = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <header className="mx-auto px-4 md:px-16 pt-20 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] w-full md:h-[70vh]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200 pb-4 pt-20">
          Free Consultation Services
        </h1>
        <p className="text-base sm:text-lg font-medium text-white max-w-4xl mx-auto">
          Get expert guidance and support across career development, tech
          mentorship, academic advancement, business strategy, and AI governance.
          Book your free consultation today.
        </p>
      </header>
      <CatalogPage
        productType="Marketing, Consultation & Free Services"
        category="consultation"
        subcategory="booking"
        service="free booking"
        title="Free Consultation Services"
        description="Book your free consultation with our experts. From career guidance to tech mentorship, we're here to help you succeed."
        emptyStateTitle="No Free Consultations Found"
        emptyStateDescription="We couldn't find any free consultation services matching your current filters. Try adjusting your search criteria or browse our complete catalog."
        onBookNow={handleBookNow}
      />

      {selectedProduct && (
        <FreeBookingModal
          open={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </>
  );
};

export default FreeConsultation;
