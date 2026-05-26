/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Shield, Volume2, CreditCard, Check, X, ShieldCheck, Flame, Zap } from 'lucide-react';
import { BroShopItem } from '../types';
import { BRO_SHOP_ITEMS } from '../data';

interface BoostPageProps {
  onUnlockSuccessfully: (productName: string) => void;
}

export default function BoostPage({ onUnlockSuccessfully }: BoostPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<BroShopItem | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Checkout custom input state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectProduct = (product: BroShopItem) => {
    setSelectedProduct(product);
    setShowCheckout(true);
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
    setCvv('');
    setPurchaseSuccess(false);
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsProcessing(true);

    // Simulate high-speed premium transaction gate
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseSuccess(true);
      onUnlockSuccessfully(selectedProduct.name);
    }, 1400);
  };

  const handleCloseSuccess = () => {
    setPurchaseSuccess(false);
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-rose-450" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto pb-32 text-left">
      
      {/* Dynamic Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="font-mono text-[9px] text-yellow-300 tracking-wider uppercase font-black">
            BroCard Elite Vault • متجر النخبة
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black italic text-slate-100 tracking-tight">
          Monetization Vault Upgrades
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
          Bypass failure checkpoint dares with Shield protection, or upgrade your shaming cards to legendary glowing skins to blow up on stories!
        </p>
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BRO_SHOP_ITEMS.map((prod) => {
          return (
            <div
              key={prod.id}
              className={`p-6 bg-gradient-to-b from-[#1C1032] to-[#120822] border rounded-3xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[300px] hover:scale-102 group ${
                prod.id === 'bs-royalty' 
                  ? 'border-yellow-550 shadow-md shadow-yellow-500/5' 
                  : 'border-purple-500/15'
              }`}
            >
              {/* Highlight background radial */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#A78BFA]/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Product Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-950/50 border border-purple-550/20 flex items-center justify-center">
                    {getProductIcon(prod.iconName)}
                  </div>
                  <span className="text-[8.5px] font-mono tracking-widest bg-yellow-400/10 text-yellow-300 border border-yellow-400/25 px-2 py-0.5 rounded font-black">
                    {prod.badge}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white font-sans flex flex-col gap-1">
                  <span>{prod.name}</span>
                  <span className="text-[10px] text-purple-300 font-mono font-bold font-sans">
                    {prod.arabicName}
                  </span>
                </h4>

                <p className="text-[11.5px] text-slate-350 mt-2.5 leading-relaxed">
                  {prod.description}
                </p>

                <p className="text-[10px] text-emerald-400 font-mono mt-3 leading-none italic">
                  ✓ {prod.benefit}
                </p>
              </div>

              {/* Bottom Price buy block */}
              <div className="pt-4 mt-6 border-t border-purple-550/10 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400 block leading-tight">Price Tag</span>
                  <span className="text-base font-black text-yellow-300 font-mono block mt-1">
                    {prod.priceSAR} SAR <span className="text-[10px] text-slate-400 block sm:inline">/ ${prod.priceUSD}</span>
                  </span>
                </div>

                <button
                  onClick={() => handleSelectProduct(prod)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-600 hover:brightness-110 text-white font-sans font-bold text-[11px] rounded-lg transition-all cursor-pointer shadow-md"
                >
                  Acquire Now
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* SECURE MADA / APPLE PAY CHECKOUT FORM */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-[#06030F]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1C1032] border border-purple-550/35 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl"
            >
              
              {/* Close Cross */}
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-black/40 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {purchaseSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/15 border-2 border-emerald-400 animate-pulse flex items-center justify-center mb-5 text-emerald-400 text-xl">
                    ✓
                  </div>
                  
                  <span className="font-mono text-[9px] text-[#34D399] tracking-widest uppercase font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    TRANSACTION SETTLED • نجاح الدفع
                  </span>

                  <h3 className="text-xl font-sans font-black text-slate-150 mt-5">
                    Prestige Upgrade Active!
                  </h3>
                  
                  <p className="text-xs text-[#D6C7FF]/75 max-w-xs mt-2 leading-relaxed">
                    Thank you, your <span className="text-amber-400 font-extrabold">{selectedProduct?.name}</span> is cleared securely. Simulated benefits have been applied directly to your gameplay session!
                  </p>

                  <button
                    onClick={handleCloseSuccess}
                    className="mt-8 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold font-sans text-xs uppercase cursor-pointer hover:brightness-110 shadow-md"
                  >
                    Close Secure Drawer • إغلاق
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessCheckout} className="p-6">
                  <div className="mb-6">
                    <span className="font-mono text-[9px] text-[#A78BFA] tracking-widest block uppercase leading-none">
                      SECURE CHECKOUT TERMINAL
                    </span>
                    <h3 className="text-md font-extrabold text-white mt-1">
                      Clear: {selectedProduct?.name}
                    </h3>
                    <p className="text-[10px] text-[#B6A8D6] font-mono mt-0.5 uppercase">
                      Merchant: BROCARD INTEL (Riyadh Gate, SA)
                    </p>
                  </div>

                  {/* Price breakdown block */}
                  <div className="bg-[#120822] p-3.5 rounded-xl border border-purple-500/10 mb-6 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 uppercase">Amount Due:</span>
                    <span className="text-yellow-300 font-extrabold text-sm">{selectedProduct?.priceSAR} SAR / ${selectedProduct?.priceUSD}</span>
                  </div>

                  {/* Credit Card Inputs with Local GCC payment providers hints */}
                  <div className="space-y-4 text-left text-xs text-[#D6C7FF]">
                    
                    {/* Cardholder */}
                    <div>
                      <label className="block font-mono font-bold uppercase tracking-wider mb-1 text-slate-350 text-[10px]">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="e.g. FAHAD SULTAN AL-HARBI"
                        className="w-full bg-[#120822] border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 uppercase focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block font-mono font-bold uppercase tracking-wider mb-1 text-slate-350 text-[10px] flex justify-between">
                        <span>Card Number</span>
                        <span className="text-[9px] text-pink-400 font-black">mada / Apple Pay</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-[#120822] border border-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <CreditCard className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Expiry / CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold uppercase tracking-wider mb-1 text-slate-350 text-[10px]">
                          Expiry Date
                        </label>
                        <input
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
                        <label className="block font-mono font-bold uppercase tracking-wider mb-1 text-slate-350 text-[10px]">
                          CVV Security
                        </label>
                        <input
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

                  {/* Clear action */}
                  <div className="mt-8 space-y-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 font-sans font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                          <span>Authorizing transaction...</span>
                        </>
                      ) : (
                        <span>Simulate Secure Payment • إتمام الدفع</span>
                      )}
                    </button>
                    
                    <span className="text-[8px] font-mono text-slate-500 block text-center uppercase tracking-wider leading-none">
                      PCI-DSS Layer 2 Encryption Clearances Checked
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
