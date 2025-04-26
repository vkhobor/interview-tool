import React, { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { QuestionWithState } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import "@antonz/codapi/dist/snippet.js";
import { Accordion, Badge, Box, Checkbox, Group, Text, Textarea } from "@mantine/core";

interface QuestionItemProps {
  question: QuestionWithState;
  onToggleAsked: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer);

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onToggleAsked, onToggleExpanded, onNotesChange }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current!.value = question.notes;
  }, [question]);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAsked(question.id);
  };

  const handleAccordionClick = () => {
    onToggleExpanded(question.id);
  };

  const debouncedNotesChange = React.useCallback(
    debounce((id: string, value: string) => {
      onNotesChange(id, value);
    }, 1000),
    [],
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    debouncedNotesChange(question.id, event.currentTarget.value);
  };

  return (
    <Accordion.Item
      value={question.id}
      className={`transition-all duration-200 ${question.isAsked ? "bg-gray-50" : ""}`}
    >
      <Accordion.Control onClick={handleAccordionClick}>
        <Group justify="space-between" pl={3} pr={15}>
          <Group>
            <Checkbox
              checked={question.isAsked}
              onChange={() => {}}
              onClick={handleCheckboxClick}
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

          <Group gap="md">
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
          {question.body && <MemoizedMarkdownRenderer content={question.body} />}

          <Textarea
            placeholder="Add notes about the candidate's response..."
            minRows={3}
            autosize={true}
            mt={question.body ? 17 : 0}
            ref={inputRef}
            defaultValue=""
            onChange={handleNotesChange}
          />
        </Box>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default QuestionItem;
