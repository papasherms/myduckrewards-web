import React from 'react'
import { CheckCircle, Zap, Crown, Mail } from 'lucide-react'

const Business: React.FC = () => {
  const membershipTiers = [
    {
      name: 'Basic',
      price: 'Quarterly',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-900',
      features: [
        'Random duck association',
        'Quarterly billing',
        '1 Duck Alert after 6 months',
        'Local zip code coverage'
      ],
      icon: CheckCircle,
      popular: false
    },
    {
      name: 'Trade',
      price: 'Bi-Annual',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-white',
      features: [
        'Business-type matched duck',
        '6-month billing cycle',
        '2 Duck Alerts per year',
        'Border zip code bonus'
      ],
      icon: Zap,
      popular: true
    },
    {
      name: 'Custom',
      price: 'Annual',
      bgColor: 'bg-gradient-to-br from-duck-500 to-orange-500',
      borderColor: 'border-duck-500',
      textColor: 'text-white',
      features: [
        'Custom-designed duck',
        'Annual billing',
        '4 Duck Alerts per year',
        'Premium placement'
      ],
      icon: Crown,
      popular: false
    }
  ]

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Partner with MyDuckRewards
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Drive foot traffic and increase sales with our innovative gamified marketing platform
          </p>
        </div>

        <div className="bg-duck-yellow text-white py-12 px-8 rounded-lg mb-16 text-center">
          <h2 className="text-2xl font-bold mb-4">First 3 Months FREE!</h2>
          <p className="text-lg">
            Try our platform risk-free for the first three months. See the results before you commit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {membershipTiers.map((tier, index) => {
            const IconComponent = tier.icon
            return (
              <div key={tier.name} className={`rounded-2xl p-8 ${tier.bgColor} ${tier.borderColor} border-2 ${index === 1 ? 'transform scale-105 shadow-xl' : 'shadow-lg'} relative`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-duck-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <IconComponent size={48} className={`mx-auto mb-4 ${tier.textColor === 'text-white' ? 'text-white' : 'text-duck-500'}`} />
                  <h3 className={`text-2xl font-bold ${tier.textColor}`}>{tier.name}</h3>
                  <p className={`text-lg ${tier.textColor} opacity-75`}>{tier.price} Billing</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle size={16} className={`mr-3 mt-1 ${tier.textColor === 'text-white' ? 'text-white' : 'text-green-500'}`} />
                      <span className={tier.textColor}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                  tier.textColor === 'text-white' 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'bg-duck-500 text-white hover:bg-duck-600'
                }`}>
                  Get Started
                </button>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Instant Exposure</h3>
              <p className="text-gray-600 text-sm">All machines in your zip code feature your offer on launch day</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-duck-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Duck Alerts</h3>
              <p className="text-gray-600 text-sm">Send targeted promotions directly to customers in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track redemptions, customer demographics, and ROI</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Social Media</h3>
              <p className="text-gray-600 text-sm">Customers share photos with their ducks at your location</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Join the Flock?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today to learn more about partnership opportunities
          </p>
          <button className="bg-duck-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mr-4">
            Contact Sales
          </button>
          <button className="border-2 border-duck-blue text-duck-blue px-8 py-3 rounded-lg font-medium hover:bg-duck-blue hover:text-white transition-colors">
            View Case Studies
          </button>
        </div>
      </div>
    </div>
  )
}

export default Business