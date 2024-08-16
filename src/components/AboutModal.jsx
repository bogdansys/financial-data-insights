import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>About Financial Data Generator</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] pr-4">
          <DialogDescription>
            <p className="mb-4">
              The Financial Data Generator is a powerful tool designed to provide easy access to historical stock and cryptocurrency data. Our app allows users to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Select between stocks and cryptocurrencies</li>
              <li>Choose specific symbols for data retrieval</li>
              <li>Set custom date ranges for historical data</li>
              <li>View data in an easy-to-read table format</li>
              <li>Download data as CSV files for further analysis</li>
            </ul>
            <p className="mb-4">
              This app is perfect for investors, analysts, and anyone interested in financial markets. It provides a user-friendly interface to access valuable market data quickly and efficiently.
            </p>
            <p className="mb-4">
              For more advanced analysis, we've created a companion app that works seamlessly with the data generated here. You can access it through the link provided on the main page.
            </p>
            <p>
              We're constantly working to improve and expand our services. If you have any feedback or suggestions, please don't hesitate to contact us.
            </p>
          </DialogDescription>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;