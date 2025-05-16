import React from "react";
import { Group, Text, Box, Switch } from "@mantine/core";
import { Tag } from "lucide-react";

interface TagFilterProps {
  checked: boolean;
  onStarredSet: (isSet: boolean) => void;
}

const StarredFilter: React.FC<TagFilterProps> = ({ checked, onStarredSet }) => {
  return (
    <Box>
      <Group align="center" mb={5}>
        <Tag size={14} />
        <Text size="sm" fw={500}>
          Filter by 👍
        </Text>
      </Group>

      <Switch
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        checked={checked}
        onChange={(event) => onStarredSet(event.currentTarget.checked)}
      />
    </Box>
  );
};

export default StarredFilter;
