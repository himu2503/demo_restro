import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <section id="cart-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-charcoal mb-4">
            Your <span className="text-primary">Cart</span>
          </h2>
          <p className="text-lg text-neutral-dark">
            {cart.length} meal plan{cart.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="text-center py-12 bg-neutral-snow rounded-3xl">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-neutral-charcoal mb-2">
              Your cart is empty
            </h3>
            <p className="text-neutral-dark mb-6">
              Add meal plans from Breakfast, Lunch, or Dinner sections above
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((item) => (
                <div 
                  key={item.mealType}
                  className="bg-neutral-snow rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img 
                      src={item.image} 
                      alt={item.supplierName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-2 rounded-full text-sm font-bold">
                      {item.mealType}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-charcoal mb-2">
                      {item.supplierName}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-neutral-dark">⭐ {item.rating}</span>
                    </div>
                    <p className="text-neutral-dark text-sm mb-4 bg-orange-light/20 px-3 py-2 rounded-lg">
                      ✓ {item.planDays ?? 7}-Day {item.mealType} Plan Included
                    </p>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.mealType)}
                      className="w-full py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all hover:scale-105"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-primary to-orange-deep text-white rounded-3xl p-8 shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                    <span className="text-lg">Total Meal Plans:</span>
                    <span className="text-2xl font-bold">{cart.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                    <span className="text-lg">Total Days (sum of plans):</span>
                    <span className="text-2xl font-bold">{cart.reduce((s, it) => s + (it.planDays ?? 7), 0)} days</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                    <span className="text-lg">Total Meals (approx):</span>
                    <span className="text-2xl font-bold">{cart.reduce((s, it) => s + (it.planDays ?? 7), 0)} meals</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-white text-primary rounded-full font-bold hover:bg-neutral-snow transition-all hover:scale-105 shadow-lg text-lg">
                  Proceed to Checkout 🎉
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
