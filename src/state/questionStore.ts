import isEqual from "lodash/isEqual";
import { useComputed, useSignal } from "@preact/signals-react";
import { QuestionWithState } from "../types";
import { useCallback } from "react";

interface QuestionWithOnlyTagsAndId {
  id: string;
  tags: string[];
}

const memoizedQuestionsWithOnlyTagsAndIds =
  getMemoizedQuestionsWithOnlyTagsAndIds();

function getMemoizedQuestionsWithOnlyTagsAndIds() {
  let previous: QuestionWithOnlyTagsAndId[] | undefined = undefined;
  return (questions: QuestionWithState[]) => {
    const mapped = questions.map((q) => ({ tags: q.tags, id: q.id }));
    if (!previous || !isQuestionsEqual(previous, mapped)) {
      previous = mapped;
    }
    return previous;
  };
}

function isQuestionsEqual(
  a: QuestionWithOnlyTagsAndId[],
  b: QuestionWithOnlyTagsAndId[],
) {
  a.sort((_a, _b) => _a.id.localeCompare(_b.id));
  b.sort((_a, _b) => _a.id.localeCompare(_b.id));

  return isEqual(a, b);
}

export function useQuestionsStore(initial: {
  questions: QuestionWithState[];
  selectedTags: string[];
  isStarredFilterOn: boolean;
}) {
  const questions = useSignal(initial.questions);
  const selectedTags = useSignal(initial.selectedTags);
  const isStarredFilterOn = useSignal(initial.isStarredFilterOn);

  const questionsWithOnlyTagsAndIds = useComputed(() => {
    return memoizedQuestionsWithOnlyTagsAndIds(questions.value);
  });

  const allTags = useComputed(() => {
    return Array.from(
      new Set(questionsWithOnlyTagsAndIds.value.flatMap((q) => q.tags)),
    );
  });

  const groupedQuestionsWithOnlyTagsAndIds = useComputed(() => {
    const startTime = Date.now();
    const groups: Record<string, QuestionWithOnlyTagsAndId[]> = {};

    allTags.value.forEach((tag) => {
      groups[tag] = questionsWithOnlyTagsAndIds.value.filter((q) =>
        q.tags.includes(tag),
      );
    });
    const allGrouped = Object.values(groups).flat();
    groups["other"] = questionsWithOnlyTagsAndIds.value.filter(
      (x) => !allGrouped.includes(x),
    );
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });
    console.log("groupcalc duration:", Date.now() - startTime, "ms");
    return groups;
  });

  const groupedQuestions = useComputed(() => {
    const groups: Record<string, QuestionWithState[]> = {};
    const entries = Object.entries(groupedQuestionsWithOnlyTagsAndIds.value);
    const questions2 = questions.value;

    entries.forEach(([tag, questions]) => {
      groups[tag] = questions.map(
        (x) => questions2.find((y) => y.id == x.id) as QuestionWithState,
      );
    });
    return groups;
  });

  const filteredIds = useComputed(() => {
    const tagFilter = selectedTags.value;
    const starFilter = isStarredFilterOn.value;

    const allIds = questions.value
      .filter((x) => {
        let match = true;
        if (starFilter) {
          match = match && x.isStarred;
        }
        if (tagFilter.length > 0) {
          match = match && tagFilter.every((y) => x.tags.includes(y));
        }

        return match;
      })
      .map((x) => x.id);

    return allIds;
  });

  const filteredGroupedQuestions = useComputed<
    [Record<string, QuestionWithState[]>, string | undefined]
  >(() => {
    const filtered = filteredIds.value;

    const grouping = Object.entries(groupedQuestions.value).reduce(
      (acc, [tag, questions]) => {
        acc[tag] = questions
          .map((q) => ({
            ...q,
            isHidden: !filtered.includes(q.id),
          }))
          .sort((a) => (a.isHidden ? 1 : -1));
        return acc;
      },
      {} as Record<string, QuestionWithState[]>,
    );

    let numOfGroupsWithValues = 0;
    for (const group of Object.entries(grouping)) {
      let numPerGroup = 0;
      for (const item of group[1]) {
        if (!item.isHidden) numPerGroup++;
      }
      numOfGroupsWithValues += numPerGroup > 0 ? 1 : 0;
      if (numOfGroupsWithValues > 1) break;
    }

    const commonTagName =
      selectedTags.value.length == 1
        ? selectedTags.value[0]
        : selectedTags.value.join(", ");
    if (numOfGroupsWithValues == 1) return [grouping, commonTagName];
    else return [grouping, undefined];
  });

  const askedCount = useComputed(() => {
    return questions.value.filter((q) => q.isAsked).length;
  });

  const totalCount = useComputed(() => {
    return questions.value.length;
  });

  const progress = useComputed(() => {
    const total = totalCount.value;
    const asked = askedCount.value;
    return total > 0 ? Math.round((asked / total) * 100) : 0;
  });

  const toggleAsked = useCallback(
    (questionId: string) => {
      questions.value = questions.value.map((q) =>
        q.id === questionId ? { ...q, isAsked: !q.isAsked } : q,
      );
    },
    [questions],
  );

  const toggleExpanded = useCallback(
    (questionId: string) => {
      questions.value = questions.value.map((q) =>
        q.id === questionId ? { ...q, isExpanded: !q.isExpanded } : q,
      );
    },
    [questions],
  );

  const updateNotes = useCallback(
    (questionId: string, notes: string) => {
      questions.value = questions.value.map((q) =>
        q.id === questionId ? { ...q, notes } : q,
      );
    },
    [questions],
  );

  return {
    questions,
    isStarredFilterOn,
    selectedTags,
    filteredGroupedQuestions,
    askedCount,
    totalCount,
    progress,
    updateNotes,
    toggleExpanded,
    toggleAsked,
    allTags,
  };
}
