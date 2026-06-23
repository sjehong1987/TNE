import React, { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, User, Tag, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { GalleryService, GalleryItem } from '../services/galleryService';

const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Enlarged View Modal State
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
    images: [] as File[]
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
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        callback(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      let processed = 0;

      const checkCompletion = () => {
        processed++;
        if (processed === files.length) {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
          setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
      };

      files.forEach((file) => {
        // Prevent huge files from crashing the data URL converter or database
        if (file.size > 15 * 1024 * 1024) {
          alert(`File ${file.name} is too large (max 15MB). Skipping.`);
          checkCompletion();
          return;
        }

        // Skip resize for videos
        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newPreviews.push(e.target.result as string);
              newFiles.push(file);
              checkCompletion();
            }
          };
          reader.readAsDataURL(file);
        } else {
          resizeImage(file, (resizedDataUrl) => {
            newPreviews.push(resizedDataUrl);
            newFiles.push(file);
            checkCompletion();
          });
        }
      });
    }
  };

  const removePreview = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (previewUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      await GalleryService.addItem({
        image: previewUrls[0],
        images: previewUrls,
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
        images: []
      });
      setPreviewUrls([]);
      
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
              {/* Image/Video Container */}
              <div 
                className="relative h-64 overflow-hidden cursor-pointer bg-slate-100 flex items-center justify-center" 
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentImageIndex(0);
                }}
              >
                {(item.image && (item.image.startsWith('data:video/') || item.image.match(/\.(mp4|webm|ogg)$/i))) ? (
                  <video 
                    src={item.image} 
                    className="w-full h-full object-contain bg-black transition-transform duration-700 group-hover:scale-105"
                    muted 
                    playsInline 
                  />
                ) : (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {item.images && item.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
                    1 / {item.images.length}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                  <span className="text-white font-medium flex items-center gap-2 drop-shadow-md">
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
                <label className="block text-sm font-bold text-mh-dark">Photo Upload (Multiple Allowed)</label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${previewUrls.length > 0 ? 'border-mh-green bg-mh-green/5' : 'border-slate-300 hover:border-mh-green'}`}>
                  {previewUrls.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {previewUrls.map((url, idx) => {
                          const isVideo = url && (url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i));
                          return (
                           <div key={idx} className="relative group">
                             {isVideo ? (
                               <video src={url} className="h-32 w-32 object-cover bg-black border border-slate-200 mx-auto rounded-lg shadow-md" />
                             ) : (
                               <img src={url} alt={`Preview ${idx + 1}`} className="h-32 w-32 object-contain bg-white border border-slate-200 mx-auto rounded-lg shadow-md" />
                             )}
                             <button
                               type="button"
                               onClick={() => removePreview(idx)}
                               className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                             >
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                          );
                        })}
                      </div>
                      <label className="inline-flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add More Files
                        <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 relative">
                      <Upload className="w-10 h-10 text-slate-400" />
                      <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400">Images or Videos (max. 10MB recommended). Multiple allowed.</p>
                      <input 
                        type="file" 
                        accept="image/*,video/*"
                        multiple
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
      {/* Enlarged View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
             onClick={(e) => {
               if (e.target === e.currentTarget) setSelectedItem(null);
             }}>
          <div className="relative w-full max-w-6xl bg-transparent flex flex-col md:flex-row gap-6 max-h-[90vh]">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-mh-green transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Image/Video Carousel */}
            <div className="flex-1 relative flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden aspect-video md:aspect-auto min-h-[400px]">
              {(() => {
                const url = (selectedItem.images && selectedItem.images.length > 0) ? selectedItem.images[currentImageIndex] : selectedItem.image;
                const isVideo = url && (url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i));
                if (isVideo) {
                  return (
                    <video 
                      src={url} 
                      controls 
                      className="max-w-full max-h-full object-contain"
                      autoPlay
                    />
                  );
                }
                return (
                  <img 
                    src={url} 
                    alt={selectedItem.title} 
                    className="max-w-full max-h-full object-contain"
                  />
                );
              })()}
              
              {selectedItem.images && selectedItem.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev === 0 ? selectedItem.images!.length - 1 : prev - 1);
                    }}
                    className="absolute left-4 bg-black/50 text-white p-3 rounded-full hover:bg-mh-green hover:text-mh-dark transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev === selectedItem.images!.length - 1 ? 0 : prev + 1);
                    }}
                    className="absolute right-4 bg-black/50 text-white p-3 rounded-full hover:bg-mh-green hover:text-mh-dark transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedItem.images.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-mh-green w-8' : 'bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Details Panel */}
            <div className="w-full md:w-96 bg-white rounded-2xl p-8 flex flex-col shadow-2xl flex-shrink-0 md:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {selectedItem.tags?.map((tag, idx) => (
                  <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-bold text-mh-dark mb-4">{selectedItem.title}</h3>
              <div className="flex items-center gap-2 text-mh-green mb-8 font-medium">
                <MapPin className="w-5 h-5" />
                {selectedItem.location}
              </div>
              
              <div className="prose prose-slate flex-1">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedItem.description}</p>
              </div>
              
              <div className="border-t border-slate-100 pt-6 mt-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Author</span>
                  <div className="flex items-center gap-2 text-mh-dark font-bold">
                    <User className="w-4 h-4 text-mh-green" />
                    {selectedItem.author}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date</span>
                  <span className="font-bold text-slate-700">{selectedItem.date}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
