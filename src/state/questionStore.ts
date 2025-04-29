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
}) {
	const questions = useSignal(initial.questions);
	const selectedTags = useSignal(initial.selectedTags);

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

	// TODO: this one is really ugly
	const filteredGroupedQuestions = useComputed<
		[Record<string, QuestionWithState[]>, string | undefined]
	>(() => {
		if (selectedTags.value.length === 0)
			return [groupedQuestions.value, undefined];
		if (selectedTags.value.length === 1) {
			const selectedTag = selectedTags.value[0];
			return [
				Object.entries(groupedQuestions.value).reduce(
					(acc, [tag, questions]) => {
						acc[tag] = questions.map((q) => ({
							...q,
							isHidden: tag !== selectedTag,
						}));
						return acc;
					},
					{} as Record<string, QuestionWithState[]>,
				),
				undefined,
			];
		}

		const firstSelectedTag = selectedTags.value[0];
		const rest = selectedTags.value.slice(1);
		const commonTagName = selectedTags.value.join(", ");
		const grouping = Object.entries(groupedQuestions.value).reduce(
			(acc, [tag, questions]) => {
				acc[tag] = questions
					.map((q) => ({
						...q,
						isHidden:
							tag !== firstSelectedTag ||
							!rest.every((t) => q.tags.includes(t)),
					}))
					.sort((a) => (a.isHidden ? 1 : -1));
				return acc;
			},
			{} as Record<string, QuestionWithState[]>,
		);

		return [grouping, commonTagName];
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
