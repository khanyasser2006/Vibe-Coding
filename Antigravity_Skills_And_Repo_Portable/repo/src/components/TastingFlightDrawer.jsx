import React from 'react';
import { X, Trash2, ShoppingBag, Gift, CheckCircle, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TastingFlightDrawer({
  isOpen,
  onClose,
  selectedFlavors,
  onRemoveFlavor,
  onClearFlight,
  onNavigate,
}) {
  if (!isOpen) return null;

  const maxSlots = 4;
  const emptySlotsCount = Math.max(0, maxSlots - selectedFlavors.length);

  const subtotal = selectedFlavors.reduce((sum, f) => {
    const priceNum = parseFloat(String(f.price ?? '').replace(/[^0-9.]/g, '')) || 14.5;
    return sum + priceNum;
  }, 0);

  const handleCheckout = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FEC5A8', '#F4784E', '#FFF0E8', '#DE5F32'],
    });
    alert('Thank you for reserving your Ciné Grand Cru Tasting Flight! A concierge confirmation has been dispatched.');
    onClearFlight();
    onClose();
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[9995] bg-terracotta-dark/85 backdrop-blur-md flex justify-end animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-terracotta text-white h-full flex flex-col justify-between border-l-2 border-peach/30 shadow-2xl p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-peach/20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-peach text-terracotta flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white">Tasting Flight Box</h3>
                <span className="text-[11px] uppercase tracking-widest text-peach font-bold">
                  {selectedFlavors.length} of {maxSlots} Slots Selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Flavors List */}
          <div className="space-y-4 my-6">
            {selectedFlavors.map((flavor, index) => (
              <div
                key={flavor.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-terracotta-card border border-peach/25"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className="w-14 h-14 object-cover rounded-xl border border-peach/30"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-peach font-bold">
                      Slot 0{index + 1} &bull; {flavor.category}
                    </span>
                    <h4 className="font-serif text-lg text-white leading-tight">{flavor.name}</h4>
                    <span className="font-mono text-xs text-tangerine font-bold">
                      {flavor.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFlavor(flavor.id)}
                  className="p-2 text-peach/60 hover:text-white transition-colors"
                  title="Remove from flight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-5 rounded-2xl border border-dashed border-peach/30 text-peach/50 text-xs uppercase tracking-wider"
              >
                + Empty Flight Slot (Select from Flavors)
              </div>
            ))}
          </div>

          {/* Complimentary Packaging Banner */}
          <div className="p-4 rounded-2xl bg-peach-200/20 border border-peach/30 flex items-start gap-3 my-4">
            <Gift className="w-5 h-5 text-tangerine shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-peach block">
                Cryo-Insulated French Gift Box Included
              </span>
              <p className="text-peach-light/80 mt-0.5 font-medium">
                Shipped in sub-zero dry ice packaging with 4 gold-engraved tasting spoons.
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Checkout Action */}
        <div className="pt-6 border-t border-peach/20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-peach font-bold">Subtotal</span>
            <span className="font-serif text-2xl font-bold text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={selectedFlavors.length === 0}
            className={`w-full py-4 rounded-full text-xs font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
              selectedFlavors.length > 0
                ? 'bg-gradient-to-r from-tangerine to-peach text-terracotta shadow-glow-tangerine hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Reservation &rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) {
                onNavigate('account');
              } else {
                window.location.hash = '#/account';
              }
            }}
            className="text-[11px] uppercase tracking-widest text-peach/80 hover:text-peach text-center flex items-center justify-center gap-1.5 pt-1 cursor-pointer transition-colors"
          >
            <User className="w-3.5 h-3.5 text-tangerine" />
            <span>Member Sign In &bull; Save Your Flight</span>
          </button>
        </div>
      </div>
    </div>
  );
}
