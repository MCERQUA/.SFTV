"use client";

interface CompanyPageProps {
  params: {
    slug: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header/Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Company Name
              </h1>
              <p className="text-gray-600 mb-4">
                Company description and tagline goes here
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 Location</span>
                <span>📞 Phone</span>
                <span>🌐 Website</span>
                <span>📺 X Videos</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Contact Company
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Videos */}
          <div className="lg:col-span-2">
            {/* Featured Video */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Video</h2>
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </section>

            {/* Company Videos Grid */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">All Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video placeholders */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Video Title</h3>
                      <p className="text-sm text-gray-600">Video description</p>
                      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <span>👁️ Views</span>
                        <span>📅 Date</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Company Info */}
          <div className="space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 text-sm mb-4">
                Detailed company description and information goes here.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Founded:</span>
                  <span className="text-gray-900">Year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employees:</span>
                  <span className="text-gray-900">Size</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialty:</span>
                  <span className="text-gray-900">Services</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span>📍</span>
                  <span className="text-gray-600">Address</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <span className="text-gray-600">Phone</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-gray-600">Email</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🌐</span>
                  <span className="text-gray-600">Website</span>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {['Location 1', 'Location 2', 'Location 3'].map((location) => (
                  <span key={location} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Service 1</li>
                <li>• Service 2</li>
                <li>• Service 3</li>
                <li>• Service 4</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}