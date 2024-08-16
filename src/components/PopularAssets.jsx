import React from 'react';
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion";

const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NVDA', 'JPM', 'V', 'JNJ'];
const popularCryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE', 'AVAX'];

const PopularAssets = ({ assetType, onSelect }) => {
  const assets = assetType === 'stock' ? popularStocks : popularCryptos;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Popular {assetType === 'stock' ? 'Stocks' : 'Cryptocurrencies'}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {assets.map((asset, index) => (
          <motion.div
            key={asset}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              onClick={() => onSelect(asset)}
              className="w-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              {asset}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularAssets;