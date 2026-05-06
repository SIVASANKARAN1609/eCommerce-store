import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  productId: string;
  initialRating?: number;
  readOnly?: boolean;
}

export function StarRating({ productId, initialRating = 0, readOnly = false }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (!readOnly) {
      const savedRatings = JSON.parse(localStorage.getItem('shopvibe_ratings') || '{}');
      if (savedRatings[productId]) {
        setRating(savedRatings[productId]);
      }
    }
  }, [productId, readOnly]);

  const handleRating = (value: number) => {
    if (readOnly) return;
    setRating(value);
    
    const savedRatings = JSON.parse(localStorage.getItem('shopvibe_ratings') || '{}');
    savedRatings[productId] = value;
    localStorage.setItem('shopvibe_ratings', JSON.stringify(savedRatings));
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110 active:scale-90`}
          disabled={readOnly}
          data-testid={`button-star-${star}`}
        >
          <Star 
            className={`w-5 h-5 ${
              star <= (hover || rating) 
                ? 'fill-yellow-500 text-yellow-500' 
                : 'text-muted-foreground'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}