import { Accordion, Badge, Box, Checkbox, Group, Textarea, Text } from "@mantine/core";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { QuestionWithState } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

const QuestionPanel: React.FC<{
  question: QuestionWithState;
  onNotesChange: (id: string, notes: string) => void;
  onToggleAsked: (id: string) => void;
  onToggleExpanded: (id: string) => void;
}> = ({ question, onNotesChange, onToggleAsked, onToggleExpanded }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current!.value = question.notes;
  }, [question]);

  const debouncedNotesChange = React.useCallback(
    debounce((id: string, value: string) => {
      onNotesChange(id, value);
    }, 1000),
    [],
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    debouncedNotesChange(question.id, event.currentTarget.value);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleAsked(question.id);
  };

  const handleAccordionClick = () => {
    onToggleExpanded(question.id);
  };

  console.log("QuestionPanel rendered ", question.id);

  return (
    <>
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
          {question.body && <MarkdownRenderer content={question.body} />}

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
    </>
  );
};

const PanelMemoized = React.memo(QuestionPanel, (prevProps, nextProps) => {
  return (
    prevProps.question.id === nextProps.question.id &&
    prevProps.question.isAsked === nextProps.question.isAsked &&
    prevProps.question.isExpanded === nextProps.question.isExpanded &&
    prevProps.question.notes === nextProps.question.notes
  );
});

export default PanelMemoized;
