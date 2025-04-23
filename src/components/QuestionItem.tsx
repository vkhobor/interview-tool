import React from "react";
import { Accordion, Checkbox, Group, Text, Box, Badge, Textarea } from "@mantine/core";
import { debounce } from "lodash";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { QuestionWithState } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface QuestionItemProps {
  question: QuestionWithState;
  onToggleAsked: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onToggleAsked, onToggleExpanded, onNotesChange }) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAsked(question.id);
  };

  const handleAccordionClick = () => {
    onToggleExpanded(question.id);
  };

  const debouncedNotesChange = debounce((id: string, value: string) => {
    onNotesChange(id, value);
  }, 300);

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    debouncedNotesChange(question.id, event.currentTarget.value);
  };

  return (
    <Accordion.Item
      value={question.id}
      className={`transition-all duration-200 ${question.isAsked ? "bg-gray-50" : ""}`}
    >
      <Accordion.Control
        onClick={handleAccordionClick}
        icon={question.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      >
        <Group position="apart">
          <Group>
            <Checkbox
              checked={question.isAsked}
              onChange={() => {}}
              onClick={handleCheckboxClick}
              icon={Check}
              color="green"
              className="transition-transform duration-200"
              styles={{
                input: {
                  cursor: "pointer",
                  transform: question.isAsked ? "scale(1.1)" : "scale(1)",
                },
              }}
            />
            <Text
              style={{
                textDecoration: question.isAsked ? "line-through" : "none",
                opacity: question.isAsked ? 0.7 : 1,
              }}
            >
              {question.title}
            </Text>
          </Group>

          <Group spacing={5}>
            {question.tags.map((tag) => (
              <Badge key={tag} size="sm" variant="outline" color="blue" style={{ opacity: question.isAsked ? 0.7 : 1 }}>
                {tag}
              </Badge>
            ))}
          </Group>
        </Group>
      </Accordion.Control>

      <Accordion.Panel>
        <Box className="transition-all duration-300" style={{ opacity: question.isExpanded ? 1 : 0.9 }}>
          <MarkdownRenderer content={question.body} />

          <Textarea
            placeholder="Add notes about the candidate's response..."
            minRows={3}
            mt="md"
            onChange={handleNotesChange}
          />
        </Box>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default QuestionItem;
