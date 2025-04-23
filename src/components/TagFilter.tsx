import React from 'react';
import { Group, Chip, Text, Box } from '@mantine/core';
import { Tag } from 'lucide-react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ 
  allTags, 
  selectedTags, 
  onTagsChange 
}) => {
  return (
    <Box>
      <Group align="center" mb={5}>
        <Tag size={14} />
        <Text size="sm" fw={500}>Filter by Tags</Text>
      </Group>
      
      <Chip.Group 
        multiple 
        value={selectedTags} 
        onChange={onTagsChange}
      >
        <Group>
          {allTags.map(tag => (
            <Chip 
              key={tag} 
              value={tag} 
              radius="sm" 
              size="xs"
              className="transition-all duration-200"
            >
              {tag}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Box>
  );
};

export default TagFilter;