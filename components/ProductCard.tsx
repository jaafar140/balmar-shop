import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden block">
      {product.isPromoted && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
          SPONSORISÉ
        </span>
      )}
      
      <div className="aspect-[4/5] overflow-hidden relative bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        />
        <button className="absolute bottom-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-red-500 transition">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 pr-2">{product.title}</h3>
          <span className="font-bold text-majorelle whitespace-nowrap">{product.price} MAD</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <span>{product.category}</span>
          <span>•</span>
          <span>{product.condition.split(' ')[0]}...</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
          <div className="flex items-center gap-1.5">
            {product.aiVerified && (
              <ShieldCheck className="w-3 h-3 text-mint" />
            )}
            <span className="text-xs text-gray-600 truncate max-w-[80px]">{product.sellerName}</span>
          </div>
          <span className="text-[10px] text-gray-400">
             {product.sellerScore}% fiable
          </span>
        </div>
      </div>
    </Link>
  );
};