import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, Award, MapPin, Users, Zap, CheckCircle } from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedButton from '../components/AnimatedButton'

const About: React.FC = () => {
  const features = [
    {
      icon: <Target size={32} className="text-duck-500" />,
      title: "100% Win Rate",
      description: "Every play guarantees a win - you always get a duck!",
      emoji: "🎯"
    },
    {
      icon: <MapPin size={32} className="text-blue-500" />,
      title: "Location-Based Rewards",
      description: "Rewards are location-specific within a 5-mile radius",
      emoji: "📍"
    },
    {
      icon: <Award size={32} className="text-orange-500" />,
      title: "Instant + Future Value",
      description: "Both instant gratification and future savings",
      emoji: "🏆"
    },
    {
      icon: <Heart size={32} className="text-red-500" />,
      title: "Community Support",
      description: "Supports local businesses with targeted marketing",
      emoji: "❤️"
    }
  ]

  const timeline = [
    {
      phase: "Phase 1",
      title: "Southeast Michigan Launch",
      description: "Starting at all Leo's locations across Southeast Michigan",
      icon: "🏪",
      color: "from-duck-500 to-duck-600"
    },
    {
      phase: "Phase 2", 
      title: "Entertainment Venues",
      description: "Expanding to movie theaters, concerts, and sporting events",
      icon: "🎬",
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: "Phase 3",
      title: "Regional Expansion", 
      description: "State fairs and other high-traffic community events",
      icon: "🎡",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-duck-400 via-duck-500 to-orange-500 text-white py-20 lg:py-32">
        {/* Animated Background Elements */}
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
            <div className="text-8xl mb-6">🦆</div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              About MyDuckRewards
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-duck-100 max-w-3xl mx-auto leading-relaxed">
              Bringing communities together through gamified rewards and meaningful connections
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Mission 🎯
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              MyDuckRewards (MDR) is a revolutionary marketing company that combines the excitement 
              of claw machine games with valuable local business rewards. Our unique approach gives 
              customers both instant gratification and long-term savings opportunities.
            </p>
          </motion.div>

          <AnimatedCard className="p-8 lg:p-12 text-center bg-gradient-to-br from-duck-50 to-blue-50 border-2 border-duck-200">
            <div className="text-6xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Creating Meaningful Connections
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We connect consumers and local businesses through innovative, engaging reward systems 
              that benefit entire communities. Using our customized claw machines and collectible ducks, 
              we capture customer engagement while delivering real value through our "Duck off your Bill" program.
            </p>
          </AnimatedCard>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How We're Different ✨
            </h2>
            <p className="text-xl text-gray-600">
              What sets MyDuckRewards apart from traditional marketing platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={index * 0.2} direction="up">
                <div className="p-6 text-center h-full">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg border-2 border-gray-100">
                      {feature.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl">{feature.emoji}</div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Expansion Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Expansion Journey 🗺️
            </h2>
            <p className="text-xl text-gray-600">
              From Southeast Michigan to nationwide presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {timeline.map((item, index) => (
              <AnimatedCard key={index} delay={index * 0.3} direction="up">
                <div className="p-8 text-center relative">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-duck-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.phase}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-duck-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values 💫
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedCard className="p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-duck-500 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe in strengthening local communities by connecting neighbors with 
                    local businesses and creating shared experiences.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8" delay={0.2}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fair & Transparent</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every play wins, every business gets value, and every customer saves money. 
                    No hidden fees, no false promises.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8" delay={0.1}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Zap size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation Driven</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We constantly evolve our platform with new features, better technology, 
                    and creative ways to surprise and delight our users.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8" delay={0.3}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Heart size={24} className="text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fun & Meaningful</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We make saving money enjoyable while creating real value for businesses 
                    and genuine savings for customers.
                  </p>
                </div>
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
              Ready to Join Our Story? 🚀
            </h2>
            <p className="text-xl mb-10 text-duck-100 max-w-2xl mx-auto">
              Whether you're a customer looking for fun savings or a business ready to grow, 
              we'd love to have you as part of the MyDuckRewards community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton variant="secondary" size="xl">
                Start Playing
              </AnimatedButton>
              <AnimatedButton variant="outline" size="xl">
                Become a Partner
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About