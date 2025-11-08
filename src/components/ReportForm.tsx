import { useEffect, useState } from 'react';
import { MapPin, Camera, Send, Loader, AlertTriangle } from 'lucide-react';
import { Report } from '../types';
import { getCurrentLocation, getDemoLocation, reverseGeocode } from '../utils/geocoding';
import { checkWeather, isRainyHazard } from '../utils/weather';

interface ReportFormProps {
  onSubmit: (report: Report) => void;
  currentUserName: string;
  currentUserEmail: string;
  isDark: boolean;
}

const issueTypes = [
  { value: 'pothole', label: 'Pothole / Road Damage', icon: '🕳️' },
  { value: 'streetlight', label: 'Broken Streetlight', icon: '💡' },
  { value: 'water-leak', label: 'Water Leakage', icon: '💧' },
  { value: 'waste', label: 'Illegal Waste Dumping', icon: '🗑️' },
  { value: 'manhole', label: 'Open Manhole / Safety Hazard', icon: '⚠️' }
];

export default function ReportForm({ onSubmit, currentUserName, currentUserEmail, isDark }: ReportFormProps) {
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'success' | 'fallback'>('pending');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureLocation = async (showAlerts = false) => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      setLocationStatus('success');
      if (showAlerts) {
        alert('Location captured successfully!');
      }
    } catch (error: any) {
      let userMsg = '';
      if (error.code === 1) {
        userMsg = 'Location access denied. Please allow location permissions and try again.';
      } else if (error.code === 2) {
        userMsg = 'Position unavailable. Please check your device location settings.';
      } else if (error.code === 3) {
        userMsg = 'Location detection timed out. Move outdoors or check device settings.';
      } else {
        userMsg = 'Unable to fetch your location. Using demo coordinates.';
      }
      const loc = getDemoLocation();
      setLocation(loc);
      setLocationStatus('fallback');
      if (showAlerts) {
        alert(`${userMsg} Demo location used for this report.`);
      }
    }
  };

  useEffect(() => {
    captureLocation();
  }, []);

  const handleGetLocation = async () => {
    await captureLocation(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueType || !title.trim() || !description.trim() || !image) {
      alert('Please fill in all required fields (Photo now required)');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalLocation = location || getDemoLocation();
      const address = await reverseGeocode(finalLocation.lat, finalLocation.lng);
      const weather = await checkWeather(finalLocation.lat, finalLocation.lng);
      const isHazard = isRainyHazard(issueType, weather);

      const report: Report = {
        id: Date.now().toString(),
        type: issueType as Report['type'],
        title: title.trim(),
        description: description.trim(),
        location: {
          lat: finalLocation.lat,
          lng: finalLocation.lng,
          address
        },
        status: 'pending',
        priority: isHazard ? 'critical' : issueType === 'manhole' ? 'high' : 'medium',
        imageUrl: image || undefined,
        isRainyHazard: isHazard,
        reportedBy: currentUserName,
        reportedByEmail: currentUserEmail,
        reportedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        votedBy: [],
        comments: [],
        views: 0,
        shareCount: 0,
        tags: [issueType]
      };

      onSubmit(report);

      setIssueType('');
      setTitle('');
      setDescription('');
      setImage(null);
      setLocation(null);

      alert('Report submitted successfully!');
    } catch (error) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Report an Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Issue Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {issueTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setIssueType(type.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  issueType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Issue Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Brief description of the issue"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Detailed Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Provide detailed information about the issue..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Add Photo *
            </label>
            <label
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                isDark
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <Camera className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {image ? 'Change Photo' : 'Upload Photo'}
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Location
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                location
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">{location ? 'Location Set' : 'Get Location'}</span>
            </button>
            <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {locationStatus === 'pending' && 'Detecting your current location...'}
              {locationStatus === 'success' && 'Using your live location for this report.'}
              {locationStatus === 'fallback' && 'Live location unavailable; a demo location is being used.'}
            </p>
          </div>
        </div>

        {image && (
          <div className="relative rounded-lg overflow-hidden">
            <img src={image} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Report</span>
            </>
          )}
        </button>

        <div className={`flex items-start space-x-2 p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            Your report will be reviewed by local authorities. Critical issues (especially during rain) are prioritized
            automatically.
          </p>
        </div>
      </form>
    </div>
  );
}
