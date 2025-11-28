import CatalogPage from '@/components/CatalogPage'
import React, { Suspense } from 'react'
import { 
  BookOpen, 
  Download, 
  Video, 
  FileText, 
  Target, 
  TrendingUp, 
  Award, 
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  Music,
  Headphones,
  FileType
} from 'lucide-react'
import Link from 'next/link'

const resourceCategories = [
  {
    icon: Video,
    title: "Video Content",
    description: "Training videos, tutorials, webinars, and masterclasses",
    count: "20+ Videos",
    type: "video"
  },
  {
    icon: Headphones,
    title: "Audio Resources",
    description: "Podcasts, audio guides, and downloadable audio content",
    count: "15+ Audio",
    type: "audio"
  },
  {
    icon: FileType,
    title: "PDF Documents",
    description: "Templates, guides, worksheets, and comprehensive PDF resources",
    count: "30+ PDFs",
    type: "pdf"
  }
]

const popularResources = [
  {
    icon: FileText,
    title: "CV Builder Toolkit",
    description: "Expert templates, ATS-optimized formats, and job-winning examples",
    type: "Tool",
    featured: true
  },
  {
    icon: BookOpen,
    title: "Scholarship Application Guide",
    description: "Step-by-step strategies, SOP templates, and funding sources",
    type: "Guide",
    badge: "Most Popular"
  },
  {
    icon: Video,
    title: "Interview Masterclass",
    description: "Video tutorials covering behavioral, technical, and case interviews",
    type: "Video Series",
    featured: true
  },
  {
    icon: Target,
    title: "Career Roadmap Planner",
    description: "Goal-setting frameworks and actionable career transition plans",
    type: "Template"
  }
]

const ResourcesPage = () => {
  return (
    <main>
        <header className="mx-auto px-4 md:px-16 pt-20 pb-24 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#0D1140] to-[#1a237e] w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white pb-4 pt-20 leading-tight">
            Your Learning Resource Hub
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Get expert resources to accelerate your success across education, career, and business
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { label: "Total Resources", value: "65+" },
              { label: "Expert Guides", value: "30+" },
              { label: "Interactive Tools", value: "15+" },
              { label: "Video Tutorials", value: "20+" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Category Showcase */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Curated resources organized by your learning goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {resourceCategories.map((category, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
                    <category.icon className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{category.description}</p>
                  <div className="text-sm font-semibold text-blue-600">{category.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Download & Go</h3>
                <p className="text-slate-600">All resources available for offline use. Download once, learn anytime.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Expert-Validated</h3>
                <p className="text-slate-600">Every resource reviewed by industry professionals and academic experts.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Always Updated</h3>
                <p className="text-slate-600">Regularly refreshed content keeping pace with industry trends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <CatalogPage
          productType="Tools"
          title="All Resources"
          description="Browse our complete library of expert-curated learning materials"
        />
      </Suspense>
    </main>
  )
}

export default ResourcesPage