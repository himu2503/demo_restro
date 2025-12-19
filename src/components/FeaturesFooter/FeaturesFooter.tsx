import React from 'react'

const FeaturesFooter: React.FC = () => {
  return (
    <>
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white text-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="why-choose" className="text-center text-4xl md:text-5xl font-bold mb-12 text-neutral-900">
            Why Choose{" "}
            <span className="text-black">Lunch</span>
            <span className="text-orange-500">Box</span>?
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "No Daily Pressure",
                desc: "No need to take daily pressure for making order",
              },
              {
                title: "Easy Cancellation",
                desc: "Cancel your subscription anytime you want",
              },
              {
                title: "Live Tracking",
                desc: "Track your food in real-time from restaurant to your doorstep",
              },
              {
                title: "Lightning-Fast Delivery",
                desc: "Get your food delivered in record time with our efficient delivery network",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:bg-neutral-50"
              >
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
  <footer id="site-footer" className="bg-gradient-to-r from-orange-100 via-white to-orange-50 border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-3 text-center sm:text-left">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-neutral-900">Company</h4>
              <ul className="text-sm space-y-2 text-neutral-700">
                <li className="hover:text-orange-500 transition-colors">About</li>
                <li className="hover:text-orange-500 transition-colors">Careers</li>
                <li className="hover:text-orange-500 transition-colors">Team</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-neutral-900">Contact</h4>
              <ul className="text-sm space-y-2 text-neutral-700">
                <li className="hover:text-orange-500 transition-colors">Help & Support</li>
                <li className="hover:text-orange-500 transition-colors">Partner with us</li>
                <li className="hover:text-orange-500 transition-colors">Ride with us</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-neutral-900">Legal</h4>
              <ul className="text-sm space-y-2 text-neutral-700">
                <li className="hover:text-orange-500 transition-colors">Terms & Conditions</li>
                <li className="hover:text-orange-500 transition-colors">Privacy Policy</li>
                <li className="hover:text-orange-500 transition-colors">Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-neutral-600">
            © 2025{" "}
            <span className="font-semibold">
              <span className="text-black">Lunch</span>
              <span className="text-orange-500">Box</span>
            </span>
            . All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default FeaturesFooter
