import "@antonz/codapi/dist/snippet.js";
import { Accordion } from "@mantine/core";
import React from "react";
import { QuestionWithState } from "../types";
import QuestionItemBody from "./QuestionItemBody";

interface QuestionItemProps {
  question: QuestionWithState;
  onToggleAsked: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}
const QuestionItem: React.FC<QuestionItemProps> = (props) => {
  const { question, onToggleAsked, onToggleExpanded, onNotesChange } = props;

  return (
    <Accordion.Item
      value={question.id}
      className={`${question.isHidden ? "hidden" : ""} transition-all duration-200 ${question.isAsked ? "bg-gray-50" : ""}`}
    >
      <QuestionItemBody
        question={question}
        onNotesChange={onNotesChange}
        onToggleAsked={onToggleAsked}
        onToggleExpanded={onToggleExpanded}
      />
    </Accordion.Item>
  );
};

export default QuestionItem;
