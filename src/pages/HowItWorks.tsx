import React from 'react'
import { motion } from 'framer-motion'
import { Play, Smartphone, Gift, MapPin, QrCode, Star, Clock, ShoppingBag, Percent, CreditCard, Trophy, ArrowRight } from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedButton from '../components/AnimatedButton'
import { Link } from 'react-router-dom'

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      icon: <MapPin size={40} className="text-white" />,
      title: "Find a Machine",
      description: "Locate our bright yellow claw machines at Leo's stores throughout Southeast Michigan",
      color: "from-duck-500 to-duck-600",
      emoji: "🎯",
      details: "Our machines are strategically placed at high-traffic areas for maximum visibility"
    },
    {
      step: 2,
      icon: <Play size={40} className="text-white" />,
      title: "Play & Win",
      description: "Every play wins! Grab your collectible duck - each contains unique rewards and codes",
      color: "from-blue-500 to-blue-600",
      emoji: "🎮",
      details: "No skill required - our machines guarantee a win every single time you play"
    },
    {
      step: 3,
      icon: <QrCode size={40} className="text-white" />,
      title: "Scan Your Duck",
      description: "Use our mobile app to scan your duck's unique code and unlock your rewards",
      color: "from-orange-500 to-orange-600",
      emoji: "📱",
      details: "Each duck has a unique QR code that instantly reveals your prizes"
    },
    {
      step: 4,
      icon: <Gift size={40} className="text-white" />,
      title: "Redeem Rewards",
      description: "Enjoy instant rewards plus 'Duck off your Bill' discounts at nearby businesses",
      color: "from-green-500 to-green-600",
      emoji: "🎁",
      details: "Rewards are valid for up to 45 days and can be used at participating local businesses"
    }
  ]

  const instantRewards = [
    { icon: <Trophy size={24} className="text-duck-500" />, title: "Small Prizes", description: "Physical prizes or treats" },
    { icon: <Star size={24} className="text-orange-500" />, title: "Collectible Duck", description: "Keep your duck as a collectible" },
    { icon: <Gift size={24} className="text-blue-500" />, title: "Special Drawings", description: "Entry into exclusive contests" }
  ]

  const businessRewards = [
    { icon: <Percent size={24} className="text-green-500" />, title: "Percentage Off", description: "Save 10-50% on purchases" },
    { icon: <ShoppingBag size={24} className="text-purple-500" />, title: "BOGO Deals", description: "Buy-one-get-one offers" },
    { icon: <CreditCard size={24} className="text-red-500" />, title: "Free Items", description: "Complimentary products or services" },
    { icon: <Star size={24} className="text-indigo-500" />, title: "Memberships", description: "Special access and services" }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-duck-500 text-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-32 w-12 h-12 bg-white/10 rounded-full"
            animate={{ y: [0, 15, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-8xl mb-6">🎮</div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              How MyDuckRewards Works
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Simple, fun, and rewarding! Follow these easy steps to start saving money with your duck collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple as 1, 2, 3, 4! ✨
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started with MyDuckRewards in just four easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <AnimatedCard key={index} delay={index * 0.2} direction="up">
                <div className="p-8 text-center relative h-full">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl">{step.emoji}</div>
                    <div className="absolute -bottom-2 -left-2 bg-white border-2 border-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{step.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.details}</p>
                  
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside Each Duck */}
      <section className="py-20 bg-gradient-to-br from-duck-50 to-blue-50 dark:from-duck-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What's Inside Each Duck? 🦆
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Double the value with instant rewards and future savings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Instant Rewards */}
            <AnimatedCard className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-duck-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Instant Rewards</h3>
                <p className="text-gray-600 dark:text-gray-400">Get immediate value right away</p>
              </div>
              
              <div className="space-y-4">
                {instantRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{reward.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{reward.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>

            {/* Business Discounts */}
            <AnimatedCard className="p-8" delay={0.3}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Percent size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Discounts</h3>
                <p className="text-gray-600 dark:text-gray-400">"Duck off your Bill" savings</p>
              </div>
              
              <div className="space-y-4">
                {businessRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{reward.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{reward.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Important Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Good to Know 💡
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">45-Day Validity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Business discounts are valid for up to 45 days from when you win your duck</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">5-Mile Radius</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Discounts are redeemable at businesses within 5 miles of where you played</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-duck-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Mobile App Required</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Download our free app to scan ducks and manage your rewards</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-duck-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Collection? 🦆
            </h2>
            <p className="text-xl mb-10 text-duck-100 max-w-2xl mx-auto">
              Visit your nearest Leo's location and look for our bright yellow machines!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <AnimatedButton variant="secondary" size="xl" icon={<MapPin size={24} />}>
                  Find Locations
                </AnimatedButton>
              </Link>
              <Link to="/customer-signup">
                <AnimatedButton variant="outline" size="xl" icon={<Star size={24} />}>
                  Sign Up Now
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks