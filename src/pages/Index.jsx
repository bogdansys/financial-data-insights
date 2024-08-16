import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin } from 'lucide-react';
import DataTable from '../components/DataTable';
import { fetchStockData, fetchCryptoData } from '../lib/api';
import PopularAssets from '../components/PopularAssets';
import DateRangePicker from '../components/DateRangePicker';
import AboutModal from '../components/AboutModal';

const Index = () => {
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['assetData', symbol, assetType, dateRange.startDate, dateRange.endDate],
    queryFn: () => assetType === 'stock' ? fetchStockData(symbol, dateRange.startDate, dateRange.endDate) : fetchCryptoData(symbol, dateRange.startDate, dateRange.endDate),
    enabled: false,
    retry: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !dateRange.startDate || !dateRange.endDate) {
      toast.error("Please fill in all fields");
      return;
    }
    refetch();
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${symbol}_${dateRange.startDate}_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white flex flex-col items-center justify-start pt-10 px-4 overflow-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-blue-800 mb-8 text-center"
      >
        Financial Data Generator
      </motion.h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <div>
                <Label htmlFor="assetType" className="text-lg font-semibold">Asset Type</Label>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="symbol" className="text-lg font-semibold">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder={assetType === 'stock' ? "Enter stock symbol (e.g., AAPL)" : "Enter crypto symbol (e.g., BTC)"}
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="mt-2"
                />
              </div>
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDateChange={setDateRange}
              />
            </div>
            <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-colors">Generate Data</Button>
          </form>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full md:w-1/2 flex flex-col"
        >
          <PopularAssets assetType={assetType} onSelect={setSymbol} />
          <div className="mt-8 space-y-4">
            <Link 
              to="https://data-insights-j4jp686bi-bogdansys-projects.vercel.app/" 
              className="block w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-center"
            >
              Analyze Your Data with Our Companion App
            </Link>
            <Button 
              onClick={() => setIsAboutModalOpen(true)}
              variant="outline"
              className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              About This App
            </Button>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.linkedin.com/notifications/?filter=all" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Linkedin className="w-5 h-5 mr-2" /> LinkedIn
                </Button>
              </a>
              <a href="https://github.com/bogdansys" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="text-gray-800 border-gray-800 hover:bg-gray-100">
                  <Github className="w-5 h-5 mr-2" /> GitHub
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-6xl"
          >
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
          </motion.div>
        )}

        {isError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 mb-4 text-center font-semibold"
          >
            Error fetching data: {error.message}. Please try again.
          </motion.div>
        )}

        {data && data.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-lg shadow-lg"
          >
            <Button onClick={downloadCSV} className="mb-6 bg-green-600 hover:bg-green-700 transition-colors">Download CSV</Button>
            <DataTable data={data} />
          </motion.div>
        )}

        {data && data.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-blue-500 mb-4 text-center font-semibold"
          >
            No data available for the selected date range.
          </motion.div>
        )}
      </AnimatePresence>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  );
};

export default Index;