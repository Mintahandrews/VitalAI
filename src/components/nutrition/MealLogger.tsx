import { useState, useEffect } from 'react';
import { X, Camera, Search, Loader } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Meal } from '../../types/nutrition';

interface MealLoggerProps {
  onSave: (meal: Meal) => void;
  onClose: () => void;
}

const FOOD_EMOJIS = ['🥗', '🍎', '🥑', '🍗', '🥩', '🍚', '🥪', '🥣', '🍜', '🥘'];

const MealLogger = ({ onSave, onClose }: MealLoggerProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [sugar, setSugar] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Debounced food search
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchFoodDatabase(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchFoodDatabase = async (query: string) => {
    setIsSearching(true);
    try {
      // This is a mock API call - in a real app, you'd call your nutrition API
      const mockResults = [
        {
          name: 'Chicken Breast',
          nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
          emoji: '🍗'
        },
        {
          name: 'Brown Rice',
          nutrition: { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7 },
          emoji: '🍚'
        },
        {
          name: 'Avocado',
          nutrition: { calories: 240, protein: 3, carbs: 12, fat: 22, fiber: 10, sugar: 1 },
          emoji: '🥑'
        }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching food database:', error);
      toast.error('Failed to search food database');
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanBarcode = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error('No camera found');
      }

      const result = await codeReader.decodeFromInputVideoDevice(undefined, 'barcode-video');
      if (result) {
        // Mock barcode lookup - in a real app, you'd call your nutrition API
        const mockProduct = {
          name: 'Protein Bar',
          nutrition: {
            calories: 200,
            protein: 20,
            carbs: 25,
            fat: 8,
            fiber: 3,
            sugar: 2
          },
          emoji: '🍫'
        };

        setName(mockProduct.name);
        setEmoji(mockProduct.emoji);
        setCalories(mockProduct.nutrition.calories.toString());
        setProtein(mockProduct.nutrition.protein.toString());
        setCarbs(mockProduct.nutrition.carbs.toString());
        setFat(mockProduct.nutrition.fat.toString());
        setFiber(mockProduct.nutrition.fiber.toString());
        setSugar(mockProduct.nutrition.sugar.toString());
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast.error('Failed to scan barcode');
    } finally {
      codeReader.reset();
      setIsScanning(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setName(result.name);
    setEmoji(result.emoji);
    setCalories(result.nutrition.calories.toString());
    setProtein(result.nutrition.protein.toString());
    setCarbs(result.nutrition.carbs.toString());
    setFat(result.nutrition.fat.toString());
    setFiber((result.nutrition.fiber || 0).toString());
    setSugar((result.nutrition.sugar || 0).toString());
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) {
      toast.error('Please fill in required fields');
      return;
    }

    const meal: Meal = {
      id: uuidv4(),
      name,
      emoji,
      timestamp: Date.now(),
      nutrition: {
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        fiber: Number(fiber),
        sugar: Number(sugar),
      },
    };

    onSave(meal);
    toast.success('Meal logged successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Log Meal</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search and Barcode Scanner */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search food database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              {isSearching && (
                <div className="flex items-center justify-center py-4">
                  <Loader className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span>{result.emoji}</span>
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">
                          {result.nutrition.calories} kcal • {result.nutrition.protein}g protein
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleScanBarcode}
                className="flex items-center gap-2 w-full justify-center border border-gray-300 rounded-lg p-2 hover:bg-gray-50"
              >
                <Camera className="w-5 h-5" />
                Scan Barcode
              </button>
            </div>

            {isScanning && (
              <div className="relative aspect-video">
                <video id="barcode-video" className="w-full rounded-lg"></video>
              </div>
            )}

            {/* Meal Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiber (g)
                </label>
                <input
                  type="number"
                  value={fiber}
                  onChange={(e) => setFiber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sugar (g)
                </label>
                <input
                  type="number"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {FOOD_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-lg ${
                      emoji === e ? 'bg-indigo-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Meal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MealLogger;