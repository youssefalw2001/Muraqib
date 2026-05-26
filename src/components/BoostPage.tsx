/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, EyeOff, Flame, ShieldAlert, CreditCard, Check, X, ShieldCheck } from 'lucide-react';
import { BoostProduct } from '../types';
import { BOOST_PRODUCTS } from '../data';

interface BoostPageProps {
  onUnlockSuccessfully: (productName: string) => void;
}

export default function BoostPage({ onUnlockSuccessfully }: BoostPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<BoostProduct | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Checkout form dummy state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectProduct = (product: BoostProduct) => {
    setSelectedProduct(product);
    setShowCheckout(true);
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
    setCvv('');
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsProcessing(true);

    // Simulate luxury transaction clearance delay
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseSuccess(true);
      onUnlockSuccessfully(selectedProduct.name);
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setPurchaseSuccess(false);
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  // Helper to map icons
  const getProductIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Crown': return <Crown {...props} className="w-6 h-6 text-amber-400" />;
      case 'Sparkles': return <Sparkles {...props} className="w-6 h-6 text-pink-400 animate-pulse" />;
      case 'EyeOff': return <EyeOff {...props} className="w-6 h-6 text-purple-400" />;
      case 'ShieldAlert': return <ShieldAlert {...props} className="w-6 h-6 text-[#FB7185]" />;
      default: return <Crown {...props} />;
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto pb-24 text-left">
      
      {/* Decorative Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 px-3.5 py-1 rounded-full mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#FACC15] animate-spin-slow" />
          <span className="font-mono text-[9px] text-[#FACC15] tracking-wider uppercase font-extrabold">
            High Nobility Store • متجر النخبة
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
          Acquire Spectral Unlocks
        </h2>
        <p className="text-xs text-[#B6A8D6] max-w-sm mx-auto mt-2 leading-relaxed text-balance">
          Bypass encryption, acquire spectral phantom secrecy, or pin your Admirer status to the pinnacle royal throne.
        </p>
      </div>

      {/* Grid of Elite products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BOOST_PRODUCTS.map((prod) => {
          const isVip = prod.id === 'bp-crown';
          return (
            <div
              id={`product-card-${prod.id}`}
              key={prod.id}
              className={`p-6 bg-gradient-to-b from-[#1C1032] to-[#120822] rounded-3xl relative overflow-hidden transition-all duration-350 flex flex-col justify-between h-72 border group ${
                isVip 
                  ? 'border-amber-500/35 hover:border-amber-500/50 shadow-[0_5px_20px_rgba(250,204,21,0.06)]' 
                  : 'border-purple-500/15 hover:border-purple-500/35'
              }`}
            >
              {/* Highlight backdrop */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-950/45 border border-purple-500/20 flex items-center justify-center">
                    {getProductIcon(prod.iconName)}
                  </div>
                  <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm uppercase tracking-wider font-extrabold border border-amber-500/20">
                    {prod.badge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base font-extrabold text-slate-100 font-sans flex items-center gap-2">
                  {prod.name}
                  <span className="text-[11px] text-purple-300 font-mono font-bold bg-purple-500/10 px-2 py-0.5 rounded-sm">
                    {prod.arabicName}
                  </span>
                </h4>
                
                <p className="text-xs text-[#D6C7FF]/70 mt-2 leading-normal">
                  {prod.description}
                </p>
              </div>

              {/* Price and Action row */}
              <div className="border-t border-purple-500/10 pt-4 flex justify-between items-center mt-4 bg-purple-950/15 p-3 rounded-xl">
                <div>
                  <span className="font-mono text-[10px] text-[#B6A8D6]/60 uppercase block leading-none">Prestige Value</span>
                  <span className="text-lg font-black text-amber-400 font-mono block mt-1">
                    {prod.priceSAR} SAR <span className="text-xs font-normal text-slate-200">/ ${prod.priceUSD}</span>
                  </span>
                </div>
                
                <button
                  id={`buy-btn-${prod.id}`}
                  onClick={() => handleSelectProduct(prod)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 text-slate-100 font-sans font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer group-hover:scale-102"
                >
                  Acquire Now
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Simulated GCC Credit Card Checkout Modal Overlay */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-[#06030F]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1C1032] border border-purple-500/35 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 p-2 text-[#B6A8D6] hover:text-slate-100 bg-[#120822] rounded-full hover:bg-[#20103E] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Purchase Success Overlay Screen */}
              {purchaseSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center animate-fadeIn">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 animate-pulse flex items-center justify-center mb-5 text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  
                  <span className="font-mono text-[9px] text-[#34D399] tracking-widest uppercase font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    TRANSACTION SETTLED • نجاح الدفع
                  </span>

                  <h3 className="text-2xl font-sans font-extrabold text-slate-100 mt-5">
                    Prestige Active!
                  </h3>
                  
                  <p className="text-xs text-[#D6C7FF]/75 max-w-xs mt-3 leading-linear">
                    Thank you, your <span className="text-amber-400 font-extrabold">{selectedProduct?.name}</span> is cleared securely. Encryption parameters applied instantly to your tracking node.
                  </p>

                  <button
                    onClick={handleCloseSuccess}
                    className="mt-8 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-100 rounded-xl font-bold font-sans text-xs uppercase cursor-pointer hover:brightness-110 shadow-md"
                  >
                    Done • إتمام
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessCheckout} className="p-6">
                  {/* Modal Header */}
                  <div className="mb-6">
                    <span className="font-mono text-[9px] text-[#A78BFA] tracking-widest block uppercase">
                      SECURE GCC SETTLEMENT GATEWAY
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-1">
                      Clear: {selectedProduct?.name}
                    </h3>
                    <p className="text-xs text-[#B6A8D6] font-mono mt-0.5">
                      Merchant: MURAQIB INTEL (Riyadh, SA)
                    </p>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-[#120822] p-3.5 rounded-xl border border-purple-500/10 mb-6 flex justify-between items-center text-xs font-mono">
                    <span className="text-[#B6A8D6]/60 uppercase">Amount Due:</span>
                    <span className="text-amber-400 font-extrabold text-sm">{selectedProduct?.priceSAR} SAR / ${selectedProduct?.priceUSD}</span>
                  </div>

                  {/* Credit Card Inputs */}
                  <div className="space-y-4 text-left text-xs text-[#D6C7FF]">
                    
                    {/* Cardholder */}
                    <div>
                      <label className="block font-mono font-bold uppercase tracking-wider mb-1.5 text-[#B6A8D6]">
                        Sovereign Holder Name
                      </label>
                      <input
                        id="checkout-cardholder"
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="e.g. BANDAR AL-SAUD"
                        className="w-full bg-[#120822] border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 uppercase focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block font-mono font-bold uppercase tracking-wider mb-1.5 text-[#B6A8D6] flex justify-between">
                        <span>Card Number</span>
                        <span className="text-[10px] text-pink-400/80">mada / Visa / Mastercard</span>
                      </label>
                      <div className="relative">
                        <input
                          id="checkout-cardnumber"
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-[#120822] border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B6A8D6]/50">
                          <CreditCard className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold uppercase tracking-wider mb-1.5 text-[#B6A8D6]">
                          Expiry Date
                        </label>
                        <input
                          id="checkout-expiry"
                          type="text"
                          required
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-[#120822] border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-[#B6A8D6]/30 focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-mono font-bold uppercase tracking-wider mb-1.5 text-[#B6A8D6]">
                          CVV Security
                        </label>
                        <input
                          id="checkout-cvv"
                          type="password"
                          required
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="•••"
                          className="w-full bg-[#120822] border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-[#B6A8D6]/30 focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Submission and processor info */}
                  <div className="mt-8 space-y-3">
                    <button
                      id="checkout-submit-btn"
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-brand-surface font-sans font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-brand-surface border-t-transparent animate-spin inline-block" />
                          <span>Clearing prestige authorization...</span>
                        </>
                      ) : (
                        <>
                          <span>Clear Transaction Securely • إتمام الدفع 🛡</span>
                        </>
                      )}
                    </button>
                    
                    <span className="text-[9px] font-mono text-[#B6A8D6]/40 block text-center uppercase tracking-wider">
                      PCI-DSS Layer 2 Encryption Clearance Certified
                    </span>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
