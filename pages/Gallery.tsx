import React, { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, User, Tag, X } from 'lucide-react';
import { GalleryService, GalleryItem } from '../services/galleryService';

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const loadItems = async () => {
      const approvedItems = await GalleryService.getApprovedItems();
      setItems(approvedItems);
    };
    loadItems();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    author: '',
    image: null as File | null
  });

  const resizeImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      resizeImage(file, (resizedDataUrl) => {
        setPreviewUrl(resizedDataUrl);
        setFormData({ ...formData, image: file });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image || !previewUrl) return;

    try {
      await GalleryService.addItem({
        image: previewUrl,
        title: formData.title,
        location: formData.location,
        description: formData.description,
        author: formData.author,
        date: new Date().toISOString().split('T')[0],
        tags: ["Community Upload"]
      });

      setIsUploadModalOpen(false);
      
      // Reset form
      setFormData({
        title: '',
        location: '',
        description: '',
        author: '',
        image: null
      });
      setPreviewUrl(null);
      
      alert("Thank you! Your photo has been submitted for review. It will appear in the gallery once approved.");
    } catch (error: any) {
      console.error("Failed to add gallery item:", error);
      alert(`Failed to upload photo. Error: ${error.message || 'Unknown error'}. If you are in the preview environment, this is expected because the database is not connected.`);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-mh-dark mb-4">
              Field <span className="text-mh-green">Gallery</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              See how COREQ SOLUTIONS NZ products are making a difference in the real world. 
              Browse stories from our community or share your own experience.
            </p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-mh-green text-mh-dark px-6 py-3 rounded-full font-bold hover:bg-mh-accent transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <Camera className="w-5 h-5" />
            Share Your Story
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(items) && items.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mh-green" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {item.tags?.map((tag, idx) => (
                    <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-mh-dark mb-2 group-hover:text-mh-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />
                    {item.author}
                  </div>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-mh-dark">Share Your Experience</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-mh-dark">Photo Upload</label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${previewUrl ? 'border-mh-green bg-mh-green/5' : 'border-slate-300 hover:border-mh-green'}`}>
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                      <button 
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData({...formData, image: null});
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-slate-400" />
                      <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-mh-dark">Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Apple Harvest with SB7500"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green focus:ring-2 focus:ring-mh-green/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-mh-dark">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Hawke's Bay"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green focus:ring-2 focus:ring-mh-green/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-mh-dark">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green focus:ring-2 focus:ring-mh-green/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-mh-dark">Your Name</label>
                <input 
                  type="text" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mh-green focus:ring-2 focus:ring-mh-green/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-mh-green text-mh-dark py-4 rounded-xl font-bold text-lg hover:bg-mh-accent transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Post to Gallery
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By posting, you agree to share this image and content on our public gallery.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
