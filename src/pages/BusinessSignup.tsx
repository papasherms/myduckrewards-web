import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Building, User, Mail, Lock, Phone, MapPin, Globe, Eye, EyeOff, CheckCircle, AlertCircle, Briefcase } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import { useAuth } from '../contexts/AuthContext'
import { createBusiness } from '../lib/supabase'
import usePageTitle from '../hooks/usePageTitle'

const BusinessSignup: React.FC = () => {
  usePageTitle('Business Sign Up')
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'trade' | 'custom'>('trade')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Final step - create account
      setLoading(true)
      setError('')
      
      try {
        // Step 1: Sign up the user
        const signUpResult = await signUp(formData.email, formData.password, 'business', {
          first_name: formData.contactName.split(' ')[0] || '',
          last_name: formData.contactName.split(' ').slice(1).join(' ') || '',
          phone: formData.phone,
          zip_code: formData.zipCode
        })

        if (signUpResult.error) {
          throw signUpResult.error
        }

        if (signUpResult.data?.user) {
          // Step 2: Create the business record
          const businessResult = await createBusiness({
            user_id: signUpResult.data.user.id,
            business_name: formData.businessName,
            business_type: formData.businessType,
            contact_name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            membership_tier: selectedPlan,
            membership_start_date: new Date().toISOString().split('T')[0], // Just date, no time
            membership_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months free
            duck_alerts_remaining: selectedPlan === 'custom' ? 4 : selectedPlan === 'trade' ? 2 : 1,
            is_active: true
          })

          if (businessResult.error) {
            throw businessResult.error
          }

          // Success - redirect to sign in
          navigate('/signin?registered=true&type=business')
        }
      } catch (err: any) {
        console.error('Business signup error:', err)
        setError(err.message || 'Failed to create account. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-duck-50 dark:from-blue-900/20 dark:to-duck-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Partner with MyDuckRewards</h2>
          <p className="text-gray-600 dark:text-gray-400">Drive traffic and boost sales with our gamified platform</p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-duck-100 rounded-full text-sm font-medium text-duck-800">
            🎉 First 3 months FREE!
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 3</span>
            <span className="text-sm text-gray-600">
              {step === 1 ? 'Choose Plan' : step === 2 ? 'Business Info' : 'Account Setup'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-duck-500 h-2 rounded-full"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatedCard>
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start"
              >
                <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                <div className="text-red-700 dark:text-red-400 text-sm">{error}</div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Membership Plan</h3>
                
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
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.price} Billing</p>
                        
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Business Information</h3>
                
                <form className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Your Business Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type
                    </label>
                    <div className="relative">
                      <Briefcase size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white transition-colors appearance-none"
                        required
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                        }}
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
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Person
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="business@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Detroit"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white transition-colors appearance-none"
                          required
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                          }}
                        >
                          <option value="">Select state</option>
                          <option value="MI">Michigan</option>
                          <option value="OH">Ohio</option>
                          <option value="IN">Indiana</option>
                          <option value="IL">Illinois</option>
                          <option value="WI">Wisconsin</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="NY">New York</option>
                          {/* Add more states as needed */}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Your Account</h3>
                
                <form className="space-y-6">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
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
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
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
                      <label htmlFor="wantsMarketing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Send me partnership updates and marketing insights
                      </label>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Navigation */}
            <form onSubmit={handleSubmit}>
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
                  icon={step === 3 ? <Building size={20} /> : undefined}
                  disabled={loading || (step === 3 && !formData.agreeToTerms)}
                >
                  {loading ? 'Creating Account...' : step === 3 ? 'Create Partnership' : 'Continue'}
                </AnimatedButton>
              </div>
            </form>
          </div>
        </AnimatedCard>

        {/* Sign In Link */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
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