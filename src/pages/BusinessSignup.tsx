import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building, User, Mail, Lock, Phone, MapPin, Globe, Eye, EyeOff, CheckCircle } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'

const BusinessSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'trade' | 'custom'>('trade')
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    agreeToTerms: false,
    wantsMarketing: true
  })

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Quarterly',
      features: [
        'Random duck association',
        'Quarterly billing',
        '1 Duck Alert after 6 months',
        'Local zip code coverage'
      ],
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'trade',
      name: 'Trade',
      price: 'Bi-Annual',
      features: [
        'Business-type matched duck',
        '6-month billing cycle',
        '2 Duck Alerts per year',
        'Border zip code bonus'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Annual',
      features: [
        'Custom-designed duck',
        'Annual billing',
        '4 Duck Alerts per year',
        'Premium placement'
      ],
      color: 'from-duck-500 to-orange-500',
      popular: false
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Handle signup logic here
      console.log('Business signup:', { ...formData, plan: selectedPlan })
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-duck-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Partner with MyDuckRewards</h2>
          <p className="text-gray-600">Drive traffic and boost sales with our gamified platform</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-duck-100 rounded-full text-sm font-medium text-duck-800">
            🎉 First 3 months FREE!
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-600">
              {step === 1 ? 'Choose Plan' : step === 2 ? 'Business Info' : 'Account Setup'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-duck-500 h-2 rounded-full"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatedCard>
          <div className="p-8">
            {step === 1 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Membership Plan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {membershipPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-duck-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlan(plan.id as any)}
                      whileHover={{ scale: 1.02 }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="bg-duck-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-500 mb-4">{plan.price} Billing</p>
                        
                        <ul className="space-y-2 text-sm text-gray-600 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle size={16} className="text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                          selectedPlan === plan.id
                            ? 'border-duck-500 bg-duck-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan === plan.id && (
                            <CheckCircle size={14} className="text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Business Information</h3>
                
                <form className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="Your Business Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="retail">Retail Store</option>
                      <option value="services">Services</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="automotive">Automotive</option>
                      <option value="health">Health & Wellness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                          placeholder="business@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="Detroit"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        required
                      >
                        <option value="">State</option>
                        <option value="MI">Michigan</option>
                        <option value="OH">Ohio</option>
                        <option value="IN">Indiana</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="48201"
                        required
                      />
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Create Your Account</h3>
                
                <form className="space-y-6">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 transition-colors"
                        placeholder="Create a secure password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-duck-600 focus:ring-duck-500 border-gray-300 rounded mt-1"
                        required
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                        I agree to the{' '}
                        <Link to="/terms" className="text-duck-600 hover:text-duck-700 font-medium">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-duck-600 hover:text-duck-700 font-medium">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        id="wantsMarketing"
                        name="wantsMarketing"
                        type="checkbox"
                        checked={formData.wantsMarketing}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-duck-600 focus:ring-duck-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="wantsMarketing" className="ml-2 block text-sm text-gray-700">
                        Send me partnership updates and marketing insights
                      </label>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <AnimatedButton
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </AnimatedButton>
              )}
              
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => handleSubmit({} as React.FormEvent)}
                icon={step === 3 ? <Building size={20} /> : undefined}
              >
                {step === 3 ? 'Create Partnership' : 'Continue'}
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Sign In Link */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-duck-600 hover:text-duck-700 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default BusinessSignup