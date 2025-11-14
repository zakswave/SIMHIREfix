import React from 'react';
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ApplyButton from './ApplyButton';

interface InternshipCardProps {
  id: string;
  company: {
    name: string;
    logo?: string;
    location: string;
  };
  position: string;
  duration: string;
  salary?: string;
  isPaid: boolean;
  description: string;
  tags: string[];
  postedDate: string;
  isBookmarked?: boolean;
  onApply: (id: string) => void;
  onBookmark: (id: string) => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  id,
  company,
  position,
  duration,
  salary,
  isPaid,
  description,
  tags,
  postedDate,
  isBookmarked = false,
  onApply,
  onBookmark,
}) => {
  return (
    <Card className="card-hover transition-all duration-300 hover:shadow-hover animate-scale-in">
      <CardContent className="p-6">
        {}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={company.logo} alt={company.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Building2 className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                {position}
              </h3>
              <p className="text-muted-foreground font-medium">{company.name}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {company.location}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(id)}
            className={isBookmarked ? 'text-warning' : 'text-muted-foreground'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </Badge>

          {isPaid ? (
            <Badge variant="outline" className="flex items-center text-success border-success/30 bg-success/10">
              <DollarSign className="w-3 h-3 mr-1" />
              {salary || 'Berbayar'}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Tidak Berbayar
            </Badge>
          )}

          <Badge variant="outline" className="text-xs text-muted-foreground">
            {postedDate}
          </Badge>
        </div>

        {}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-accent/50 text-accent-foreground"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 3} lagi
            </Badge>
          )}
        </div>

        {}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Detail
          </Button>

          <ApplyButton
            internship={{
              id,
              position,
              company,
              location: company.location,
              salary,
              isPaid
            }}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InternshipCard;
