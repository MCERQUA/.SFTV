"use client";

interface CompanyPageProps {
  params: {
    slug: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Company Header/Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-muted rounded-lg"></div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Company Name
              </h1>
              <p className="text-muted-foreground mb-4">
                Company description and tagline goes here
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>📍 Location</span>
                <span>📞 Phone</span>
                <span>🌐 Website</span>
                <span>📺 X Videos</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Contact Company
              </button>
              <button className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-accent">
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
              <h2 className="text-xl font-bold text-foreground mb-4">Featured Video</h2>
              <div className="aspect-video bg-muted rounded-lg"></div>
            </section>

            {/* Company Videos Grid */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">All Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video placeholders */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">Video Title</h3>
                      <p className="text-sm text-muted-foreground">Video description</p>
                      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
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
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">About</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Detailed company description and information goes here.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded:</span>
                  <span className="text-foreground">Year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees:</span>
                  <span className="text-foreground">Size</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="text-foreground">Services</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span>📍</span>
                  <span className="text-muted-foreground">Address</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <span className="text-muted-foreground">Phone</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-muted-foreground">Email</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🌐</span>
                  <span className="text-muted-foreground">Website</span>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {['Location 1', 'Location 2', 'Location 3'].map((location) => (
                  <span key={location} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
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